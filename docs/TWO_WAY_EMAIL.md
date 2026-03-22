# Two-Way Email Conversation Setup

This guide explains how to enable customers to reply to emails and have their responses appear in the admin chat.

## How It Works

1. Admin sends a reply to a customer inquiry
2. Customer receives the email with a "Reply-To" address
3. Customer replies to the email
4. The reply is captured and stored in the conversation thread
5. Admin sees the new message in the chat without refreshing

## Two Implementation Options

### Option 1: Manual Integration (Recommended for Now)

If you use an email service that doesn't support webhooks, you can manually log customer replies:

**Endpoint:** `POST /api/webhooks/email-reply`

**Request Body:**
```json
{
  "inquiryId": "123e4567-e89b-12d3-a456-426614174000",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "replyMessage": "Yes, I can make it work. Can you provide more details?",
  "emailThreadId": "CADkMN+dXXXXXXXXXXXXX"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer reply recorded"
}
```

### Option 2: Automatic Webhook Integration

Set up a webhook from your email service (Mailgun, SendGrid, etc) to automatically capture replies.

**Webhook Endpoint:** `https://yourdomain.com/api/webhooks/email-reply`

**Webhook Event Type:** Email received/replied

**Expected Request Format:**
```json
{
  "type": "email.reply",
  "from": "customer@example.com",
  "to": "inquiry-123@replies.yourdomain.com",
  "subject": "Re: Your HausLash Inquiry",
  "text": "Customer reply content here",
  "messageId": "123@sendgrid.net",
  "inReplyTo": "original-message-id@yourdomain.com"
}
```

## Setting Up Reply-To Address

The system automatically adds a Reply-To header to emails:
```
Reply-To: inquiry-{inquiryId}@replies.hauslash.co.uk
```

This allows:
- Email clients to properly thread responses
- Webhooks to identify which inquiry the reply belongs to
- Manual matching by customer email when needed

## Database Changes

The `contact_messages` table now includes:
- `email_thread_id` - Tracks email message IDs for threading
- Enhanced indexing for better performance

**Migration:** Run `scripts/003-add-contact-messages.sql` if you haven't already.

## Testing

### Test with cURL:
```bash
curl -X POST https://yourdomain.com/api/webhooks/email-reply \
  -H "Content-Type: application/json" \
  -d '{
    "inquiryId": "test-id",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "replyMessage": "This is my reply"
  }'
```

### In Admin Chat:
1. Select a conversation
2. The customer message will appear in the thread
3. Refresh the page - message persists
4. New customer messages appear with their name and timestamp

## FAQ

**Q: How do I know which inquiry a reply belongs to?**
A: The system matches by:
1. Email address (if using webhook)
2. Reference message ID (if available)
3. Manual inquiry ID (if submitted via API)

**Q: What if a customer replies before we reply?**
A: You can still manually add their message using the API endpoint above.

**Q: Does this work with Gmail, Outlook, etc?**
A: Yes! Customers can reply from any email client. You just need to set up a webhook endpoint with your email service to receive the replies.

**Q: Can I filter conversation by replied messages?**
A: Yes - the `sender` field is either 'customer' or 'admin', so you can filter the UI accordingly.
