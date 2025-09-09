import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const body = await request.json()
    
    // Extract calculation number for verification if provided
    const { calculationNumber, ...data } = body

    console.log(`Updating calculator result ${id} with:`, data)
    
    // If calculation number is provided, verify it matches
    if (calculationNumber) {
      const existingResult = await payload.findByID({
        collection: 'calculator-results',
        id,
      })
      
      if (existingResult.calculationNumber !== calculationNumber) {
        return NextResponse.json(
          { 
            error: 'Calculation number mismatch',
            details: 'The provided calculation number does not match the record'
          },
          { status: 400 }
        )
      }
    }

    // Update the calculator result
    const updatedResult = await payload.update({
      collection: 'calculator-results',
      id,
      data,
    })

    return NextResponse.json({
      success: true,
      data: updatedResult,
    })
  } catch (error) {
    console.error('Error updating calculator result:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update calculator result',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}