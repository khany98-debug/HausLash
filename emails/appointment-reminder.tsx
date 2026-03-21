import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from "@react-email/components"
import { format } from "date-fns"

export default function AppointmentReminderEmail({
  name,
  service,
  date,
  time,
  reminderType = "24h",
}: {
  name: string
  service: string
  date: string
  time: string
  reminderType?: "24h" | "1h"
}) {
  const isUrgent = reminderType === "1h"

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
            {isUrgent ? "Your Appointment is Coming Up!" : "Appointment Reminder"}
          </Text>

          <Hr />

          <Section>
            <Text>Hello {name},</Text>

            {isUrgent ? (
              <Text style={{ fontWeight: "bold", color: "#d97706" }}>
                Your appointment is in just 1 hour! We're looking forward to seeing you.
              </Text>
            ) : (
              <Text>
                We wanted to remind you about your upcoming appointment tomorrow.
              </Text>
            )}
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
            <Text style={{ fontSize: "14px", color: "#666" }}>
              Please arrive 5-10 minutes early to allow time to discuss your preferences and ensure the best results.
            </Text>
          </Section>

          <Section style={{ marginTop: "20px", backgroundColor: "#f0f8ff", padding: "20px", borderRadius: "10px" }}>
            <Text style={{ marginTop: 0 }}>
              <strong>Remember:</strong>
            </Text>
            <ul style={{ marginLeft: "20px", marginBottom: 0 }}>
              <li>The location and how to get there</li>
              <li>Bring your phone in case of emergencies</li>
              <li>No makeup around the eyes</li>
            </ul>
          </Section>

          {!isUrgent && (
            <Section style={{ marginTop: "20px" }}>
              <Text style={{ fontSize: "14px", color: "#666" }}>
                If you need to reschedule or have any questions, contact us as soon as possible.
              </Text>
            </Section>
          )}

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
