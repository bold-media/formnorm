import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import CalculatorResultView from '@/modules/common/Blocks/components/CalculatorResultView'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CalculatorResultPage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config })

  try {
    const result = await payload.findByID({
      collection: 'calculator-results',
      id,
    })

    if (!result) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CalculatorResultView result={result} />
      </div>
    )
  } catch (error) {
    console.error('Error loading calculation result:', error)
    notFound()
  }
}
