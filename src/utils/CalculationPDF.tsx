import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf, Link } from '@react-pdf/renderer'
import path from 'path'

// Register Montserrat fonts
if (typeof window === 'undefined') {
  const fontsDir = path.join(process.cwd(), 'src/utils/fonts')
  
  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: path.join(fontsDir, 'Montserrat-Regular.ttf'),
        fontWeight: 400,
      },
      {
        src: path.join(fontsDir, 'Montserrat-Bold.ttf'),
        fontWeight: 700,
      },
    ],
  })
}

// Define colors
const colors = {
  darkGray: '#1f2937',
  mediumGray: '#6b7280',
  lightGray: '#e5e7eb',
  bgGray: '#f9fafb',
  totalBg: '#fafafa',
  zinc800: '#27272a',
  zinc200: '#e4e4e7',
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '15mm 10mm',
    fontFamily: 'Montserrat',
    fontSize: 11,
    color: colors.darkGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.darkGray,
  },
  headerDivider: {
    height: 2,
    backgroundColor: colors.darkGray,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: colors.darkGray,
  },
  sectionBox: {
    backgroundColor: colors.bgGray,
    padding: 10,
    borderRadius: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 5,
  },
  label: {
    fontSize: 11,
    color: colors.mediumGray,
  },
  value: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.darkGray,
  },
  itemName: {
    fontSize: 11,
    color: colors.mediumGray,
    flex: 1,
  },
  subsectionHeader: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.mediumGray,
    textTransform: 'uppercase',
    paddingVertical: 5,
  },
  totalsBox: {
    backgroundColor: colors.totalBg,
    padding: 15,
    borderRadius: 2,
    marginTop: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.darkGray,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.zinc800,
  },
  totalsDivider: {
    height: 1,
    backgroundColor: colors.zinc200,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: '10mm',
    right: '10mm',
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: 15,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 5,
    color: colors.darkGray,
  },
  footerContact: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.darkGray,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
  },
  footerLink: {
    color: colors.darkGray,
    fontSize: 10,
    textDecoration: 'none',
  },
  footerSeparator: {
    marginHorizontal: 5,
    color: colors.darkGray,
    fontSize: 10,
  },
})

interface CalculationData {
  calculations: {
    area: number
    totalCost: number
    pricePerM2: number
    generalItems: Array<{ name: string; cost: number }>
    elementItems: Array<{ name: string; cost: number; isSectionTitle?: boolean }>
  }
  formData: {
    selectedFloor: string
  }
  config: {
    currency: string
  }
  calculationNumber: string
}

// PDF Document Component
export const CalculationPDFDocument: React.FC<CalculationData> = ({
  calculations,
  formData,
  config,
  calculationNumber,
}) => {
  const currency = config.currency || '₽'
  const formatPrice = (price: number) => `${price.toLocaleString()} ${currency}`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Расчет стоимости проектирования</Text>
          <View>
            <Text style={styles.headerText}>№ {calculationNumber}</Text>
            <Text style={{ fontSize: 12, color: colors.mediumGray, marginTop: 2 }}>
              {new Date().toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* Parameters */}
        <Text style={styles.sectionTitle}>Параметры проекта</Text>
        <View style={styles.sectionBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Площадь:</Text>
            <Text style={styles.value}>{calculations.area} м²</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.label}>Этажность:</Text>
            <Text style={styles.value}>{formData.selectedFloor}</Text>
          </View>
        </View>

        {/* General Items */}
        {calculations.generalItems && calculations.generalItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Проектируемые разделы</Text>
            <View style={styles.sectionBox}>
              {calculations.generalItems.map((item, index) => (
                <View key={index}>
                  <View style={styles.row}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.value}>{formatPrice(item.cost)}</Text>
                  </View>
                  {index < calculations.generalItems.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Additional Elements */}
        {calculations.elementItems && calculations.elementItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Дополнительные элементы</Text>
            <View style={styles.sectionBox}>
              {calculations.elementItems.map((item, index) => (
                <View key={index}>
                  {item.isSectionTitle ? (
                    <Text style={styles.subsectionHeader}>{item.name.toUpperCase()}</Text>
                  ) : (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.value}>{formatPrice(item.cost)}</Text>
                      </View>
                      {index < calculations.elementItems.length - 1 && (
                        <View style={styles.rowDivider} />
                      )}
                    </>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Totals */}
        <Text style={styles.sectionTitle}>Итоги расчета</Text>
        <View style={styles.totalsBox}>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Общая стоимость:</Text>
            <Text style={styles.totalValue}>{formatPrice(calculations.totalCost)}</Text>
          </View>
          <View style={styles.totalsDivider} />
          <View style={styles.row}>
            <Text style={styles.label}>Стоимость за м²:</Text>
            <Text style={styles.value}>{formatPrice(Math.round(calculations.pricePerM2))}/м²</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerTitle}>Формы и Нормы</Text>
          <View style={styles.footerLinks}>
            <Link src="tel:+79602823868" style={styles.footerLink}>
              <Text>+7 960 282 38 68</Text>
            </Link>
            <Text style={styles.footerSeparator}>•</Text>
            <Link src="mailto:mail@formnorm.ru" style={styles.footerLink}>
              <Text>mail@formnorm.ru</Text>
            </Link>
            <Text style={styles.footerSeparator}>•</Text>
            <Link src="https://formnorm.ru" style={styles.footerLink}>
              <Text>formnorm.ru</Text>
            </Link>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Helper function to generate PDF buffer
export async function generatePDFWithReactPDF(data: CalculationData): Promise<Buffer> {
  const pdfDoc = pdf(<CalculationPDFDocument {...data} />)
  const blob = await pdfDoc.toBlob()
  const arrayBuffer = await blob.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return buffer
}