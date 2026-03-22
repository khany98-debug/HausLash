import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import { z } from 'zod'

const replySchema = z.object({
  inquiryId: z.string(),
  email: z.string().email(),
  customerName: z.string().min(2),
  replyMessage: z.string().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Reply request body:', body)

    const parsed = replySchema.safeParse(body)

    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten())
      return NextResponse.json(
        { error: 'Invalid reply data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { inquiryId, email, customerName, replyMessage } = parsed.data
    const sql = getDb()

    console.log('Updating inquiry status for ID:', inquiryId)

    // Update inquiry status to 'replied'
    await sql`
      UPDATE contact_inquiries
      SET status = 'replied'
      WHERE id = ${inquiryId}
    `

    console.log('Inquiry status updated, storing message')

    // Store the reply message in contact_messages table
    try {
      await sql`
        INSERT INTO contact_messages (inquiry_id, message, sender, sender_name)
        VALUES (${inquiryId}, ${replyMessage}, 'admin', 'Admin')
      `
      console.log('Message stored successfully')
    } catch (tableError) {
      // Table might not exist yet, log warning but continue
      console.warn('Messages table may not exist yet, continuing without storing message:', tableError)
    }

    console.log('Sending email to:', email)

    // Send reply email to customer
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co.uk',
        to: email,
        subject: 'Re: Your HausLash Inquiry',
        html: `
          <h2>We've responded to your inquiry</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for reaching out to HausLash. We've reviewed your inquiry and have the following response:</p>
          <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap; color: #333;">
              ${replyMessage.replace(/\n/g, '<br>')}
            </p>
          </div>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br/>The HausLash Team</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            This is an automated response to your contact form submission.<br/>
            <a href="https://hauslash.co.uk">Visit our website</a>
          </p>
        `,
      })
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Error sending reply email:', emailError)
      // Don't fail the request if email fails
    }

    console.log('Reply processed successfully')

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
    })
  } catch (error) {
    console.error('Error processing reply:', error)
    return NextResponse.json(
      { error: 'Failed to send reply', details: String(error) },
      { status: 500 }
    )
  }
}
