import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // Fetch the calculator result by ID
    const result = await payload.findByID({
      collection: 'calculator-results',
      id,
    })

    if (!result) {
      return NextResponse.json(
        { error: 'Calculator result not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching calculator result:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch calculator result',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}