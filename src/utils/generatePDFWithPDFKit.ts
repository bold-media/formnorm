import path from 'path'

interface CalculationData {
  calculations: {
    area: number
    totalCost: number
    pricePerM2: number
    generalItems: Array<{ name: string; cost: number }>
    elementItems: Array<{ name: string; cost: number; isSectionTitle?: boolean }>
    areaCoefficient: number
    floorCoefficient: number
  }
  formData: {
    selectedFloor: string
  }
  config: {
    currency: string
  }
  calculationNumber: string
}

export async function generatePDFWithPDFKit({
  calculations,
  formData,
  config,
  calculationNumber,
}: CalculationData): Promise<Buffer> {
  // Dynamic import to avoid webpack issues
  const PDFDocument = (await import('pdfkit')).default
  
  return new Promise((resolve, reject) => {
    try {
      const currency = config.currency || '₽'
      
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true
      })
      
      // Collect buffer chunks
      const chunks: Buffer[] = []
      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
      
      // Get fonts directory relative to project root
      const fontsDir = path.join(process.cwd(), 'src/utils/fonts')
      
      // Register fonts
      const regularFont = path.join(fontsDir, 'Montserrat-Regular.ttf')
      const boldFont = path.join(fontsDir, 'Montserrat-Bold.ttf')
      
      doc.registerFont('Montserrat', regularFont)
      doc.registerFont('Montserrat-Bold', boldFont)
      
      // Helper function to format price
      const formatPrice = (price: number) => `${price.toLocaleString()} ${currency}`
      
      // Color constants
      const darkGray = '#1f2937'
      const mediumGray = '#6b7280'
      const lightGray = '#e5e7eb'
      const bgGray = '#f9fafb'
      const totalBg = '#fafafa'
      
      // Start with header
      doc.font('Montserrat-Bold')
         .fontSize(18)
         .fillColor(darkGray)
         .text('Расчет стоимости проектирования', 40, 60)
      
      // Calculation number aligned right
      doc.text(`№ ${calculationNumber}`, 40, 60, {
        align: 'right',
        width: doc.page.width - 80
      })
      
      // Header line
      doc.moveTo(40, 90)
         .lineTo(doc.page.width - 40, 90)
         .strokeColor(darkGray)
         .lineWidth(2)
         .stroke()
      
      let y = 110
      
      // Parameters section
      doc.font('Montserrat-Bold')
         .fontSize(14)
         .fillColor(darkGray)
         .text('Параметры проекта', 40, y)
      
      y += 25
      
      // Draw background for parameters
      doc.rect(40, y, doc.page.width - 80, 50)
         .fillColor(bgGray)
         .fill()
      
      // Area parameter
      doc.font('Montserrat')
         .fontSize(11)
         .fillColor(mediumGray)
         .text('Площадь:', 50, y + 10)
      
      doc.font('Montserrat-Bold')
         .fillColor(darkGray)
         .text(`${calculations.area} м²`, 50, y + 10, {
           align: 'right',
           width: doc.page.width - 100
         })
      
      // Divider line
      doc.moveTo(50, y + 25)
         .lineTo(doc.page.width - 50, y + 25)
         .strokeColor(lightGray)
         .lineWidth(0.5)
         .stroke()
      
      // Floor parameter
      doc.font('Montserrat')
         .fontSize(11)
         .fillColor(mediumGray)
         .text('Этажность:', 50, y + 30)
      
      doc.font('Montserrat-Bold')
         .fillColor(darkGray)
         .text(formData.selectedFloor, 50, y + 30, {
           align: 'right',
           width: doc.page.width - 100
         })
      
      y += 70
      
      // General items section
      if (calculations.generalItems && calculations.generalItems.length > 0) {
        doc.font('Montserrat-Bold')
           .fontSize(14)
           .fillColor(darkGray)
           .text('Проектируемые разделы', 40, y)
        
        y += 25
        
        const itemsStartY = y
        const itemsHeight = calculations.generalItems.length * 20 + 10
        
        // Background
        doc.rect(40, y, doc.page.width - 80, itemsHeight)
           .fillColor(bgGray)
           .fill()
        
        // Items
        calculations.generalItems.forEach((item, index) => {
          doc.font('Montserrat')
             .fontSize(11)
             .fillColor(mediumGray)
             .text(item.name, 50, y + 5)
          
          doc.font('Montserrat-Bold')
             .fillColor(darkGray)
             .text(formatPrice(item.cost), 50, y + 5, {
               align: 'right',
               width: doc.page.width - 100
             })
          
          y += 20
          
          // Divider (except last)
          if (index < calculations.generalItems.length - 1) {
            doc.moveTo(50, y - 5)
               .lineTo(doc.page.width - 50, y - 5)
               .strokeColor(lightGray)
               .lineWidth(0.5)
               .stroke()
          }
        })
        
        y += 20
      }
      
      // Additional elements section
      if (calculations.elementItems && calculations.elementItems.length > 0) {
        // Check if we need a new page
        if (y > 600) {
          doc.addPage()
          y = 60
        }
        
        doc.font('Montserrat-Bold')
           .fontSize(14)
           .fillColor(darkGray)
           .text('Дополнительные элементы', 40, y)
        
        y += 25
        
        const elementsStartY = y
        const elementsHeight = calculations.elementItems.length * 20 + 10
        
        // Background
        doc.rect(40, y, doc.page.width - 80, elementsHeight)
           .fillColor(bgGray)
           .fill()
        
        // Items
        calculations.elementItems.forEach((item, index) => {
          if (item.isSectionTitle) {
            // Section title
            doc.font('Montserrat-Bold')
               .fontSize(10)
               .fillColor(mediumGray)
               .text(item.name.toUpperCase(), 50, y + 5)
          } else {
            // Regular item
            doc.font('Montserrat')
               .fontSize(11)
               .fillColor(mediumGray)
               .text(item.name, 50, y + 5)
            
            doc.font('Montserrat-Bold')
               .fillColor(darkGray)
               .text(formatPrice(item.cost), 50, y + 5, {
                 align: 'right',
                 width: doc.page.width - 100
               })
          }
          
          y += 20
          
          // Divider (except last)
          if (index < calculations.elementItems.length - 1) {
            doc.moveTo(50, y - 5)
               .lineTo(doc.page.width - 50, y - 5)
               .strokeColor(lightGray)
               .lineWidth(0.5)
               .stroke()
          }
        })
        
        y += 20
      }
      
      // Check if we need a new page for totals
      if (y > 650) {
        doc.addPage()
        y = 60
      }
      
      // Totals section
      doc.font('Montserrat-Bold')
         .fontSize(14)
         .fillColor(darkGray)
         .text('Итоги расчета', 40, y)
      
      y += 25
      
      // Totals background
      doc.rect(40, y, doc.page.width - 80, 60)
         .fillColor(totalBg)
         .fill()
      
      // Total cost
      doc.font('Montserrat-Bold')
         .fontSize(14)
         .fillColor(darkGray)
         .text('Общая стоимость:', 55, y + 10)
      
      doc.fontSize(16)
         .fillColor('#27272a')
         .text(formatPrice(calculations.totalCost), 55, y + 10, {
           align: 'right',
           width: doc.page.width - 110
         })
      
      // Divider
      doc.moveTo(55, y + 30)
         .lineTo(doc.page.width - 55, y + 30)
         .strokeColor('#e4e4e7')
         .lineWidth(0.5)
         .stroke()
      
      // Price per m2
      doc.font('Montserrat')
         .fontSize(11)
         .fillColor(mediumGray)
         .text('Стоимость за м²:', 55, y + 38)
      
      doc.text(`${formatPrice(Math.round(calculations.pricePerM2))}/м²`, 55, y + 38, {
        align: 'right',
        width: doc.page.width - 110
      })
      
      // Footer at bottom of page
      const footerY = doc.page.height - 100
      
      // Footer line
      doc.moveTo(40, footerY)
         .lineTo(doc.page.width - 40, footerY)
         .strokeColor(lightGray)
         .lineWidth(1)
         .stroke()
      
      // Company name
      doc.font('Montserrat-Bold')
         .fontSize(14)
         .fillColor(darkGray)
         .text('Формы и Нормы', 40, footerY + 15, {
           align: 'center',
           width: doc.page.width - 80
         })
      
      // Contact info
      doc.font('Montserrat')
         .fontSize(10)
         .fillColor(darkGray)
         .text('+7 960 282 38 68 • mail@formnorm.ru • formnorm.ru', 40, footerY + 35, {
           align: 'center',
           width: doc.page.width - 80
         })
      
      // Finalize the PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}