import { CollectionAfterChangeHook } from 'payload'

export const generatePDFOnCreate: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only generate PDF on create
  if (operation !== 'create') {
    return doc
  }

  // Skip if we're already in an update operation (to avoid infinite loop)
  if (req.context?.isGeneratingPDF) {
    return doc
  }

  try {
    console.log(`Generating PDF for calculation ${doc.calculationNumber}...`)
    
    // Call the PDF generation API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calculationId: doc.id,
      }),
    })

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.statusText}`)
    }

    // Get the PDF as a buffer
    const pdfBuffer = Buffer.from(await response.arrayBuffer())
    
    // Create a temporary file object for Payload
    const file = {
      data: pdfBuffer,
      mimetype: 'application/pdf',
      name: `calculation-${doc.calculationNumber}.pdf`,
      size: pdfBuffer.length,
    }

    // Update the document with the PDF file
    // Set context to avoid triggering this hook again
    req.context = { ...req.context, isGeneratingPDF: true }
    
    const updatedDoc = await req.payload.update({
      collection: 'calculator-results',
      id: doc.id,
      data: {},
      file,
    })

    console.log(`PDF generated and uploaded for calculation ${doc.calculationNumber}`)
    return updatedDoc
  } catch (error) {
    console.error('Error generating PDF on create:', error)
    // Return the document even if PDF generation fails
    // This ensures the calculation is still saved even if PDF generation fails
    return doc
  }
}