import { FieldHook } from 'payload'
import { CalculatorResult } from '@payload-types'

export const generateCalculationNumber: FieldHook<CalculatorResult> = async ({
  value,
  operation,
  req,
}: any) => {
  if (operation === 'create' && !value) {
    const payload = req.payload
    const currentYear = new Date().getFullYear()

    // TEMPORARY: Reset numbering to 1
    // Remove this block after the first calculation is created
    const RESET_NUMBERING = false
    if (RESET_NUMBERING) {
      return `${currentYear}-1`
    }

    // Get the highest existing calculation number overall
    const lastResult = await payload.find({
      collection: 'calculator-results',
      sort: '-createdAt',
      limit: 1,
      where: {
        calculationNumber: {
          exists: true,
        },
      },
    })

    let nextNumber = 1

    if (lastResult.docs.length > 0) {
      const lastCalcNumber = lastResult.docs[0].calculationNumber
      // Extract the number after the dash
      const parts = lastCalcNumber.split('-')
      if (parts.length >= 2) {
        const lastNum = parseInt(parts[parts.length - 1])
        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1
        }
      }
    }

    // Return in format: YYYY-N
    return `${currentYear}-${nextNumber}`
  }

  return value
}
