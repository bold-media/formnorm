'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup'
import { Label } from '@/components/Label'
import { notFound, useRouter } from 'next/navigation'

// ============= TYPES =============
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

export interface CalculatorConfig {
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

// ============= HELPER FUNCTIONS =============
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

// ============= COMPONENTS =============

// Service component with options
const ServiceItem: React.FC<{
  service: Service
  isSelected: boolean
  onToggle: () => void
  selectedOption?: string
  onOptionChange: (serviceName: string, optionName: string) => void
  currency: string
  areaCoefficient?: number
  floorCoefficient?: number
  error?: string
}> = ({
  service,
  isSelected,
  onToggle,
  selectedOption,
  onOptionChange,
  currency,
  areaCoefficient = 1,
  floorCoefficient = 1,
  error,
}) => {
  // If service has no name but has options - display options as radio buttons
  if (!service.name && service.hasOptions && service.options) {
    return (
      <div className="space-y-3">
        {error && <p className="text-xs text-red-500">{error}</p>}
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

  // Regular service with name
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

// Service section component
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
  errors?: Record<string, string>
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
  errors = {},
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-base">{title}</h3>
    <div className="space-y-3">
      {services.map((service, index) => {
        // For services without name use unique key
        const serviceKey = service.name || `radio-service-${index}`

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
            error={errors[serviceKey]}
          />
        )
      })}
    </div>
  </div>
)

// Component for radio selection elements
const ElementsRadioGroup: React.FC<{
  title: string
  name: string
  elements: AdditionalElement[]
  selected: string
  onChange: (value: string) => void
  currency: string
  error?: string
}> = ({ title, name, elements, selected, onChange, currency, error }) => (
  <div className="space-y-3">
    {title && <Label className="font-medium text-base">{title}</Label>}
    {error && <p className="text-xs text-red-500">{error}</p>}
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
              {formatPrice(element.price, currency)}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
)

// Universal component for results section
const ResultsSection: React.FC<{
  title: string
  items: Array<{ name: string; cost: number; isSectionTitle?: boolean }>
  currency: string
}> = ({ title, items, currency }) => {
  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-base font-medium">{title}:</h4>
      {items.map((item, idx) => {
        // Check if this is a section title
        if (item.isSectionTitle) {
          return (
            <div key={idx} className="mt-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground uppercase">
                {item.name}
              </span>
            </div>
          )
        }

        return (
          <div key={idx} className="flex justify-between text-base">
            <span className="text-muted-foreground">{item.name}</span>
            <span className="text-muted-foreground whitespace-nowrap">
              {formatPrice(item.cost, currency)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Results component
const ResultsDisplay: React.FC<{
  calculations: any
  config: CalculatorConfig
}> = ({ calculations, config }) => {
  // Determine sections for display
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
          <span className="font-medium">Площадь:</span>
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

// ============= HELPER FUNCTIONS =============

// ============= MAIN COMPONENT =============
interface CalculatorBlockProps {
  initialConfig?: CalculatorConfig | null
}

const CalculatorBlock: React.FC<CalculatorBlockProps> = ({ initialConfig }) => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    area: '',
    selectedFloor: '',
    selectedServices: [] as string[],
    selectedElements: [] as string[],
    serviceOptions: {} as Record<string, string>,
    selectedRadioValues: {} as Record<string, string>,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  })

  const [errors, setErrors] = useState<{
    area?: string
    selectedFloor?: string
    radioServices?: Record<string, string>
    additionalRadios?: Record<string, string>
  }>({})

  const [calculatorConfig, setCalculatorConfig] = useState<CalculatorConfig | null>(
    initialConfig || null,
  )
  const [loading, setLoading] = useState(!initialConfig)
  const [isSaving, setIsSaving] = useState(false)

  // Universal handlers
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
      // Reset form without preselected values
      setFormData({
        area: '',
        selectedFloor: '',
        selectedServices: [],
        selectedElements: [],
        serviceOptions: {},
        selectedRadioValues: {},
        clientName: '',
        clientEmail: '',
        clientPhone: '',
      })
    },
  }

  // Load configuration if not provided
  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/calculator/config')
        .then((res) => res.json())
        .then((config) => {
          setCalculatorConfig(config)
          setLoading(false)
        })
        .catch(console.error)
    }
  }, [initialConfig])

  // Calculations
  const calculations = useMemo(() => {
    const inputArea = parseFloat(formData.area.toString()) || 0
    const area = Math.max(inputArea, 100) // Minimum area 100 m²
    if (!calculatorConfig || inputArea <= 0 || !formData.selectedFloor) {
      return {
        area: inputArea, // Show entered area
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
      let areaBasedCost = 0 // Cost of services depending on area
      const items: any[] = []

      services.forEach((service) => {
        // For services without name check selected option
        if (!service.name && service.hasOptions && service.options?.length) {
          const selectedOption = formData.serviceOptions['']
          const option = service.options.find((opt) => opt.name === selectedOption)
          if (option) {
            const serviceCost = option.pricePerM2 * area
            cost += serviceCost
            areaBasedCost += serviceCost // Options always depend on area
            items.push({ name: option.name, cost: serviceCost })
          }
          return
        }

        // For regular services with name
        if (service.name && !formData.selectedServices.includes(service.name)) return

        let serviceCost = 0
        let serviceName = service.name

        if (service.hasOptions && service.options?.length) {
          const selectedOption = formData.serviceOptions[service.name || '']
          const option = service.options.find((opt) => opt.name === selectedOption)
          if (option) {
            serviceCost = option.pricePerM2 * area
            areaBasedCost += serviceCost // Options always depend on area
            serviceName = service.name ? `${service.name}: ${option.name}` : option.name
          }
        } else {
          if (service.ignoreArea) {
            serviceCost = service.fixedPrice || 0
            // Do not add to areaBasedCost as it does not depend on area
          } else {
            serviceCost = (service.pricePerM2 || 0) * area
            areaBasedCost += serviceCost // Depends on area
          }
        }

        if (serviceCost > 0) {
          cost += serviceCost
          items.push({ name: serviceName, cost: serviceCost })
        }
      })

      return { cost, items, areaBasedCost }
    }

    // Determine coefficient by area
    let areaCoefficient = 1
    const areaCoeffs = calculatorConfig.areaSettings?.areaCoefficients || []

    for (const coeff of areaCoeffs) {
      if (area >= coeff.minArea && (!coeff.maxArea || area <= coeff.maxArea)) {
        areaCoefficient = coeff.coefficient
        break
      }
    }

    // Floor coefficient
    const floorOption = calculatorConfig.floorSettings?.floorOptions?.find(
      (opt: any) => opt.name === formData.selectedFloor,
    )
    const floorCoefficient = floorOption ? floorOption.coefficient : 1

    // Combine all services from all sections
    const allServices = (calculatorConfig.servicesSections || []).flatMap(
      (section) => section.services,
    )
    const servicesResult = calculateServices(allServices)

    // Apply coefficients only to cost of services depending on area
    const areaBasedCostWithCoefficients =
      servicesResult.areaBasedCost * areaCoefficient * floorCoefficient

    // Cost of services with ignoreArea remains without coefficients
    const fixedCost = servicesResult.cost - servicesResult.areaBasedCost

    // Total cost of services
    const servicesWithCoefficients = areaBasedCostWithCoefficients + fixedCost

    // Additional elements
    let additionalCost = 0
    const elementItems: any[] = []
    const allSections = calculatorConfig.additionalSections || []

    // Processing all selected elements
    const selectedElementNames = [
      ...formData.selectedElements,
      // Add selected values from radio sections
      ...Object.values(formData.selectedRadioValues).filter(
        (value) => value && value.trim() !== '',
      ),
    ]

    // Group elements by sections
    const elementsBySection: { [key: string]: any[] } = {}

    selectedElementNames.forEach((name) => {
      // Search element in all sections
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

    // Form final array with section headers
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
      area: inputArea, // Show entered area
      areaCoefficient,
      floorCoefficient,
      totalCost,
      pricePerM2: areaBasedCostWithCoefficients / area, // Only services depending on area
      generalItems: servicesResult.items.map((item: any) => {
        // Check if this element is a service with ignoreArea
        const service = allServices.find(
          (s) =>
            s.name === item.name ||
            (s.hasOptions && s.options?.some((opt) => opt.name === item.name)),
        )

        // If service with ignoreArea, do not apply coefficients
        if (service?.ignoreArea) {
          return item
        }

        // For others apply coefficients
        return {
          ...item,
          cost: item.cost * areaCoefficient * floorCoefficient,
        }
      }),
      engineeringItems: [], // Now all services in generalItems
      elementItems,
      additionalElementsCost: additionalCost,
    }
  }, [formData, calculatorConfig])

  // PDF generation

  // Remove local calculation number generation - it will be generated by Payload hook

  const handleSaveAndRedirect = async () => {
    // Clear previous errors
    setErrors({})
    const newErrors: typeof errors = {}

    // Validate area
    if (!formData.area) {
      newErrors.area = 'Пожалуйста, введите площадь'
    }

    // Validate floor selection
    if (!formData.selectedFloor) {
      newErrors.selectedFloor = 'Пожалуйста, выберите этажность'
    }

    // Check for required radio services
    const radioServices =
      calculatorConfig?.servicesSections?.flatMap((section) =>
        section.services.filter(
          (service) =>
            service.fieldType === 'radio' ||
            (!service.name && service.hasOptions && service.options?.length),
        ),
      ) || []

    const radioErrors: Record<string, string> = {}
    radioServices.forEach((service, index) => {
      const serviceKey = service.name || `radio-service-${index}`
      if (!formData.serviceOptions[service.name || '']) {
        radioErrors[serviceKey] = 'Выберите один из вариантов'
      }
    })

    if (Object.keys(radioErrors).length > 0) {
      newErrors.radioServices = radioErrors
    }

    // Check for required radio sections in additional elements
    const additionalRadioErrors: Record<string, string> = {}
    const radioSections =
      calculatorConfig?.additionalSections?.filter((section) => section.fieldType === 'radio') || []

    radioSections.forEach((section) => {
      if (!formData.selectedRadioValues[section.title]) {
        additionalRadioErrors[section.title] = 'Выберите один из вариантов'
      }
    })

    if (Object.keys(additionalRadioErrors).length > 0) {
      newErrors.additionalRadios = additionalRadioErrors
    }

    // If there are errors, update state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (calculations.totalCost === 0) {
      alert('Пожалуйста, выберите хотя бы одну услугу')
      return
    }

    setIsSaving(true)
    try {
      // Save calculation result to database
      const saveResponse = await fetch('/api/save-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // calculationNumber will be generated by Payload hook
          clientName: formData.clientName || '',
          clientEmail: formData.clientEmail || '',
          clientPhone: formData.clientPhone || '',
          area: calculations.area,
          selectedFloor: formData.selectedFloor,
          selectedServices: formData.selectedServices,
          selectedElements: formData.selectedElements,
          serviceOptions: formData.serviceOptions,
          selectedRadioValues: formData.selectedRadioValues,
          floorCoefficient: calculations.floorCoefficient,
          areaCoefficient: calculations.areaCoefficient,
          generalItems: calculations.generalItems || [],
          engineeringItems: calculations.engineeringItems || [],
          elementItems: calculations.elementItems || [],
          additionalElementsCost: calculations.additionalElementsCost || 0,
          totalCost: calculations.totalCost,
          pricePerM2: calculations.pricePerM2,
          config: calculatorConfig, // Pass the entire config
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.details || 'Failed to save calculation')
      }

      const saveData = await saveResponse.json()
      console.log('Calculation saved with ID:', saveData.id)

      // Redirect to the result page
      router.push(`/calculator/${saveData.id}`)
    } catch (error) {
      console.error('Error saving calculation:', error)
      alert(
        `Ошибка при сохранении: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!calculatorConfig) notFound()

  return (
    <div className="container pt-6 md:pt-12 pb-12 md:pb-24">
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
                  onChange={(e) => {
                    handlers.field('area', e.target.value)
                    // Clear error when user starts typing
                    if (errors.area) {
                      setErrors({ ...errors, area: undefined })
                    }
                  }}
                  className={cn(
                    'w-full px-3 py-2 border rounded-md',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    errors.area && 'border-red-500',
                  )}
                  placeholder={calculatorConfig.areaSettings?.placeholder || 'Введите площадь'}
                />
                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
                <p className="text-xs text-muted-foreground">
                  {calculatorConfig.areaSettings?.description}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="font-medium text-base">
                  {calculatorConfig.floorSettings?.label}
                </Label>
                {errors.selectedFloor && (
                  <p className="text-xs text-red-500">{errors.selectedFloor}</p>
                )}
                <RadioGroup
                  value={formData.selectedFloor}
                  onValueChange={(value: string) => {
                    handlers.field('selectedFloor', value)
                    // Clear error when user selects
                    if (errors.selectedFloor) {
                      setErrors({ ...errors, selectedFloor: undefined })
                    }
                  }}
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
                  onOptionChange={(serviceName, optionName) => {
                    handlers.serviceOption(serviceName, optionName)
                    // Clear error when user selects
                    if (errors.radioServices) {
                      const updatedErrors = { ...errors.radioServices }
                      const serviceKey =
                        serviceName ||
                        `radio-service-${section.services.findIndex(
                          (s) => !s.name && s.hasOptions,
                        )}`
                      delete updatedErrors[serviceKey]
                      setErrors({
                        ...errors,
                        radioServices:
                          Object.keys(updatedErrors).length > 0 ? updatedErrors : undefined,
                      })
                    }
                  }}
                  currency={calculatorConfig.currency}
                  areaCoefficient={calculations.areaCoefficient}
                  floorCoefficient={calculations.floorCoefficient}
                  errors={errors.radioServices}
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
                        // Clear error when user selects
                        if (errors.additionalRadios?.[section.title]) {
                          const updatedErrors = { ...errors.additionalRadios }
                          delete updatedErrors[section.title]
                          setErrors({
                            ...errors,
                            additionalRadios:
                              Object.keys(updatedErrors).length > 0 ? updatedErrors : undefined,
                          })
                        }
                      }}
                      currency={calculatorConfig.currency}
                      error={errors.additionalRadios?.[section.title]}
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
                  onClick={handleSaveAndRedirect}
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
