import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generatePDFWithReactPDF } from '@/utils/CalculationPDF'

export async function POST(request: NextRequest) {
  try {
    const { calculationId } = await request.json()

    if (!calculationId) {
      return NextResponse.json({ error: 'calculationId is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const result = await payload.findByID({
      collection: 'calculator-results',
      id: calculationId,
    })

    if (!result) {
      return NextResponse.json({ error: 'Calculation not found' }, { status: 404 })
    }

    // Extract data from metadata
    const metadata = result.metadata as any
    const calculations = metadata?.calculations || {}
    const formData = metadata?.formData || {}
    const calculatorConfig = metadata?.config || {}
    const calculationNumber = result.calculationNumber

    const pdfBuffer = await generatePDFWithReactPDF({
      calculations: {
        area: calculations.area || 0,
        totalCost: calculations.totalCost || 0,
        pricePerM2: calculations.pricePerM2 || 0,
        generalItems: calculations.generalItems || [],
        elementItems: calculations.elementItems || [],
      },
      formData,
      config: calculatorConfig,
      calculationNumber: calculationNumber || '',
    })

    // Return PDF as blob
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="calculation-${calculationNumber}.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
