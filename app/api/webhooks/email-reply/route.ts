import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'

// Schema for customer reply via email
const emailReplySchema = z.object({
  inquiryId: z.string().min(1, 'Inquiry ID is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  replyMessage: z.string().min(1, 'Reply message cannot be empty').max(5000, 'Message too long'),
  emailThreadId: z.string().optional(), // Email message ID for tracking
})

// Alternative: For direct email webhook integration (if using Mailgun, SendGrid, etc)
const webhookSchema = z.object({
  type: z.enum(['email.reply', 'email.received']),
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  text: z.string(),
  html: z.string().optional(),
  messageId: z.string().optional(),
  inReplyTo: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Email webhook received:', body)

    // Try to parse as email reply schema first (manual/API submission)
    const emailReplyParsed = emailReplySchema.safeParse(body)
    if (emailReplyParsed.success) {
      return handleEmailReply(emailReplyParsed.data)
    }

    // Try to parse as webhook schema
    const webhookParsed = webhookSchema.safeParse(body)
    if (webhookParsed.success) {
      return handleWebhookReply(webhookParsed.data)
    }

    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing email webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function handleEmailReply(data: z.infer<typeof emailReplySchema>) {
  try {
    const { inquiryId, customerEmail, customerName, replyMessage, emailThreadId } = data
    const sql = getDb()

    // Verify the inquiry exists and matches the email
    const inquiry = await sql`
      SELECT id, email, name FROM contact_inquiries
      WHERE id = ${inquiryId}
    `

    if (inquiry.length === 0) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    const inq = inquiry[0]
    
    // Verify email matches (security check)
    if (inq.email !== customerEmail) {
      console.warn(`Email mismatch: inquiry email ${inq.email} vs reply from ${customerEmail}`)
      return NextResponse.json(
        { error: 'Email address does not match inquiry' },
        { status: 403 }
      )
    }

    // Create the messages table if needed
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          inquiry_id TEXT NOT NULL,
          message TEXT NOT NULL,
          sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
          sender_name TEXT NOT NULL,
          email_thread_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `
    } catch (e) {
      // Table might exist
    }

    // Insert the customer reply
    await sql`
      INSERT INTO contact_messages (inquiry_id, message, sender, sender_name, email_thread_id)
      VALUES (${inquiryId}, ${replyMessage}, 'customer', ${customerName}, ${emailThreadId || null})
    `

    console.log('Customer reply stored:', { inquiryId, from: customerEmail })

    return NextResponse.json({
      success: true,
      message: 'Customer reply recorded',
    })
  } catch (error) {
    console.error('Error handling email reply:', error)
    return NextResponse.json(
      { error: 'Failed to record reply', details: String(error) },
      { status: 500 }
    )
  }
}

async function handleWebhookReply(data: z.infer<typeof webhookSchema>) {
  try {
    const { from, to, subject, text, messageId, inReplyTo } = data
    const sql = getDb()

    // Try to match the reply to an inquiry
    // Look for inquiry matching the FROM email address
    const inquiries = await sql`
      SELECT id, email, name FROM contact_inquiries
      WHERE email = ${from}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (inquiries.length === 0) {
      console.warn('No matching inquiry found for email:', from)
      return NextResponse.json(
        { error: 'No matching inquiry found', email: from },
        { status: 404 }
      )
    }

    const inquiry = inquiries[0]

    // Create messages table if needed
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          inquiry_id TEXT NOT NULL,
          message TEXT NOT NULL,
          sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
          sender_name TEXT NOT NULL,
          email_thread_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `
    } catch (e) {
      // Table might exist
    }

    // Store the customer reply
    await sql`
      INSERT INTO contact_messages (inquiry_id, message, sender, sender_name, email_thread_id)
      VALUES (${inquiry.id}, ${text}, 'customer', ${inquiry.name}, ${messageId || null})
    `

    console.log('Webhook reply stored:', { inquiryId: inquiry.id, from })

    return NextResponse.json({
      success: true,
      message: 'Reply recorded from webhook',
    })
  } catch (error) {
    console.error('Error handling webhook reply:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook', details: String(error) },
      { status: 500 }
    )
  }
}

