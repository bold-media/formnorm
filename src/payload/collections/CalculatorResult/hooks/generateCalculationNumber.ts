import { FieldHook } from 'payload'
import { CalculatorResult } from '@payload-types'

export const generateCalculationNumber: FieldHook<CalculatorResult> = async ({
  value,
  operation,
  req,
}) => {
  if (operation === 'create' && !value) {
    const payload = req.payload
    const currentYear = new Date().getFullYear()

    const { totalDocs: count } = await payload.count({
      collection: 'calculator-results',
      where: {
        calculationNumber: {
          like: `${currentYear}-%`,
        },
      },
    })

    let nextNumber = count + 1

    return `${currentYear}-${nextNumber}`
  }

  return value
}
