'use client'

import React from 'react'
import { CalculatorResult as CalculatorResultType } from '@payload-types'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Download, Share2, FileText, Send } from 'lucide-react'
import { toast } from 'sonner'
import { RenderForm } from '@/modules/forms/RenderForm'
import type { Form } from '@payload-types'

interface ButtonTexts {
  formButton: string
  formButtonHide: string
  downloadPdf: string
  downloadPdfLoading: string
  share: string
  telegram: string
}

interface CalculatorResultViewProps {
  result: CalculatorResultType
  form?: Form | null
  buttonTexts?: ButtonTexts
}

const formatPrice = (price: number, currency: string = '₽') =>
  `${price.toLocaleString()} ${currency}`

const CalculatorResultView: React.FC<CalculatorResultViewProps> = ({
  result,
  form,
  buttonTexts,
}) => {
  // Дефолтные тексты кнопок
  const texts = buttonTexts || {
    formButton: 'Заполнить форму',
    formButtonHide: 'Скрыть форму',
    downloadPdf: 'Скачать PDF',
    downloadPdfLoading: 'Генерация PDF...',
    share: 'Поделиться',
    telegram: 'Поделиться в Telegram',
  }
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)

  // Check if we're in the admin panel
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    // Check if the current URL contains /admin
    if (typeof window !== 'undefined') {
      setIsAdmin(window.location.pathname.includes('/admin'))
    }
  }, [])

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

  const handleShareToTelegram = () => {
    // Get the current page URL
    const currentUrl = window.location.href

    // Get calculation details
    const calcNumber = result.calculationNumber || 'N/A'
    const totalCost = calculations.totalCost || 0
    const area = calculations.area || 0
    const pricePerM2 = calculations.pricePerM2 || 0
    const floor = formData.selectedFloor || 'Не указано'

    // Create a cleaner message without complex Unicode characters
    // Using simple line breaks and basic formatting
    const message = `Расчет стоимости проектирования №${calcNumber}

Параметры:
• Площадь: ${area} м²
• Этажность: ${floor}

Результаты:
• Цена за м²: ${Math.round(pricePerM2).toLocaleString('ru-RU')} ${currency}
• Общая стоимость: ${totalCost.toLocaleString('ru-RU')} ${currency}

Дата: ${new Date(result.createdAt).toLocaleDateString('ru-RU')}

Подробнее:`

    // Create Telegram share URL
    // Important: URL should be separate, not encoded with the text
    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(message)}&url=${encodeURIComponent(currentUrl)}`

    // Open in a popup window with specific dimensions
    window.open(
      telegramUrl,
      'telegram-share',
      'width=550,height=450,toolbar=0,menubar=0,location=0,status=0'
    )
  }

  const toggleForm = () => {
    setShowForm(!showForm)
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
          {/* Client info - Only visible in admin */}
          {isAdmin &&
            (result.clientName || result.contactInfo?.email || result.contactInfo?.phone) && (
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
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {result.contactInfo.email}
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
                  {form && (
                    <>
                      <Button onClick={toggleForm} className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        {showForm ? texts.formButtonHide : texts.formButton}
                      </Button>

                      {showForm && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                          <RenderForm
                            form={form}
                            showTitle={true}
                            buttonClassName="mt-4"
                            onSuccess={async (submissionData) => {
                              // Скрываем форму после успешной отправки
                              setShowForm(false)

                              // Sync form data with calculator result
                              if (submissionData && result?.id) {
                                const updateData: any = {}
                                let hasData = false

                                // Map form fields to calculator result fields
                                submissionData.forEach(({ field, value }) => {
                                  const fieldLower = field.toLowerCase()

                                  // Check for name field
                                  if (
                                    (fieldLower === 'name' ||
                                      fieldLower === 'clientname' ||
                                      fieldLower === 'fullname' ||
                                      fieldLower.includes('name')) &&
                                    value
                                  ) {
                                    updateData.clientName = String(value)
                                    hasData = true
                                  }

                                  // Check for email field
                                  if (
                                    (fieldLower === 'email' || fieldLower.includes('email')) &&
                                    value
                                  ) {
                                    if (!updateData.contactInfo) updateData.contactInfo = {}
                                    updateData.contactInfo.email = String(value)
                                    hasData = true
                                  }

                                  // Check for phone field
                                  if (
                                    (fieldLower === 'phone' ||
                                      fieldLower === 'tel' ||
                                      fieldLower.includes('phone') ||
                                      fieldLower.includes('mobile')) &&
                                    value
                                  ) {
                                    if (!updateData.contactInfo) updateData.contactInfo = {}
                                    updateData.contactInfo.phone = String(value)
                                    hasData = true
                                  }
                                })

                                // Update calculator result if we have matching data
                                if (hasData) {
                                  try {
                                    const response = await fetch(
                                      `/api/update-calculator-result/${result.id}`,
                                      {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          ...updateData,
                                          calculationNumber: result.calculationNumber,
                                        }),
                                      },
                                    )

                                    // Silently update without notification
                                    if (!response.ok) {
                                      console.error('Failed to update calculator result')
                                    }
                                  } catch (error) {
                                    console.error('Error updating calculator result:', error)
                                  }
                                }
                              }
                            }}
                            // submissionContext={{
                            //   calculatorResultId: result?.id,
                            // }}
                            extraData={{
                              calculatorResult: result?.id,
                            }}
                          >
                            {form.title && (
                              <h3 className="text-lg font-semibold mb-4">{form.title}</h3>
                            )}
                          </RenderForm>
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? texts.downloadPdfLoading : texts.downloadPdf}
                  </Button>

                  <Button onClick={handleShare} variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    {texts.share}
                  </Button>

                  <Button onClick={handleShareToTelegram} variant="outline" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {texts.telegram}
                  </Button>
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
