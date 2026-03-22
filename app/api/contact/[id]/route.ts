import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sql = getDb()

    // Get the inquiry
    const inquiry = await sql`
      SELECT id, name, email, phone, message, status, created_at
      FROM contact_inquiries
      WHERE id = ${id}
    `

    if (inquiry.length === 0) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Get all messages in the conversation
    let messages: any[] = []
    try {
      // Ensure the table exists
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS contact_messages (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            inquiry_id TEXT NOT NULL,
            message TEXT NOT NULL,
            sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
            sender_name TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
          )
        `
      } catch (createError) {
        // Table might already exist, that's fine
        console.warn('Could not create messages table:', createError)
      }

      messages = await sql`
        SELECT id, message, sender, sender_name, created_at
        FROM contact_messages
        WHERE inquiry_id = ${id}
        ORDER BY created_at ASC
      `
    } catch (dbError) {
      console.debug('Could not fetch messages (table may not exist yet):', dbError)
      messages = []
    }

    // Combine inquiry data with conversation messages
    const conversation = {
      inquiry: inquiry[0],
      messages: messages || [],
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation', details: String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['new', 'replied', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const sql = getDb()
    await sql`
      UPDATE contact_inquiries
      SET status = ${status}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sql = getDb()

    // Delete messages first (due to foreign key constraint)
    await sql`
      DELETE FROM contact_messages
      WHERE inquiry_id = ${id}
    `

    // Delete inquiry
    await sql`
      DELETE FROM contact_inquiries
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
