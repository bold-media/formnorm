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
    let calculationNumber = `${currentYear}-${nextNumber}`

    // Check if this number already exists (in case of race condition)
    const existing = await payload.find({
      collection: 'calculator-results',
      where: {
        calculationNumber: {
          equals: calculationNumber,
        },
      },
      limit: 1,
    })

    // If it exists, add timestamp to make it unique
    if (existing.docs.length > 0) {
      calculationNumber = `${currentYear}-${nextNumber}-${Date.now()}`
    }

    return calculationNumber
  }

  return value
}
