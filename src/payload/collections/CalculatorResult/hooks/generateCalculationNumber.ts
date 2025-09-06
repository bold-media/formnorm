import { FieldHook } from 'payload'
import { CalculatorResult } from '@payload-types'

const ALLOWED_CHARS = '23456789ADEFKLMNT'

function generateCustomId(length: number = 8): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length)
    result += ALLOWED_CHARS[randomIndex]
  }
  return result
}

export const generateCalculationNumber: FieldHook<CalculatorResult> = async ({
  value,
  operation,
}: any) => {
  if (operation === 'create' && !value) {
    // Generate two parts of 4 characters each
    const firstPart = generateCustomId(4)
    const secondPart = generateCustomId(4)
    
    // Combine with dash in the middle
    return `${firstPart}-${secondPart}`
  }
  
  return value
}
