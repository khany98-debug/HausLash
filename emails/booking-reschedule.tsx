import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components"

export default function BookingRescheduleEmail({
  name,
  service,
  oldDate,
  oldTime,
  newDate,
  newTime,
  reason,
}: {
  name: string
  service: string
  oldDate: string
  oldTime: string
  newDate: string
  newTime: string
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
            Appointment Rescheduled
          </Text>

          <Hr />

          <Section>
            <Text>Hello {name},</Text>

            <Text>
              We are pleased to confirm that your appointment has been successfully rescheduled.
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#fff3cd",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
              border: "1px solid #ffc107",
            }}
          >
            <Text style={{ fontWeight: "bold", marginTop: 0 }}>Previous Appointment</Text>

            <Text style={{ marginBottom: "8px" }}>
              <strong>Service</strong><br />
              {service}
            </Text>

            <Text style={{ marginBottom: "8px" }}>
              <strong>Date</strong><br />
              {oldDate}
            </Text>

            <Text>
              <strong>Time</strong><br />
              {oldTime}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#d4edda",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
              border: "1px solid #28a745",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#155724", marginTop: 0 }}>
              ✓ New Appointment Confirmed
            </Text>

            <Text style={{ marginBottom: "8px", color: "#155724" }}>
              <strong>Service</strong><br />
              {service}
            </Text>

            <Text style={{ marginBottom: "8px", color: "#155724" }}>
              <strong>Date</strong><br />
              {newDate}
            </Text>

            <Text style={{ color: "#155724" }}>
              <strong>Time</strong><br />
              {newTime}
            </Text>
          </Section>

          {reason && (
            <Section style={{ marginTop: "20px" }}>
              <Text>
                <strong>Reason for Reschedule:</strong><br />
                {reason}
              </Text>
            </Section>
          )}

          <Section style={{ marginTop: "30px", backgroundColor: "#f0f8ff", padding: "20px", borderRadius: "10px" }}>
            <Text style={{ marginTop: 0 }}>
              <strong>Important Reminders</strong>
            </Text>

            <Text style={{ fontSize: "14px", marginBottom: "10px" }}>
              • Please arrive 5-10 minutes early
            </Text>

            <Text style={{ fontSize: "14px", marginBottom: "10px" }}>
              • If you need to reschedule again, please contact us as soon as possible
            </Text>

            <Text style={{ fontSize: "14px" }}>
              • Your deposit will carry over to your new appointment
            </Text>
          </Section>

          <Section style={{ marginTop: "30px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#999" }}>
              If you have any questions or need further assistance, please feel free to contact us.
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
