import React from 'react'

interface HTMLReportProps {
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

export const HTMLReport: React.FC<HTMLReportProps> = ({
  calculations,
  formData,
  config,
  calculationNumber,
}) => {
  return (
    <div className="font-montserrat max-w-3xl mx-auto bg-background text-foreground leading-relaxed">
      {/* Заголовок и номер */}
      <div className="mb-8 pb-4 border-b-2 border-primary">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-foreground">Расчет стоимости проектирования</div>
          <div className="text-lg font-bold text-primary">№ {calculationNumber}</div>
        </div>
      </div>

      {/* Параметры проекта */}
      <div className="mb-6">
        <div className="text-lg font-bold mb-2 text-foreground">Параметры проекта</div>
        <div className="bg-gray-50 p-3 rounded border">
          <div className="flex justify-between py-1">
            <span className="text-sm text-muted-foreground">Площадь:</span>
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              {calculations.area} м²
            </span>
          </div>
          <div className="flex justify-between py-1 border-t border-gray-200">
            <span className="text-sm text-muted-foreground">Этажность:</span>
            <span className="text-sm font-bold text-foreground text-right">
              {formData.selectedFloor}
            </span>
          </div>
        </div>
      </div>

      {/* Проектируемые разделы */}
      {calculations.generalItems.length > 0 && (
        <div className="mb-6">
          <div className="text-lg font-bold mb-2 text-foreground">Проектируемые разделы</div>
          <div className="bg-gray-50 p-3 rounded border">
            {calculations.generalItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                <span className="text-sm font-bold text-foreground whitespace-nowrap ml-2">
                  {item.cost.toLocaleString()} {config.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Дополнительные элементы */}
      {calculations.elementItems.length > 0 && (
        <div className="mb-6">
          <div className="text-lg font-bold mb-2 text-foreground">Дополнительные элементы</div>
          <div className="bg-gray-50 p-3 rounded border">
            {calculations.elementItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
              >
                <span
                  className={`flex-1 ${
                    item.isSectionTitle
                      ? 'text-xs font-bold text-muted-foreground uppercase tracking-wide'
                      : 'text-sm font-normal text-foreground'
                  }`}
                >
                  {item.name}
                </span>
                {!item.isSectionTitle && (
                  <span className="text-sm font-bold text-foreground whitespace-nowrap ml-2">
                    {item.cost.toLocaleString()} {config.currency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Итоги расчета */}
      <div className="mt-6">
        <div className="text-lg font-bold mb-2 text-foreground">Итоги расчета</div>
        <div className="bg-zinc-50 p-4 rounded border-2 border-zinc-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-foreground">Общая стоимость:</span>
            <span className="text-xl font-bold text-zinc-800 whitespace-nowrap">
              {calculations.totalCost.toLocaleString()} {config.currency}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t border-zinc-200">
            <span>Стоимость за м²:</span>
            <span className="whitespace-nowrap">
              {Math.round(calculations.pricePerM2).toLocaleString()} {config.currency}/м²
            </span>
          </div>
        </div>
      </div>

      {/* Футер с контактами */}
      <div className="mt-10 pt-4 border-t border-muted text-center text-sm text-foreground">
        <div className="text-base font-bold text-foreground mb-1">Формы и Нормы</div>
        <div className="space-x-2">
          <a href="tel:+79602823868" className="text-foreground no-underline font-medium">
            +7 960 282 38 68
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="mailto:mail@formnorm.ru" className="text-foreground no-underline font-medium">
            mail@formnorm.ru
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="https://formnorm.ru" className="text-foreground no-underline font-medium">
            formnorm.ru
          </a>
        </div>
      </div>
    </div>
  )
}
