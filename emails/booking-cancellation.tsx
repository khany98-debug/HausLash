import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components"

export default function BookingCancellationEmail({
  name,
  service,
  date,
  time,
  refundAmount,
  reason,
}: {
  name: string
  service: string
  date: string
  time: string
  refundAmount: string
  reason?: string | null
}) {
  return (
    <Html>
      <Head />

      <Body
        style={{
          backgroundColor: "#EEEDE9",
          fontFamily: "Georgia, serif",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            maxWidth: "520px",
          }}
        >
          <Heading>Hauslash</Heading>

          <Text style={{ color: "#666" }}>
            Appointment Cancellation
          </Text>

          <Hr />

          <Section>
            <Text>Hello {name},</Text>

            <Text>
              We are writing to confirm that your appointment has been successfully cancelled.
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#f7f7f7",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <Text>
              <strong>Service</strong><br />
              {service}
            </Text>

            <Text>
              <strong>Date</strong><br />
              {date}
            </Text>

            <Text>
              <strong>Time</strong><br />
              {time}
            </Text>
          </Section>

          <Section style={{ marginTop: "20px" }}>
            <Text style={{ color: "#27ae60", fontWeight: "bold" }}>
              Refund Amount: {refundAmount}
            </Text>

            <Text style={{ fontSize: "14px", color: "#666" }}>
              The refund will be processed to your original payment method within 3-5 business days.
            </Text>

            {reason && (
              <Text>
                <strong>Cancellation Reason:</strong><br />
                {reason}
              </Text>
            )}
          </Section>

          <Section style={{ marginTop: "30px", backgroundColor: "#f0f8ff", padding: "20px", borderRadius: "10px" }}>
            <Text>
              <strong>Would you like to reschedule?</strong>
            </Text>

            <Text style={{ fontSize: "14px" }}>
              If you'd like to book another appointment, please visit our booking page or contact us directly.
            </Text>
          </Section>

          <Section style={{ marginTop: "30px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#999" }}>
              If you have any questions, please don't hesitate to contact us.
            </Text>

            <Hr style={{ marginTop: "20px", marginBottom: "20px" }} />

            <Text style={{ fontSize: "12px", color: "#999" }}>
              © Hauslash. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
