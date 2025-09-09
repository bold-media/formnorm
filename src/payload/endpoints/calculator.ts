// payload/endpoints/calculator.ts
import { Endpoint } from 'payload'

// Закомментирован calculatorEndpoint - кнопка отключена
// export const calculatorEndpoint: Endpoint = {
//   path: '/calculator',
//   method: 'post',
//   handler: async (req) => {
//     // ... весь код сохранения результатов закомментирован
//   },
// }

export const calculatorConfigEndpoint: Endpoint = {
  path: '/calculator/config',
  method: 'get',
  handler: async (req) => {
    const { payload } = req

    try {
      // Получаем настройки калькулятора из глобальных настроек
      const settings = await payload.findGlobal({
        slug: 'settings',
      })

      if (!settings) {
        return Response.json({ error: 'Настройки не найдены' }, { status: 404 })
      }

      // Формируем конфигурацию калькулятора
      const calculatorConfig = {
        calculatorTitle: settings.calculator?.calculatorTitle || 'Калькулятор стоимости проектирования',
        currency: settings.calculator?.currency || '₽',
        areaSettings: settings.calculator?.areaSettings || {
          label: 'Общая площадь дома (все помещения на всех этажах)',
          placeholder: 'Введите площадь в м²',
          defaultArea: 0,
          areaCoefficients: [],
        },
        floorSettings: settings.calculator?.floorSettings || {
          label: 'Этажность',
          floorOptions: [
            { name: 'Одноэтажный', coefficient: 1, isDefault: true },
            { name: 'Двухэтажный', coefficient: 1.2 },
            { name: 'Трехэтажный', coefficient: 1.4 },
          ],
        },
        servicesSections: settings.calculator?.servicesSections || [],
        additionalSections: settings.calculator?.additionalSections || [],
        interfaceTexts: settings.calculator?.interfaceTexts || {
          totalPriceLabel: 'Общая стоимость:',
          pricePerM2Label: 'Цена за м²:',
          resetButtonText: 'Сбросить',
          additionalElementsTitle: 'Дополнительные элементы',
        },
      }

      return Response.json(calculatorConfig)
    } catch (error) {
      console.error('Ошибка получения настроек:', error)
      return Response.json({ error: 'Ошибка получения настроек калькулятора' }, { status: 500 })
    }
  },
}
