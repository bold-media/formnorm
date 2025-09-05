'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup'
import { Label } from '@/components/Label'

// ============= ТИПЫ =============
interface ServiceOption {
  name: string
  pricePerM2: number
  description?: string
}

interface Service {
  name: string
  pricePerM2?: number
  fixedPrice?: number
  ignoreArea?: boolean
  hasOptions?: boolean
  options?: ServiceOption[]
  fieldType?: string
  radioGroup?: string
  isDefault?: boolean
  isRequired?: boolean
}

interface ServiceSection {
  title: string
  services: Service[]
}

interface AdditionalElement {
  name: string
  price: number
  isDefault?: boolean
}

interface AdditionalSection {
  title: string
  fieldType: 'checkbox' | 'radio'
  elements: AdditionalElement[]
}

interface CalculatorConfig {
  title: string
  currency: string
  areaSettings: {
    label: string
    placeholder: string
    defaultArea: number
    areaCoefficients?: Array<{
      label: string
      minArea: number
      maxArea?: number
      coefficient: number
    }>
  }
  floorSettings: {
    label: string
    floorOptions: Array<{ name: string; coefficient: number; isDefault?: boolean }>
  }
  servicesSections: ServiceSection[]
  additionalSections: AdditionalSection[]
  interfaceTexts: {
    totalPriceLabel: string
    pricePerM2Label: string
    resetButtonText: string
    additionalElementsTitle: string
  }
}

// ============= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =============
const formatPrice = (price: number, currency: string) => `${price.toLocaleString()} ${currency}`

const getServicePriceDisplay = (service: Service, currency: string) => {
  if (service.hasOptions && service.options?.length) {
    const minPrice = Math.min(...service.options.map((opt) => opt.pricePerM2 || 0))
    return `от ${minPrice} ${currency}/м²`
  }
  if (service.ignoreArea) {
    return service.fixedPrice ? formatPrice(service.fixedPrice, currency) : 'Цена не указана'
  }
  return `${service.pricePerM2 || 0} ${currency}/м²`
}

// ============= КОМПОНЕНТЫ =============

// Компонент для услуги с опциями
const ServiceItem: React.FC<{
  service: Service
  isSelected: boolean
  onToggle: () => void
  selectedOption?: string
  onOptionChange: (serviceName: string, optionName: string) => void
  currency: string
}> = ({ service, isSelected, onToggle, selectedOption, onOptionChange, currency }) => (
  <div className="space-y-3">
    <div className="flex items-start space-x-3">
      <Checkbox checked={isSelected} onCheckedChange={onToggle} className="mt-0.5" />
      <Label className="flex-1 flex justify-between items-center cursor-pointer">
        <span className="font-normal text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {service.name}
        </span>
        <span className="text-base text-muted-foreground whitespace-nowrap">
          {getServicePriceDisplay(service, currency)}
        </span>
      </Label>
    </div>

    {service.hasOptions && isSelected && service.options && (
      <Card className="ml-6 p-3 bg-secondary/20 border-secondary">
        <CardContent className="p-0 space-y-2">
          <p className="text-sm font-medium text-secondary-foreground mb-2">Выберите вариант:</p>
          <RadioGroup
            value={selectedOption}
            onValueChange={(value: string) => onOptionChange(service.name, value)}
          >
            {service.options.map((option) => (
              <div key={option.name} className="flex items-center space-x-2">
                <RadioGroupItem value={option.name} id={`${service.name}-${option.name}`} />
                <Label
                  htmlFor={`${service.name}-${option.name}`}
                  className="flex-1 flex justify-between items-center cursor-pointer"
                >
                  <span className="font-normal text-base">{option.name}</span>
                  <span className="text-base text-muted-foreground whitespace-nowrap">
                    {option.pricePerM2} {currency}/м²
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    )}
  </div>
)

// Компонент секции услуг
const ServicesSection: React.FC<{
  title: string
  services: Service[]
  selectedServices: string[]
  serviceOptions: Record<string, string>
  onServiceToggle: (name: string) => void
  onOptionChange: (serviceName: string, optionName: string) => void
  currency: string
}> = ({
  title,
  services,
  selectedServices,
  serviceOptions,
  onServiceToggle,
  onOptionChange,
  currency,
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-base">{title}</h3>
    <div className="space-y-4">
      {services.map((service) => (
        <ServiceItem
          key={service.name}
          service={service}
          isSelected={selectedServices.includes(service.name)}
          onToggle={() => onServiceToggle(service.name)}
          selectedOption={serviceOptions[service.name]}
          onOptionChange={onOptionChange}
          currency={currency}
        />
      ))}
    </div>
  </div>
)

// Компонент для элементов с радио-выбором
const ElementsRadioGroup: React.FC<{
  title: string
  name: string
  elements: AdditionalElement[]
  selected: string
  onChange: (value: string) => void
  currency: string
}> = ({ title, name, elements, selected, onChange, currency }) => (
  <div className="space-y-3">
    {title && <Label className="font-medium text-base">{title}</Label>}
    <RadioGroup value={selected} onValueChange={onChange}>
      {elements.map((element) => (
        <div key={element.name} className="flex items-center space-x-2">
          <RadioGroupItem value={element.name} id={`${name}-${element.name}`} />
          <Label
            htmlFor={`${name}-${element.name}`}
            className="flex-1 flex justify-between items-center cursor-pointer"
          >
            <span className="font-normal text-base">{element.name}</span>
            <span className="text-base text-muted-foreground whitespace-nowrap">
              {element.price > 0 ? formatPrice(element.price, currency) : 'бесплатно'}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
)

// Универсальный компонент для секции результатов
const ResultsSection: React.FC<{
  title: string
  items: Array<{ name: string; cost: number }>
  currency: string
}> = ({ title, items, currency }) => {
  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-base font-medium">{title}:</h4>
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-base">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="text-muted-foreground whitespace-nowrap">
            {formatPrice(item.cost, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}

// Компонент результатов
const ResultsDisplay: React.FC<{
  calculations: any
  config: CalculatorConfig
}> = ({ calculations, config }) => {
  // Определяем секции для отображения
  const sections = [
    {
      title: 'Услуги',
      items: calculations.generalItems,
    },
    {
      title: config.interfaceTexts?.additionalElementsTitle || 'Дополнительные элементы',
      items: calculations.elementItems,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Площадь */}
      <div className="p-3 bg-secondary/50">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Площадь:</span>
          <span className="font-medium whitespace-nowrap">{calculations.area} м²</span>
        </div>
      </div>

      {/* Детализация услуг */}
      {sections.map((section) => (
        <ResultsSection
          key={section.title}
          title={section.title}
          items={section.items}
          currency={config.currency}
        />
      ))}

      {/* Итоги */}
      <div className="space-y-3 pt-4 border-t">
        <div className="p-3 bg-primary/10">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              {config.interfaceTexts?.totalPriceLabel || 'Общая стоимость:'}
            </span>
            <span className="text-2xl font-bold text-primary whitespace-nowrap">
              {formatPrice(calculations.totalCost, config.currency)}
            </span>
          </div>
        </div>

        <div className="p-3 bg-secondary/50">
          <div className="flex justify-between items-center">
            <span className="font-medium text-base">
              {config.interfaceTexts?.pricePerM2Label || 'Цена за м²:'}
            </span>
            <span className="font-bold whitespace-nowrap">
              {formatPrice(Math.round(calculations.pricePerM2), config.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =============

// ============= ОСНОВНОЙ КОМПОНЕНТ =============
const CalculatorBlock = () => {
  const [formData, setFormData] = useState({
    area: '',
    selectedFloor: '',
    selectedServices: [] as string[],
    selectedElements: [] as string[],
    serviceOptions: {} as Record<string, string>,
    selectedRadioValues: {} as Record<string, string>,
  })

  const [calculatorConfig, setCalculatorConfig] = useState<CalculatorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Универсальные обработчики
  const handlers = {
    field: (field: string, value: any) => setFormData((prev) => ({ ...prev, [field]: value })),

    serviceToggle: (name: string) =>
      setFormData((prev) => ({
        ...prev,
        selectedServices: prev.selectedServices.includes(name)
          ? prev.selectedServices.filter((s) => s !== name)
          : [...prev.selectedServices, name],
      })),

    elementToggle: (name: string) =>
      setFormData((prev) => ({
        ...prev,
        selectedElements: prev.selectedElements.includes(name)
          ? prev.selectedElements.filter((e) => e !== name)
          : [...prev.selectedElements, name],
      })),

    serviceOption: (serviceName: string, optionName: string) =>
      setFormData((prev) => ({
        ...prev,
        serviceOptions: { ...prev.serviceOptions, [serviceName]: optionName },
      })),

    reset: () => {
      // Сбрасываем форму без предвыбранных значений
      setFormData({
        area: '',
        selectedFloor: '',
        selectedServices: [],
        selectedElements: [],
        serviceOptions: {},
        selectedRadioValues: {},
      })
    },
  }

  // Загрузка конфигурации
  useEffect(() => {
    fetch('/api/calculator/config')
      .then((res) => res.json())
      .then((config) => {
        setCalculatorConfig(config)

        // Инициализируем форму без предвыбранных значений
        if (config) {
          setFormData({
            area: '',
            selectedFloor: '',
            selectedServices: [],
            selectedElements: [],
            serviceOptions: {},
            selectedRadioValues: {},
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Расчеты
  const calculations = useMemo(() => {
    const area = parseFloat(formData.area.toString()) || 0
    if (!calculatorConfig || area <= 0 || !formData.selectedFloor) {
      return {
        area: area,
        totalCost: 0,
        pricePerM2: 0,
        generalItems: [],
        engineeringItems: [],
        elementItems: [],
        additionalElementsCost: 0,
      }
    }

    const calculateServices = (services: Service[]) => {
      let cost = 0
      const items: any[] = []

      services.forEach((service) => {
        if (!formData.selectedServices.includes(service.name)) return

        let serviceCost = 0
        let serviceName = service.name

        if (service.hasOptions && service.options?.length) {
          const selectedOption = formData.serviceOptions[service.name]
          const option = service.options.find((opt) => opt.name === selectedOption)
          if (option) {
            serviceCost = option.pricePerM2 * area
            serviceName = `${service.name}: ${option.name}`
          }
        } else {
          serviceCost = service.ignoreArea
            ? service.fixedPrice || 0
            : (service.pricePerM2 || 0) * area
        }

        if (serviceCost > 0) {
          cost += serviceCost
          items.push({ name: serviceName, cost: serviceCost })
        }
      })

      return { cost, items }
    }

    // Определяем коэффициент по площади
    let areaCoefficient = 1
    const areaCoeffs = calculatorConfig.areaSettings?.areaCoefficients || []

    for (const coeff of areaCoeffs) {
      if (area >= coeff.minArea && (!coeff.maxArea || area <= coeff.maxArea)) {
        areaCoefficient = coeff.coefficient
        break
      }
    }

    // Коэффициент этажности
    const floorOption = calculatorConfig.floorSettings?.floorOptions?.find(
      (opt: any) => opt.name === formData.selectedFloor,
    )
    const floorCoefficient = floorOption ? floorOption.coefficient : 1

    // Объединяем все сервисы из всех секций
    const allServices = (calculatorConfig.servicesSections || []).flatMap(
      (section) => section.services,
    )
    const servicesResult = calculateServices(allServices)

    // Применяем коэффициенты к стоимости сервисов
    const servicesWithCoefficients = servicesResult.cost * areaCoefficient * floorCoefficient

    // Дополнительные элементы
    let additionalCost = 0
    const elementItems: any[] = []
    const allSections = calculatorConfig.additionalSections || []

    // Обработка всех выбранных элементов
    const selectedElementNames = [
      ...formData.selectedElements,
      // Добавляем выбранные значения из радио-секций
      ...Object.values(formData.selectedRadioValues).filter(
        (value) => value && value.trim() !== '',
      ),
    ]

    selectedElementNames.forEach((name) => {
      // Ищем элемент во всех секциях
      for (const section of allSections) {
        const element = section.elements.find((e) => e.name === name)
        if (element && element.price > 0) {
          additionalCost += element.price
          elementItems.push({ name: element.name, cost: element.price })
          break
        }
      }
    })

    const totalCost = servicesWithCoefficients + additionalCost

    return {
      area: area,
      areaCoefficient,
      floorCoefficient,
      totalCost,
      pricePerM2: totalCost / area,
      generalItems: servicesResult.items.map((item: any) => ({
        ...item,
        cost: item.cost * areaCoefficient * floorCoefficient,
      })),
      engineeringItems: [], // Теперь все сервисы в generalItems
      elementItems,
      additionalElementsCost: additionalCost,
    }
  }, [formData, calculatorConfig])

  // Сохранение и экспорт
  const saveAndExport = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          calculations: {
            generalItems: calculations.generalItems,
            engineeringItems: calculations.engineeringItems,
            elementItems: calculations.elementItems,
            totalCost: calculations.totalCost,
            pricePerM2: calculations.pricePerM2,
          },
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Генерация текстового отчета
        const report = generateReport(
          calculations,
          formData,
          calculatorConfig!,
          result.calculationId,
        )

        if (confirm('Расчет сохранен!\n\nOK - скачать файл\nОтмена - отправить в Telegram')) {
          downloadFile(report, `Расчет_${result.calculationId}.txt`)
        } else {
          shareToTelegram(report)
        }
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка сохранения расчета')
    } finally {
      setIsSaving(false)
    }
  }

  // Генерация отчета
  const generateReport = (calc: any, data: any, config: CalculatorConfig, id: string) =>
    `
РАСЧЕТ СТОИМОСТИ ПРОЕКТИРОВАНИЯ
================================
Дата: ${new Date().toLocaleDateString('ru-RU')}
ID: ${id}

ПАРАМЕТРЫ:
Площадь: ${calc.area} м²
Этажность: ${data.selectedFloor}

УСЛУГИ:
${calc.generalItems
  .map((i: any) => `• ${i.name}: ${formatPrice(i.cost, config.currency)}`)
  .join('\n')}
${calc.engineeringItems
  .map((i: any) => `• ${i.name}: ${formatPrice(i.cost, config.currency)}`)
  .join('\n')}

ДОПОЛНИТЕЛЬНО:
${calc.elementItems
  .map((i: any) => `• ${i.name}: ${formatPrice(i.cost, config.currency)}`)
  .join('\n')}

ИТОГО: ${formatPrice(calc.totalCost, config.currency)}
Цена за м²: ${formatPrice(Math.round(calc.pricePerM2), config.currency)}
`.trim()

  // Утилиты
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareToTelegram = (text: string) => {
    window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Загрузка
  if (loading || !calculatorConfig) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">{calculatorConfig.title}</h1>

      {/* Инструкция */}
      <Card className="mb-6 bg-secondary">
        <CardContent className="pt-6">
          <h2 className="font-semibold mb-2">Как работает калькулятор:</h2>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Введите общую площадь дома</li>
            <li>• Выберите этажность</li>
            <li>• Отметьте необходимые разделы</li>
            <li>• Добавьте дополнительные элементы</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка - Ввод данных */}
        <div className="space-y-6">
          {/* Площадь и этажность */}
          <Card>
            <CardHeader>
              <CardTitle className="text-zinc-900 mt-5 mb-2 font-medium text-lg sm:text-lg md:text-xl">
                Площадь и этажность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="area" className="font-medium text-base">
                  {calculatorConfig.areaSettings?.label}
                </Label>
                <input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handlers.field('area', e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                  )}
                  placeholder={calculatorConfig.areaSettings?.placeholder || 'Введите площадь'}
                />
              </div>

              <div className="space-y-3">
                <Label className="font-medium text-base">
                  {calculatorConfig.floorSettings?.label}
                </Label>
                <RadioGroup
                  value={formData.selectedFloor}
                  onValueChange={(value: string) => handlers.field('selectedFloor', value)}
                >
                  {calculatorConfig.floorSettings?.floorOptions.map((option) => (
                    <div key={option.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.name} id={option.name} />
                      <Label htmlFor={option.name} className="font-normal text-base">
                        {option.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Проектные разделы */}
          <Card>
            <CardHeader>
              <CardTitle className="text-zinc-900 mt-5 mb-2 font-medium text-lg sm:text-lg md:text-xl">
                Проектируемые разделы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {calculatorConfig.servicesSections?.map((section) => (
                <ServicesSection
                  key={section.title}
                  title={section.title}
                  services={section.services}
                  selectedServices={formData.selectedServices}
                  serviceOptions={formData.serviceOptions}
                  onServiceToggle={handlers.serviceToggle}
                  onOptionChange={handlers.serviceOption}
                  currency={calculatorConfig.currency}
                />
              ))}
            </CardContent>
          </Card>

          {/* Дополнительные элементы */}
          <Card>
            <CardHeader>
              <CardTitle className="text-zinc-900 mt-5 mb-2 font-medium text-lg sm:text-lg md:text-xl">
                {calculatorConfig.interfaceTexts?.additionalElementsTitle ||
                  'Дополнительные элементы'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {calculatorConfig.additionalSections?.map((section) => (
                <div key={section.title} className="space-y-4">
                  <Label className="font-medium text-base">{section.title}</Label>

                  {/* Чекбоксы */}
                  {section.fieldType === 'checkbox' && (
                    <div className="space-y-3">
                      {section.elements.map((element) => (
                        <div key={element.name} className="flex items-center space-x-3">
                          <Checkbox
                            checked={formData.selectedElements.includes(element.name)}
                            onCheckedChange={() => handlers.elementToggle(element.name)}
                          />
                          <Label className="flex-1 flex justify-between items-center cursor-pointer">
                            <span className="font-normal text-base">{element.name}</span>
                            <span className="text-base text-muted-foreground whitespace-nowrap">
                              {formatPrice(element.price, calculatorConfig.currency)}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Радио кнопки */}
                  {section.fieldType === 'radio' && (
                    <ElementsRadioGroup
                      title=""
                      name={section.title.toLowerCase().replace(/\s+/g, '-')}
                      elements={section.elements}
                      selected={formData.selectedRadioValues[section.title] || ''}
                      onChange={(value) => {
                        handlers.field('selectedRadioValues', {
                          ...formData.selectedRadioValues,
                          [section.title]: value,
                        })
                      }}
                      currency={calculatorConfig.currency}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Результаты */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-zinc-900 mt-5 mb-2 font-medium text-lg sm:text-lg md:text-xl">
                Результаты расчета
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsDisplay calculations={calculations} config={calculatorConfig} />

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {}}
                  className="flex-1 [&]:whitespace-normal [&]:text-center [&]:h-auto [&]:py-3"
                >
                  Сохранить и получить расчет
                </Button>
                <Button variant="outline" onClick={handlers.reset} className="[&]:h-auto [&]:py-3">
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalculatorBlock
