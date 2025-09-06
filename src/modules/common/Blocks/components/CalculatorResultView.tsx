'use client'

import React from 'react'
import { CalculatorResult as CalculatorResultType } from '@payload-types'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Download, Share2, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface CalculatorResultViewProps {
  result: CalculatorResultType
}

const formatPrice = (price: number, currency: string = '₽') =>
  `${price.toLocaleString()} ${currency}`

const CalculatorResultView: React.FC<CalculatorResultViewProps> = ({ result }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false)

  // Extract metadata
  const metadata = result.metadata as any
  const calculations = metadata?.calculations || {}
  const formData = metadata?.formData || {}
  const config = metadata?.config || {}
  const currency = config?.currency || '₽'

  const handleDownloadPDF = async () => {
    // Check if PDF is already uploaded
    if (result.url) {
      // Direct download from uploaded file
      const link = document.createElement('a')
      link.href = result.url
      link.download = `calculation-${result.calculationNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Otherwise generate on demand (fallback)
    setIsGeneratingPDF(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculationId: result.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Download PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `calculation-${result.calculationNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Ошибка при создании PDF')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Расчет ${result.calculationNumber}`,
          text: `Расчет стоимости проектирования`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled share
        console.log('Share cancelled')
      }
    } else {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Ссылка скопирована в буфер обмена')
      } catch (error) {
        toast.error('Не удалось скопировать ссылку')
      }
    }
  }

  const handleSendEmail = () => {
    // Placeholder for email functionality
    alert('Функция отправки по email будет добавлена позже')
  }

  return (
    <div className="container pt-6 md:pt-12 pb-12 md:pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Расчет {result.calculationNumber}</h1>
        <p className="text-muted-foreground">
          Создан {new Date(result.createdAt).toLocaleDateString('ru-RU')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          {(result.clientName || result.contactInfo?.email || result.contactInfo?.phone) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.clientName && (
                  <div>
                    <span className="text-muted-foreground">Имя:</span> {result.clientName}
                  </div>
                )}
                {result.contactInfo?.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span> {result.contactInfo.email}
                  </div>
                )}
                {result.contactInfo?.phone && (
                  <div>
                    <span className="text-muted-foreground">Телефон:</span>{' '}
                    {result.contactInfo.phone}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Параметры расчета</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Площадь:</span>
                  <p className="font-medium">{calculations.area} м²</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Этажность:</span>
                  <p className="font-medium">{formData.selectedFloor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          {calculations.generalItems && calculations.generalItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Услуги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculations.generalItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between gap-4">
                      <span className="text-muted-foreground flex-1">{item.name}</span>
                      <span className="font-medium whitespace-nowrap">
                        {formatPrice(item.cost, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional elements */}
          {calculations.elementItems && calculations.elementItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {config.interfaceTexts?.additionalElementsTitle || 'Дополнительные элементы'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculations.elementItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={
                        item.isSectionTitle ? 'font-medium mt-3' : 'flex justify-between gap-4'
                      }
                    >
                      {item.isSectionTitle ? (
                        <span>{item.name}</span>
                      ) : (
                        <>
                          <span className="text-muted-foreground flex-1">{item.name}</span>
                          <span className="font-medium whitespace-nowrap">
                            {formatPrice(item.cost, currency)}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Total & Actions */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Итого</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Общая стоимость</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(calculations.totalCost || 0, currency)}
                  </p>
                </div>

                <div className="text-center py-3 bg-secondary/50 rounded">
                  <p className="text-sm text-muted-foreground mb-1">Цена за м²</p>
                  <p className="text-xl font-semibold">
                    {formatPrice(Math.round(calculations.pricePerM2 || 0), currency)}
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? 'Генерация PDF...' : 'Скачать PDF'}
                  </Button>

                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Поделиться
                  </Button>

                  {/* <Button onClick={handleSendEmail} variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Отправить на email
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalculatorResultView
