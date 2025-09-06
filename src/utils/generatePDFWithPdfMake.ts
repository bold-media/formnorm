import { TDocumentDefinitions, Content } from 'pdfmake/interfaces'

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

// Create a wrapper to handle the dynamic import properly
async function createPdfMake() {
  // Use dynamic import to avoid webpack bundling issues
  const pdfMakeModule = await eval(`import('pdfmake/build/pdfmake.js')`)
  const pdfFontsModule = await eval(`import('pdfmake/build/vfs_fonts.js')`)
  
  const pdfMake = pdfMakeModule.default || pdfMakeModule
  const pdfFonts = pdfFontsModule.default || pdfFontsModule
  
  // Set up the virtual file system
  if (pdfMake.vfs === undefined) {
    pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
  }
  
  return pdfMake
}

export async function generatePDFWithPdfMake({
  calculations,
  formData,
  config,
  calculationNumber,
}: CalculationData): Promise<Buffer> {
  const pdfMake = await createPdfMake()
  
  const currency = config.currency || '₽'
  
  // Helper function to format price
  const formatPrice = (price: number) => `${price.toLocaleString()} ${currency}`
  
  // Build content array
  const content: Content = []
  
  // Header with calculation number
  content.push({
    columns: [
      { text: 'Расчет стоимости проектирования', style: 'header' },
      { text: `№ ${calculationNumber}`, style: 'header', alignment: 'right' }
    ],
    margin: [0, 0, 0, 10]
  })
  
  // Divider line
  content.push({
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 5,
      x2: 515,
      y2: 5,
      lineWidth: 2,
      lineColor: '#1f2937'
    }],
    margin: [0, 0, 0, 20]
  })
  
  // Parameters section
  content.push({
    text: 'Параметры проекта',
    style: 'sectionHeader',
    margin: [0, 0, 0, 10]
  })
  
  content.push({
    table: {
      widths: ['*', 'auto'],
      body: [
        [
          { text: 'Площадь:', style: 'label' },
          { text: `${calculations.area} м²`, style: 'value', alignment: 'right' }
        ],
        [
          { text: 'Этажность:', style: 'label' },
          { text: formData.selectedFloor, style: 'value', alignment: 'right' }
        ]
      ]
    },
    layout: {
      fillColor: function(rowIndex: number) {
        return '#f9fafb'
      },
      hLineWidth: function(i: number, node: any) {
        return (i === 0 || i === node.table.body.length) ? 0 : 1
      },
      vLineWidth: function() {
        return 0
      },
      hLineColor: function() {
        return '#e5e7eb'
      },
      paddingLeft: function() { return 10 },
      paddingRight: function() { return 10 },
      paddingTop: function() { return 5 },
      paddingBottom: function() { return 5 }
    },
    margin: [0, 0, 0, 20]
  })
  
  // General items section
  if (calculations.generalItems && calculations.generalItems.length > 0) {
    content.push({
      text: 'Проектируемые разделы',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })
    
    const generalItemsBody = calculations.generalItems.map((item) => [
      { text: item.name, style: 'itemName' },
      { text: formatPrice(item.cost), style: 'value', alignment: 'right' }
    ])
    
    content.push({
      table: {
        widths: ['*', 'auto'],
        body: generalItemsBody
      },
      layout: {
        fillColor: function() {
          return '#f9fafb'
        },
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1
        },
        vLineWidth: function() {
          return 0
        },
        hLineColor: function() {
          return '#e5e7eb'
        },
        paddingLeft: function() { return 10 },
        paddingRight: function() { return 10 },
        paddingTop: function() { return 5 },
        paddingBottom: function() { return 5 }
      },
      margin: [0, 0, 0, 20]
    })
  }
  
  // Additional elements section
  if (calculations.elementItems && calculations.elementItems.length > 0) {
    content.push({
      text: 'Дополнительные элементы',
      style: 'sectionHeader',
      margin: [0, 0, 0, 10]
    })
    
    const elementItemsBody = calculations.elementItems.map((item) => {
      if (item.isSectionTitle) {
        return [
          { text: item.name.toUpperCase(), style: 'subsectionHeader', colSpan: 2 },
          {}
        ]
      } else {
        return [
          { text: item.name, style: 'itemName' },
          { text: formatPrice(item.cost), style: 'value', alignment: 'right' }
        ]
      }
    })
    
    content.push({
      table: {
        widths: ['*', 'auto'],
        body: elementItemsBody
      },
      layout: {
        fillColor: function() {
          return '#f9fafb'
        },
        hLineWidth: function(i: number, node: any) {
          return (i === 0 || i === node.table.body.length) ? 0 : 1
        },
        vLineWidth: function() {
          return 0
        },
        hLineColor: function() {
          return '#e5e7eb'
        },
        paddingLeft: function() { return 10 },
        paddingRight: function() { return 10 },
        paddingTop: function() { return 5 },
        paddingBottom: function() { return 5 }
      },
      margin: [0, 0, 0, 20]
    })
  }
  
  // Totals section
  content.push({
    text: 'Итоги расчета',
    style: 'sectionHeader',
    margin: [0, 0, 0, 10]
  })
  
  content.push({
    table: {
      widths: ['*', 'auto'],
      body: [
        [
          { text: 'Общая стоимость:', style: 'totalLabel' },
          { text: formatPrice(calculations.totalCost), style: 'totalValue', alignment: 'right' }
        ],
        [
          { text: 'Стоимость за м²:', style: 'label', margin: [0, 5, 0, 0] },
          { text: `${formatPrice(Math.round(calculations.pricePerM2))}/м²`, style: 'value', alignment: 'right', margin: [0, 5, 0, 0] }
        ]
      ]
    },
    layout: {
      fillColor: function() {
        return '#fafafa'
      },
      hLineWidth: function(i: number) {
        return i === 1 ? 1 : 0
      },
      vLineWidth: function() {
        return 0
      },
      hLineColor: function() {
        return '#e4e4e7'
      },
      paddingLeft: function() { return 15 },
      paddingRight: function() { return 15 },
      paddingTop: function() { return 10 },
      paddingBottom: function() { return 10 }
    }
  })
  
  // Footer line
  content.push({
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 5,
      x2: 515,
      y2: 5,
      lineWidth: 1,
      lineColor: '#e5e7eb'
    }],
    margin: [0, 30, 0, 10]
  })
  
  // Footer
  content.push({
    text: 'Формы и Нормы',
    style: 'footerTitle',
    alignment: 'center',
    margin: [0, 0, 0, 5]
  })
  
  content.push({
    text: '+7 960 282 38 68 • mail@formnorm.ru • formnorm.ru',
    style: 'footerContact',
    alignment: 'center'
  })
  
  // Document definition
  const docDefinition: TDocumentDefinitions = {
    content: content,
    defaultStyle: {
      font: 'Roboto' // pdfmake doesn't have Montserrat built-in, we'll need to use Roboto for now
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#1f2937'
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: '#1f2937'
      },
      subsectionHeader: {
        fontSize: 10,
        bold: true,
        color: '#6b7280'
      },
      label: {
        fontSize: 11,
        color: '#6b7280'
      },
      value: {
        fontSize: 11,
        bold: true,
        color: '#1f2937'
      },
      itemName: {
        fontSize: 11,
        color: '#6b7280'
      },
      totalLabel: {
        fontSize: 14,
        bold: true,
        color: '#1f2937'
      },
      totalValue: {
        fontSize: 16,
        bold: true,
        color: '#27272a'
      },
      footerTitle: {
        fontSize: 14,
        bold: true,
        color: '#1f2937'
      },
      footerContact: {
        fontSize: 10,
        color: '#1f2937'
      }
    },
    pageMargins: [40, 60, 40, 60]
  }
  
  // Create PDF and get as buffer
  return new Promise((resolve, reject) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition)
    pdfDocGenerator.getBuffer((buffer: Buffer) => {
      resolve(buffer)
    })
  })
}