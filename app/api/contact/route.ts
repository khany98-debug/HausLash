import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { resend } from '@/lib/email'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10).max(5000),
})

type ContactFormData = z.infer<typeof contactSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid contact form data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = parsed.data as ContactFormData
    const sql = getDb()

    // Store contact inquiry in database
    const result = await sql`
      INSERT INTO contact_inquiries (
        name,
        email,
        phone,
        message,
        status
      )
      VALUES (
        ${name},
        ${email},
        ${phone},
        ${message},
        'new'
      )
      RETURNING id, created_at
    `

    const inquiryId = result[0].id

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
        to: email,
        subject: 'Thank you for contacting HausLash',
        html: `
          <h2>We've received your message</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to HausLash! We've received your inquiry and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p style="padding: 10px; background-color: #f5f5f5; border-left: 3px solid #333;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <p>Best regards,<br/>The HausLash Team</p>
        `,
      })
    } catch (emailError) {
      console.error('Error sending customer confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    // Send admin notification email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_ADDRESS || 'noreply@hauslash.co',
        to: process.env.ADMIN_EMAIL || 'admin@hauslash.co',
        subject: `New Contact Inquiry from ${name}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Inquiry ID:</strong> ${inquiryId}</p>
          <hr style="margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; background-color: #f5f5f5; border-left: 3px solid #333;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <p>
            <a href="https://yourdomain.com/admin/contact/${inquiryId}" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
        `,
      })
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you shortly.',
      id: inquiryId,
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'new'
    const limit = parseInt(searchParams.get('limit') || '50')

    const sql = getDb()

    const inquiries = await sql`
      SELECT id, name, email, phone, message, status, created_at
      FROM contact_inquiries
      WHERE status = ${status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Error fetching contact inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
