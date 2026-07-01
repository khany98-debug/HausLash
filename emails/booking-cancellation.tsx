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
import { getAppointmentLocationDetails } from "@/lib/appointment-location"
import { isPatchTestService } from "@/lib/service-display"

const SITE_URL = "https://hauslash.co.uk"
const LOGO_URL = `${SITE_URL}/images/brand/hauslash-original-wordmark.png`

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
  footer: {
    color: "#8d8174",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
  },
}

export default function BookingCancellationEmail({
  name,
  service,
  date,
  time,
  depositAmount,
  reason,
}: {
  name: string
  service: string
  date: string
  time: string
  depositAmount: string
  reason?: string | null
}) {
  const locationDetails = getAppointmentLocationDetails(service)
  const isPatchTest = isPatchTestService({ name: service, slug: "" })

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.inner}>
            <Img src={LOGO_URL} alt="Hauslash" style={styles.logo} />
            <Text style={styles.eyebrow}>Appointment cancelled</Text>
            <Heading style={styles.heading}>Your appointment has been cancelled.</Heading>

            <Text style={{ ...styles.copy, marginTop: "24px" }}>
              Hello {name}, this confirms that your Hauslash appointment has been cancelled. We know plans can change, and we would be happy to welcome you another time.
            </Text>

            <Section style={styles.card}>
              <Text style={styles.label}>Cancelled appointment</Text>
              <Text style={styles.value}>{service}</Text>
              <Text style={styles.value}>
                {date} at {time}
              </Text>
              <Text style={styles.label}>{locationDetails.label}</Text>
              <Text style={styles.value}>{locationDetails.value}</Text>
            </Section>

            <Section style={styles.card}>
              <Text style={styles.label}>Deposit policy</Text>
              <Text style={styles.value}>
                {isPatchTest ? "Patch test deposit paid" : "Deposit paid"}: {depositAmount}
              </Text>
              <Text style={styles.copy}>
                {isPatchTest
                  ? "Patch test deposits are attendance deposits and are refunded after an attended patch test. If you have questions about this cancellation, please contact Hauslash."
                  : "Deposits are non-refundable once the booking has been made. A new deposit will be required to secure another appointment."}
              </Text>
              {reason && (
                <>
                  <Text style={styles.label}>Note from Hauslash</Text>
                  <Text style={styles.value}>{reason}</Text>
                </>
              )}
            </Section>

            <Text style={styles.copy}>
              Ready to choose a new time? You can rebook online or send us a message if you would like help finding the right appointment.
            </Text>

            <Section style={{ textAlign: "center", marginTop: "26px" }}>
              <Link href={`${SITE_URL}/book`} style={styles.button}>
                Book a new appointment
              </Link>
            </Section>

            <Hr style={{ borderColor: "#e7ded2", margin: "30px 0" }} />

            <Text style={styles.footer}>
              {locationDetails.footer}
              <br />
              Questions? Reply to this email or visit{" "}
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
