-- Contact Messages Table for conversation history
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
  sender_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_inquiry_id ON contact_messages(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
