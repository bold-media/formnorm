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

    // Find the last calculation number for the current year
    const lastCalculation = await payload.find({
      collection: 'calculator-results',
      where: {
        calculationNumber: {
          contains: `${currentYear}-`,
        },
      },
      sort: '-createdAt',
      limit: 1,
    })

    let nextNumber = 1

    if (lastCalculation.docs.length > 0) {
      const lastNumber = lastCalculation.docs[0].calculationNumber
      // Extract the number part (e.g., "2024-15" -> 15)
      const match = lastNumber?.match(new RegExp(`${currentYear}-(\\d+)`))
      if (match && match[1]) {
        nextNumber = parseInt(match[1]) + 1
      }
    }

    // Keep incrementing until we find a unique number
    let calculationNumber = `${currentYear}-${nextNumber}`

    while (true) {
      const existing = await payload.find({
        collection: 'calculator-results',
        where: {
          calculationNumber: {
            equals: calculationNumber,
          },
        },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        // Found a unique number
        break
      }

      // Increment and try again
      nextNumber++
      calculationNumber = `${currentYear}-${nextNumber}`
    }

    return calculationNumber
  }

  return value
}
