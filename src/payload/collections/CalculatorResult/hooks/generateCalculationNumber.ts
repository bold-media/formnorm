import { FieldHook } from 'payload'
import { CalculatorResult } from '@payload-types'

export const generateCalculationNumber: FieldHook<CalculatorResult> = async ({
  value,
  operation,
  req,
}) => {
  if (operation === 'create' && !value) {
    try {
      const payload = req.payload
      const currentYear = new Date().getFullYear()

      console.log('Generating calculation number for year:', currentYear)

      const { totalDocs: count } = await payload.count({
        collection: 'calculator-results',
        where: {
          calculationNumber: {
            like: `${currentYear}-%`,
          },
        },
      })

      console.log('Found existing calculations:', count)

      let nextNumber = count + 1
      const generatedNumber = `${currentYear}-${nextNumber}`

      console.log('Generated calculation number:', generatedNumber)
      return generatedNumber
    } catch (error) {
      console.error('Error in generateCalculationNumber:', error)
      // Fallback: use timestamp to ensure uniqueness
      const fallbackNumber = `${new Date().getFullYear()}-${Date.now()}`
      console.log('Using fallback number:', fallbackNumber)
      return fallbackNumber
    }
  }

  return value
}
