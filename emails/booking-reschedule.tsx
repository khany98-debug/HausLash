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
  Img,
} from "@react-email/components"

const SITE_URL = "https://hauslash.co.uk"
const LOGO_URL = `${SITE_URL}/images/brand/hauslash-original-wordmark.png`
const STUDIO_ADDRESS = "5 Leawood Road, Stoke-On-Trent, ST4 6JZ"

const styles = {
  body: {
    backgroundColor: "#f4f0e9",
    fontFamily: "Arial, sans-serif",
    padding: "32px 0",
    color: "#1d1a17",
  },
  container: {
    backgroundColor: "#fffdf9",
    border: "1px solid #e3dbcf",
    borderRadius: "18px",
    maxWidth: "580px",
    overflow: "hidden",
  },
  inner: {
    padding: "34px",
  },
  logo: {
    margin: "0 auto 22px",
    width: "150px",
    height: "auto",
  },
  eyebrow: {
    color: "#8d8174",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  },
  heading: {
    margin: "12px 0 0",
    color: "#1d1a17",
    fontFamily: "Georgia, serif",
    fontSize: "34px",
    fontWeight: 400,
    lineHeight: "1.1",
    textAlign: "center" as const,
  },
  copy: {
    color: "#5f5750",
    fontSize: "15px",
    lineHeight: "1.7",
  },
  card: {
    backgroundColor: "#f7f3ed",
    border: "1px solid #e7ded2",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "22px",
  },
  highlightCard: {
    backgroundColor: "#1d1a17",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "22px",
  },
  label: {
    color: "#8d8174",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
  },
  value: {
    color: "#1d1a17",
    fontSize: "16px",
    lineHeight: "1.45",
    marginTop: 0,
  },
  lightLabel: {
    color: "#cfc2b4",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
  },
  lightValue: {
    color: "#fffdf9",
    fontSize: "16px",
    lineHeight: "1.45",
    marginTop: 0,
  },
  button: {
    display: "inline-block",
    backgroundColor: "#1d1a17",
    borderRadius: "999px",
    color: "#fffdf9",
    fontSize: "14px",
    fontWeight: 700,
    padding: "13px 22px",
    textDecoration: "none",
  },
  secondaryButton: {
    display: "inline-block",
    backgroundColor: "#fffdf9",
    border: "1px solid #d8cec2",
    borderRadius: "999px",
    color: "#1d1a17",
    fontSize: "14px",
    fontWeight: 700,
    padding: "12px 22px",
    textDecoration: "none",
    marginLeft: "8px",
  },
  footer: {
    color: "#8d8174",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
  },
}

export default function BookingRescheduleEmail({
  name,
  service,
  oldDate,
  oldTime,
  newDate,
  newTime,
  reason,
  calendarUrl,
}: {
  name: string
  service: string
  oldDate: string
  oldTime: string
  newDate: string
  newTime: string
  reason?: string | null
  calendarUrl?: string
}) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.inner}>
            <Img src={LOGO_URL} alt="Hauslash" style={styles.logo} />
            <Text style={styles.eyebrow}>Appointment updated</Text>
            <Heading style={styles.heading}>Your new appointment is confirmed.</Heading>

            <Text style={{ ...styles.copy, marginTop: "24px" }}>
              Hello {name}, your Hauslash appointment has been moved to the new date and time below. Your deposit carries over automatically.
            </Text>

            <Section style={styles.highlightCard}>
              <Text style={styles.lightLabel}>New appointment</Text>
              <Text style={styles.lightValue}>{service}</Text>
              <Text style={styles.lightValue}>
                {newDate} at {newTime}
              </Text>
              <Text style={styles.lightValue}>{STUDIO_ADDRESS}</Text>
            </Section>

            <Section style={styles.card}>
              <Text style={styles.label}>Previous appointment</Text>
              <Text style={styles.value}>
                {oldDate} at {oldTime}
              </Text>
              {reason && (
                <>
                  <Text style={styles.label}>Note from Hauslash</Text>
                  <Text style={styles.value}>{reason}</Text>
                </>
              )}
            </Section>

            <Text style={styles.copy}>
              Please arrive with clean, makeup-free lashes. If you would like a patch test before the appointment, send us a message and we will arrange this with you.
            </Text>

            <Section style={{ textAlign: "center", marginTop: "26px" }}>
              <Link href={`${SITE_URL}/bookings`} style={styles.button}>
                View my booking
              </Link>
              {calendarUrl && (
                <Link href={calendarUrl} style={styles.secondaryButton}>
                  Add updated time
                </Link>
              )}
            </Section>

            <Text style={{ ...styles.copy, fontSize: "13px", textAlign: "center" }}>
              We have attached an updated calendar file for your phone, Apple Calendar,
              Outlook, or Gmail.
            </Text>

            <Hr style={{ borderColor: "#e7ded2", margin: "30px 0" }} />

            <Text style={styles.footer}>
              Hauslash, {STUDIO_ADDRESS}
              <br />
              Need to ask something before your appointment? Visit{" "}
              <Link href={`${SITE_URL}/contact`} style={{ color: "#1d1a17" }}>
                hauslash.co.uk/contact
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
