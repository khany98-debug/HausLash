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

export default function BookingConfirmationEmail({
  name,
  service,
  date,
  time,
  deposit,
  remaining,
}: {
  name: string
  service: string
  date: string
  time: string
  deposit: string
  remaining?: string | null
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
            Booking Confirmation
          </Text>

          <Hr />

          <Section>

            <Text>Hello {name},</Text>

            <Text>
              Your appointment has been successfully booked.
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
              <strong>Service</strong><br/>
              {service}
            </Text>

            <Text>
              <strong>Date</strong><br/>
              {date}
            </Text>

            <Text>
              <strong>Time</strong><br/>
              {time}
            </Text>

          </Section>

          <Section style={{ marginTop: "20px" }}>

            <Text>
              Deposit paid: {deposit}
            </Text>

            {remaining && (
              <Text>
                Remaining balance due at appointment: {remaining}
              </Text>
            )}

          </Section>

          <Hr />

          <Text style={{ fontSize: "13px", color: "#777" }}>
            Please arrive with clean, makeup-free lashes.
          </Text>

          <Text style={{ fontSize: "13px", color: "#777" }}>
            If you require a patch test before your appointment,
            please contact us and we will arrange this for you.
          </Text>

          <Text style={{ fontSize: "13px", color: "#777" }}>
            Your technician will be in touch shortly to confirm the
            appointment location and any final details.
          </Text>

          <Hr />

          <Text style={{ fontSize: "12px", color: "#999" }}>
            Hauslash
          </Text>

        </Container>
      </Body>
    </Html>
  )
}