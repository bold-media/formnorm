import { NextRequest, NextResponse } from 'next/server'

// Используем puppeteer-core в продакшене для лучшей совместимости с Docker
const puppeteer =
  process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer')

export async function POST(request: NextRequest) {
  try {
    const { html, filename } = await request.json()

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 })
    }

    console.log('Starting PDF generation...')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH)

    // Запускаем браузер с дополнительными опциями для продакшена
    const launchOptions = {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    }

    console.log('Launch options:', launchOptions)

    const browser = await puppeteer.launch(launchOptions)

    console.log('Browser launched successfully')

    try {
      const page = await browser.newPage()
      console.log('New page created')

      // Устанавливаем размер страницы
      await page.setViewport({ width: 1200, height: 800 })
      console.log('Viewport set')

      // Загружаем HTML контент
      await page.setContent(html, { waitUntil: 'networkidle0' })
      console.log('HTML content loaded')

      // Генерируем PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      })

      console.log('PDF generated successfully, size:', pdfBuffer.length)

      await browser.close()
      console.log('Browser closed')

      // Возвращаем PDF как blob
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename || 'calculation.pdf'}"`,
        },
      })
    } catch (error) {
      console.error('Error in PDF generation process:', error)
      await browser.close()
      throw error
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
