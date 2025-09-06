'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup'
import { Label } from '@/components/Label'
import { HTMLReport } from '@/components/PDF'
import { renderToString } from 'react-dom/server'

// ============= ТИПЫ =============
interface ServiceOption {
  name: string
  pricePerM2: number
  description?: string
}

interface Service {
  name?: string
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
    description: string
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

const getServicePriceDisplay = (
  service: Service,
  currency: string,
  areaCoefficient: number = 1,
  floorCoefficient: number = 1,
) => {
  if (service.hasOptions && service.options?.length) {
    const minPrice = Math.min(
      ...service.options.map((opt) => (opt.pricePerM2 || 0) * areaCoefficient * floorCoefficient),
    )
    return `от ${Math.round(minPrice)} ${currency}/м²`
  }
  if (service.ignoreArea) {
    return service.fixedPrice ? formatPrice(service.fixedPrice, currency) : 'Цена не указана'
  }
  const adjustedPrice = (service.pricePerM2 || 0) * areaCoefficient * floorCoefficient
  return `${Math.round(adjustedPrice)} ${currency}/м²`
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
  areaCoefficient?: number
  floorCoefficient?: number
}> = ({
  service,
  isSelected,
  onToggle,
  selectedOption,
  onOptionChange,
  currency,
  areaCoefficient = 1,
  floorCoefficient = 1,
}) => {
  // Если у сервиса нет названия, но есть опции - отображаем опции как радиокнопки
  if (!service.name && service.hasOptions && service.options) {
    return (
      <div className="space-y-3">
        <RadioGroup
          value={selectedOption}
          onValueChange={(value: string) => onOptionChange('', value)}
        >
          {service.options.map((option, index) => (
            <div key={`option-${option.name}-${index}`} className="flex items-center space-x-2">
              <RadioGroupItem value={option.name} id={`option-${option.name}-${index}`} />
              <Label
                htmlFor={`option-${option.name}-${index}`}
                className="flex-1 flex justify-between items-center cursor-pointer"
              >
                <span className="font-normal text-base">{option.name}</span>
                <span className="text-base text-muted-foreground whitespace-nowrap">
                  {Math.round((option.pricePerM2 || 0) * areaCoefficient * floorCoefficient)}{' '}
                  {currency}/м²
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  // Обычный сервис с названием
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={`service-${service.name}`}
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-0.5"
        />
        <Label
          htmlFor={`service-${service.name}`}
          className="flex-1 flex justify-between items-center cursor-pointer"
        >
          <span className="font-normal text-base leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {service.name}
          </span>
          <span className="text-base text-muted-foreground whitespace-nowrap">
            {getServicePriceDisplay(service, currency, areaCoefficient, floorCoefficient)}
          </span>
        </Label>
      </div>

      {service.hasOptions && isSelected && service.options && (
        <Card className="ml-6 p-3 bg-secondary/20 border-secondary">
          <CardContent className="p-0 space-y-2">
            <p className="text-sm font-medium text-secondary-foreground mb-2">Выберите вариант:</p>
            <RadioGroup
              value={selectedOption}
              onValueChange={(value: string) => onOptionChange(service.name || '', value)}
            >
              {service.options.map((option, index) => (
                <div
                  key={`${service.name}-${option.name}-${index}`}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.name}
                    id={`${service.name}-${option.name}-${index}`}
                  />
                  <Label
                    htmlFor={`${service.name}-${option.name}-${index}`}
                    className="flex-1 flex justify-between items-center cursor-pointer"
                  >
                    <span className="font-normal text-base">{option.name}</span>
                    <span className="text-base text-muted-foreground whitespace-nowrap">
                      {Math.round((option.pricePerM2 || 0) * areaCoefficient * floorCoefficient)}{' '}
                      {currency}/м²
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
}

// Компонент секции услуг
const ServicesSection: React.FC<{
  title: string
  services: Service[]
  selectedServices: string[]
  serviceOptions: Record<string, string>
  onServiceToggle: (name: string) => void
  onOptionChange: (serviceName: string, optionName: string) => void
  currency: string
  areaCoefficient?: number
  floorCoefficient?: number
}> = ({
  title,
  services,
  selectedServices,
  serviceOptions,
  onServiceToggle,
  onOptionChange,
  currency,
  areaCoefficient = 1,
  floorCoefficient = 1,
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-base">{title}</h3>
    <div className="space-y-3">
      {services.map((service, index) => {
        // Для сервисов без названия используем уникальный ключ
        const serviceKey = service.name || `unnamed-${index}`

        return (
          <ServiceItem
            key={`${title}-${serviceKey}-${index}`}
            service={service}
            isSelected={service.name ? selectedServices.includes(service.name) : true}
            onToggle={() => (service.name ? onServiceToggle(service.name) : () => {})}
            selectedOption={serviceOptions[service.name || '']}
            onOptionChange={onOptionChange}
            currency={currency}
            areaCoefficient={areaCoefficient}
            floorCoefficient={floorCoefficient}
          />
        )
      })}
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
      {elements.map((element, index) => (
        <div key={`${name}-${element.name}-${index}`} className="flex items-center space-x-2">
          <RadioGroupItem value={element.name} id={`${name}-${element.name}-${index}`} />
          <Label
            htmlFor={`${name}-${element.name}-${index}`}
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
    const inputArea = parseFloat(formData.area.toString()) || 0
    const area = Math.max(inputArea, 100) // Минимальная площадь 100 м²
    if (!calculatorConfig || inputArea <= 0 || !formData.selectedFloor) {
      return {
        area: inputArea, // Показываем введенную площадь
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
      let areaBasedCost = 0 // Стоимость услуг, зависящих от площади
      const items: any[] = []

      services.forEach((service) => {
        // Для сервисов без названия проверяем выбранную опцию
        if (!service.name && service.hasOptions && service.options?.length) {
          const selectedOption = formData.serviceOptions['']
          const option = service.options.find((opt) => opt.name === selectedOption)
          if (option) {
            const serviceCost = option.pricePerM2 * area
            cost += serviceCost
            areaBasedCost += serviceCost // Опции всегда зависят от площади
            items.push({ name: option.name, cost: serviceCost })
          }
          return
        }

        // Для обычных сервисов с названием
        if (service.name && !formData.selectedServices.includes(service.name)) return

        let serviceCost = 0
        let serviceName = service.name

        if (service.hasOptions && service.options?.length) {
          const selectedOption = formData.serviceOptions[service.name || '']
          const option = service.options.find((opt) => opt.name === selectedOption)
          if (option) {
            serviceCost = option.pricePerM2 * area
            areaBasedCost += serviceCost // Опции всегда зависят от площади
            serviceName = service.name ? `${service.name}: ${option.name}` : option.name
          }
        } else {
          if (service.ignoreArea) {
            serviceCost = service.fixedPrice || 0
            // Не добавляем в areaBasedCost, так как не зависит от площади
          } else {
            serviceCost = (service.pricePerM2 || 0) * area
            areaBasedCost += serviceCost // Зависит от площади
          }
        }

        if (serviceCost > 0) {
          cost += serviceCost
          items.push({ name: serviceName, cost: serviceCost })
        }
      })

      return { cost, items, areaBasedCost }
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

    // Применяем коэффициенты только к стоимости сервисов, зависящих от площади
    const areaBasedCostWithCoefficients =
      servicesResult.areaBasedCost * areaCoefficient * floorCoefficient

    // Стоимость сервисов с ignoreArea остается без коэффициентов
    const fixedCost = servicesResult.cost - servicesResult.areaBasedCost

    // Общая стоимость сервисов
    const servicesWithCoefficients = areaBasedCostWithCoefficients + fixedCost

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

    // Группируем элементы по секциям
    const elementsBySection: { [key: string]: any[] } = {}

    selectedElementNames.forEach((name) => {
      // Ищем элемент во всех секциях
      for (const section of allSections) {
        const element = section.elements.find((e) => e.name === name)
        if (element && element.price > 0) {
          additionalCost += element.price

          if (!elementsBySection[section.title]) {
            elementsBySection[section.title] = []
          }
          elementsBySection[section.title].push({
            name: element.name,
            cost: element.price,
          })
          break
        }
      }
    })

    // Формируем итоговый массив с заголовками секций
    Object.entries(elementsBySection).forEach(([sectionTitle, elements]) => {
      elementItems.push({
        name: sectionTitle,
        cost: 0,
        isSectionTitle: true,
      })
      elementItems.push(...elements)
    })

    const totalCost = servicesWithCoefficients + additionalCost

    return {
      area: inputArea, // Показываем введенную площадь
      areaCoefficient,
      floorCoefficient,
      totalCost,
      pricePerM2: areaBasedCostWithCoefficients / area, // Только услуги, зависящие от площади
      generalItems: servicesResult.items.map((item: any) => {
        // Проверяем, является ли этот элемент услугой с ignoreArea
        const service = allServices.find(
          (s) =>
            s.name === item.name ||
            (s.hasOptions && s.options?.some((opt) => opt.name === item.name)),
        )

        // Если услуга с ignoreArea, не применяем коэффициенты
        if (service?.ignoreArea) {
          return item
        }

        // Для остальных применяем коэффициенты
        return {
          ...item,
          cost: item.cost * areaCoefficient * floorCoefficient,
        }
      }),
      engineeringItems: [], // Теперь все сервисы в generalItems
      elementItems,
      additionalElementsCost: additionalCost,
    }
  }, [formData, calculatorConfig])

  // PDF генерация

  // Генерируем уникальный номер расчета (6 цифр)
  const generateCalculationNumber = () => {
    const min = 100000 // 6 цифр
    const max = 999999 // 6 цифр
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Генерируем номер сразу при загрузке компонента
  const [calculationNumber] = React.useState(() => generateCalculationNumber().toString())

  const generatePDF = async () => {
    // Проверяем, что все необходимые данные заполнены
    if (!formData.area || !formData.selectedFloor) {
      alert('Пожалуйста, заполните площадь и выберите этажность')
      return
    }

    if (calculations.totalCost === 0) {
      alert('Пожалуйста, выберите хотя бы одну услугу')
      return
    }

    setIsSaving(true)
    try {
      // Создаем HTML контент
      const reportComponent = React.createElement(HTMLReport, {
        calculations: {
          ...calculations,
          areaCoefficient: calculations.areaCoefficient || 1,
          floorCoefficient: calculations.floorCoefficient || 1,
        },
        formData,
        config: calculatorConfig || { currency: '₽' },
        calculationNumber,
      })

      const reportHTML = renderToString(reportComponent)

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Расчет стоимости проектирования</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { margin: 0; padding: 0; font-family: 'Montserrat', Arial, sans-serif; }
              
              /* Структурированные размеры текста */
              .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
              .text-lg { font-size: 1.125rem; line-height: 1.5rem; }
              .text-base { font-size: 1rem; line-height: 1.5rem; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .text-xs { font-size: 0.75rem; line-height: 1rem; }
              
              /* Цвета */
              .text-foreground { color: #1f2937; }
              .text-muted-foreground { color: #6b7280; }
              .text-primary { color: #1f2937; }
              .text-blue-600 { color: #2563eb; }
              .text-zinc-800 { color: #27272a; }
              .bg-background { background-color: #ffffff; }
              .bg-gray-50 { background-color: #f9fafb; }
              .bg-zinc-50 { background-color: #fafafa; }
              .bg-blue-50 { background-color: #eff6ff; }
              .border { border-color: #d1d5db; }
              .border-gray-200 { border-color: #e5e7eb; }
              .border-zinc-200 { border-color: #e4e4e7; }
              .border-blue-200 { border-color: #bfdbfe; }
              .border-primary { border-color: #1f2937; }
              .border-primary\/20 { border-color: #6b7280; }
              .border-muted { border-color: #e5e7eb; }
              .border-muted\/30 { border-color: #d1d5db; }
              
              /* Flexbox */
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              
              /* Структурированные отступы */
              .mb-1 { margin-bottom: 0.25rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .mb-3 { margin-bottom: 0.75rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-8 { margin-bottom: 2rem; }
              .mb-10 { margin-bottom: 2.5rem; }
              .mt-2 { margin-top: 0.5rem; }
              .mt-4 { margin-top: 1rem; }
              .mt-8 { margin-top: 2rem; }
              .mt-10 { margin-top: 2.5rem; }
              .pt-2 { padding-top: 0.5rem; }
              .pt-4 { padding-top: 1rem; }
              .pb-2 { padding-bottom: 0.5rem; }
              .pb-4 { padding-bottom: 1rem; }
              .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
              .ml-2 { margin-left: 0.5rem; }
              .space-y-1 > * + * { margin-top: 0.25rem; }
              .space-y-2 > * + * { margin-top: 0.5rem; }
              .space-x-2 > * + * { margin-left: 0.5rem; }
              .space-x-3 > * + * { margin-left: 0.75rem; }
              .space-x-4 > * + * { margin-left: 1rem; }
              
              /* Typography */
              .font-bold { font-weight: 700; }
              .font-medium { font-weight: 500; }
              .leading-relaxed { line-height: 1.625; }
              .uppercase { text-transform: uppercase; }
              .tracking-wide { letter-spacing: 0.025em; }
              
              /* Layout */
              .max-w-3xl { max-width: 48rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .whitespace-nowrap { white-space: nowrap; }
              .flex-1 { flex: 1 1 0%; }
              
              /* Container padding */
              .p-3 { padding: 0.75rem; }
              .p-4 { padding: 1rem; }
              .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
              .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
              .pt-2 { padding-top: 0.5rem; }
              .pb-2 { padding-bottom: 0.5rem; }
              
              /* Borders */
              .border { border-width: 1px; }
              .border-t { border-top-width: 1px; }
              .border-t-2 { border-top-width: 2px; }
              .border-b { border-bottom-width: 1px; }
              .border-b-2 { border-bottom-width: 2px; }
              .border-2 { border-width: 2px; }
              .border-4 { border-width: 4px; }
              
              /* Rounded corners */
              .rounded { border-radius: 0.25rem; }
              .rounded-md { border-radius: 0.375rem; }
              .rounded-lg { border-radius: 0.5rem; }
              
              /* Negative margins */
              .-mx-2 { margin-left: -0.5rem; margin-right: -0.5rem; }
              .-my-1 { margin-top: -0.25rem; margin-bottom: -0.25rem; }
              
              /* Last child */
              .last\:border-b-0:last-child { border-bottom-width: 0; }
              
              /* Links */
              .no-underline { text-decoration: none; }
            </style>
          </head>
          <body>
            <div id="pdf-content">
              ${reportHTML}
            </div>
          </body>
        </html>
      `

      console.log('HTML content length:', htmlContent.length)
      console.log('HTML preview:', htmlContent.substring(0, 500) + '...')

      // Отправляем запрос на API для генерации PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          filename: `calculation-${calculationNumber}.pdf`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to generate PDF')
      }

      // Скачиваем PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `calculation-${calculationNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(
        `Ошибка при создании PDF: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      )
    } finally {
      setIsSaving(false)
    }
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
                <p className="text-xs text-muted-foreground">
                  {calculatorConfig.areaSettings?.description}
                </p>
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
                  areaCoefficient={calculations.areaCoefficient}
                  floorCoefficient={calculations.floorCoefficient}
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
                      {section.elements.map((element, index) => (
                        <div
                          key={`${section.title}-${element.name}-${index}`}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`element-${section.title}-${element.name}-${index}`}
                            checked={formData.selectedElements.includes(element.name)}
                            onCheckedChange={() => handlers.elementToggle(element.name)}
                          />
                          <Label
                            htmlFor={`element-${section.title}-${element.name}-${index}`}
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span className="font-normal text-base leading-normal">
                              {element.name}
                            </span>
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
                  onClick={generatePDF}
                  disabled={isSaving}
                  className="flex-1 [&]:whitespace-normal [&]:text-center [&]:h-auto [&]:py-3"
                >
                  {isSaving ? 'Создание PDF...' : 'Сохранить и получить расчет'}
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
