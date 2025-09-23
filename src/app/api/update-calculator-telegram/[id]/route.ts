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
    const data = await request.json()

    // First, get the existing document to preserve metadata
    const existing = await payload.findByID({
      collection: 'calculator-results',
      id,
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Calculator result not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Add telegramChatId if the field exists in the schema
    if (data.telegramChatId) {
      updateData.telegramChatId = data.telegramChatId
    }

    // Merge metadata with existing data
    const existingMetadata = (existing as any).metadata || {}
    updateData.metadata = {
      ...existingMetadata,
      telegramUserInfo: {
        username: data.telegramUsername,
        firstName: data.telegramFirstName,
        lastName: data.telegramLastName,
        lastInteraction: new Date().toISOString(),
      },
    }

    // Update the calculator result with Telegram info
    const updated = await payload.update({
      collection: 'calculator-results',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      id: (updated as any).id,
    })
  } catch (error) {
    console.error('Error updating calculator result with Telegram info:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}