import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf, Link,  } from '@react-pdf/renderer'
import { internalDocToHref } from './internalDocToHref'

// Register fonts - using Google Fonts URLs for production reliability
if (typeof window === 'undefined') {
  try {
    Font.register({
      family: 'Montserrat',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf',
          fontWeight: 400,
        },
        {
          src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WRhyzbi.ttf',
          fontWeight: 700,
        },
      ],
    })
    console.log('Fonts registered successfully')
  } catch (error) {
    console.error('Failed to register fonts:', error)
    // PDF will use default fonts if registration fails
  }
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
  headerRight: {
    alignItems: 'flex-end',
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
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 5,
  },
  label: {
    fontSize: 11,
    color: colors.mediumGray,
    flexShrink: 0,
  },
  value: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.darkGray,
    flexShrink: 0,
    marginLeft: 10,
  },
  parameterValue: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.darkGray,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  itemName: {
    fontSize: 11,
    color: colors.mediumGray,
    flex: 1,
    marginRight: 10,
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
    marginTop: 10,
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
    pdfSuffixContent?: {
      title: string
      content: any
    }
  }
  calculationNumber: string
}

// Helper function to render Lexical rich text content to PDF
const renderRichTextToPDF = (content: any): React.ReactNode => {
  try {
    if (!content || !content.root || !content.root.children) {
      return null
    }

    const extractTextFromNode = (node: any): string => {
      if (node.type === 'text') {
        return node.text || ''
      }
      if (node.children) {
        return node.children.map((child: any) => extractTextFromNode(child)).join('')
      }
      return ''
    }

    const extractLinkUrl = (node: any): string => {
      if (node.fields) {
        if (node.fields.linkType === 'custom' && node.fields.url) {
          let url = node.fields.url
          // Ensure URL has protocol
          if (
            !url.startsWith('http://') &&
            !url.startsWith('https://') &&
            !url.startsWith('mailto:') &&
            !url.startsWith('tel:')
          ) {
            url = `https://${url}`
          }
          return url
        } else if (node.fields.linkType === 'internal' && node.fields.doc) {
          const internalPath = internalDocToHref({ linkNode: node })
          // Prefix with app URL for PDF links
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formnorm.ru'
          return `${appUrl}${internalPath}`
        }
      }
      return '#'
    }

    const renderParagraph = (node: any, key: string): React.ReactNode => {
      const children = node.children || []

      // Check if paragraph contains links
      const elements: Array<{ type: 'text' | 'link'; content: string; url?: string }> = []

      children.forEach((child: any) => {
        if (child.type === 'text') {
          elements.push({ type: 'text', content: child.text || '' })
        } else if (child.type === 'link') {
          const url = extractLinkUrl(child)
          const text = extractTextFromNode(child)
          elements.push({ type: 'link', content: text, url })
        } else if (child.children) {
          // Handle nested structures
          child.children.forEach((grandchild: any) => {
            if (grandchild.type === 'text') {
              elements.push({ type: 'text', content: grandchild.text || '' })
            } else if (grandchild.type === 'link') {
              const url = extractLinkUrl(grandchild)
              const text = extractTextFromNode(grandchild)
              elements.push({ type: 'link', content: text, url })
            }
          })
        }
      })

      // If no links, render as simple text
      if (!elements.some((el) => el.type === 'link')) {
        const text = elements.map((el) => el.content).join('')
        return (
          <View key={key} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, color: colors.darkGray, lineHeight: 1.5 }}>{text}</Text>
          </View>
        )
      }

      // Render paragraph with inline text and links
      return (
        <View key={key} style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 11, color: colors.darkGray, lineHeight: 1.5 }}>
            {elements.map((el, idx) => {
              if (el.type === 'link' && el.url) {
                return (
                  <Link
                    key={idx}
                    src={el.url}
                    style={{ color: colors.darkGray, textDecoration: 'underline' }}
                  >
                    {el.content}
                  </Link>
                )
              } else {
                return el.content
              }
            })}
          </Text>
        </View>
      )
    }

    const renderListItem = (item: any, index: number, isOrdered: boolean): React.ReactNode => {
      const bullet = isOrdered ? `${index + 1}.` : '•'
      const itemContent = item.children || []

      // Extract all text and links from list item
      const elements: Array<{ type: 'text' | 'link'; content: string; url?: string }> = []

      const processNode = (node: any) => {
        if (node.type === 'text') {
          elements.push({ type: 'text', content: node.text || '' })
        } else if (node.type === 'link') {
          const url = extractLinkUrl(node)
          const text = extractTextFromNode(node)
          elements.push({ type: 'link', content: text, url })
        } else if (node.children) {
          node.children.forEach((child: any) => processNode(child))
        }
      }

      itemContent.forEach((child: any) => processNode(child))

      // Render list item
      return (
        <View style={{ flexDirection: 'row', marginBottom: 4, paddingLeft: 10 }}>
          <Text style={{ fontSize: 11, marginRight: 8, width: 20 }}>{bullet}</Text>
          <View style={{ flex: 1 }}>
            {elements.every((el) => el.type === 'text') ? (
              // Simple text-only list item
              <Text style={{ fontSize: 11, color: colors.darkGray }}>
                {elements.map((el) => el.content).join('')}
              </Text>
            ) : (
              // List item with links
              <Text style={{ fontSize: 11, color: colors.darkGray }}>
                {elements.map((el, idx) => {
                  if (el.type === 'link' && el.url) {
                    return (
                      <Link
                        key={idx}
                        src={el.url}
                        style={{ color: colors.darkGray, textDecoration: 'underline' }}
                      >
                        {el.content}
                      </Link>
                    )
                  } else {
                    return el.content
                  }
                })}
              </Text>
            )}
          </View>
        </View>
      )
    }

    const renderNode = (node: any, key: string): React.ReactNode => {
      if (node.type === 'paragraph') {
        return renderParagraph(node, key)
      }

      if (node.type === 'list') {
        const isOrdered = node.listType === 'number' || node.tag === 'ol'
        return (
          <View key={key} style={{ marginBottom: 8 }}>
            {node.children?.map((item: any, idx: number) => {
              if (item.type === 'listitem') {
                return <View key={idx}>{renderListItem(item, idx, isOrdered)}</View>
              }
              return null
            })}
          </View>
        )
      }

      return null
    }

    return (
      <View>
        {content.root.children.map((node: any, idx: number) => renderNode(node, `node-${idx}`))}
      </View>
    )
  } catch (error) {
    console.error('Error rendering rich text to PDF:', error)
    return (
      <View>
        <Text style={{ fontSize: 11, color: colors.darkGray }}>
          [Rich text content could not be rendered]
        </Text>
      </View>
    )
  }
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
          <View style={styles.headerRight}>
            <Text style={[styles.headerText, { textAlign: 'right' }]}>№ {calculationNumber}</Text>
            <Text style={{ fontSize: 12, color: colors.mediumGray, marginTop: 2, textAlign: 'right' }}>
              {new Date().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
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
            <Text style={styles.parameterValue}>{calculations.area} м²</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.label}>Этажность:</Text>
            <Text style={styles.parameterValue}>{formData.selectedFloor}</Text>
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

        {/* PDF Suffix Content */}
        {config.pdfSuffixContent && (
          <View style={{ marginTop: 30 }}>
            {config.pdfSuffixContent.title && (
              <Text style={styles.sectionTitle}>{config.pdfSuffixContent.title}</Text>
            )}
            {config.pdfSuffixContent.content && (
              <View style={{ marginTop: 10 }}>
                {renderRichTextToPDF(config.pdfSuffixContent.content)}
              </View>
            )}
          </View>
        )}

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
