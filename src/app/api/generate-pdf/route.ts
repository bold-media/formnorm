import { NextRequest, NextResponse } from 'next/server'

// Use puppeteer-core in production for better Docker compatibility
const puppeteer =
  process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer')

export async function POST(request: NextRequest) {
  try {
    console.log('=== PDF Generation Request Started ===')
    const { html, filename } = await request.json()

    if (!html) {
      console.log('ERROR: No HTML content provided')
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 })
    }

    console.log('Starting PDF generation...')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH)
    console.log('HTML length:', html.length)
    console.log('Filename:', filename)

    // Launch browser with additional options for production
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-background-networking',
        '--disable-component-extensions-with-background-pages',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-domain-reliability',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--memory-pressure-off',
        '--max_old_space_size=4096',
      ],
    }

    // In production, use system Chromium
    if (process.env.NODE_ENV === 'production') {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
      console.log('Using production executable path:', launchOptions.executablePath)
    }

    console.log('Launch options:', launchOptions)

    console.log('Attempting to launch browser...')
    let browser
    try {
      browser = await puppeteer.launch(launchOptions)
      console.log('Browser launched successfully')
    } catch (launchError) {
      console.error('Primary launch failed:', launchError)
      
      // Try alternative launch options
      console.log('Trying alternative launch options...')
      const alternativeOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--single-process',
        ],
      }
      
      if (process.env.NODE_ENV === 'production') {
        alternativeOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
      }
      
      browser = await puppeteer.launch(alternativeOptions)
      console.log('Browser launched with alternative options')
    }

    try {
      const page = await browser.newPage()
      console.log('New page created')

      // Set timeouts
      page.setDefaultTimeout(30000) // 30 seconds
      page.setDefaultNavigationTimeout(30000) // 30 seconds

      // Set page size
      await page.setViewport({ width: 1200, height: 800 })
      console.log('Viewport set')

      // Load HTML content with timeout
      console.log('Loading HTML content...')
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      })
      console.log('HTML content loaded')

      // Wait a bit for any dynamic content
      await page.waitForTimeout(2000)
      console.log('Waited for dynamic content')

      // Generate PDF with timeout
      console.log('Starting PDF generation...')
      const pdfBuffer = await Promise.race([
        page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm',
          },
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout')), 30000)
        )
      ]) as Buffer

      console.log('PDF generated successfully, size:', pdfBuffer.length)
      console.log('PDF buffer type:', typeof pdfBuffer)
      console.log('PDF buffer is array:', Array.isArray(pdfBuffer))

      // Close page first
      await page.close()
      console.log('Page closed')

      // Close browser safely
      try {
        await browser.close()
        console.log('Browser closed successfully')
      } catch (closeError) {
        console.log('Browser close error (non-critical):', closeError)
      }

      // Return PDF as blob
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || 'calculation.pdf'}"`,
        },
      })
    } catch (error) {
      console.error('Error in PDF generation process:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
      
      // Close browser safely even on error
      try {
        await browser.close()
        console.log('Browser closed after error')
      } catch (closeError) {
        console.log('Browser close error after main error (non-critical):', closeError)
      }
      
      throw error
    }
  } catch (error) {
    console.error('=== PDF Generation Failed ===')
    console.error('Error generating PDF:', error)
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : 'No message')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
