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
    maxWidth: "620px",
    overflow: "hidden",
  },
  hero: {
    backgroundColor: "#1d1a17",
    padding: "30px 34px",
    textAlign: "center" as const,
  },
  inner: {
    padding: "32px 34px",
  },
  logo: {
    margin: "0 auto 22px",
    width: "150px",
    height: "auto",
    filter: "invert(1)",
  },
  eyebrow: {
    color: "#cfc2b4",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
  },
  heading: {
    margin: "12px 0 0",
    color: "#fffdf9",
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
    marginTop: "18px",
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
    padding: "13px 20px",
    textDecoration: "none",
    margin: "0 6px 10px",
  },
  secondaryButton: {
    display: "inline-block",
    backgroundColor: "#fffdf9",
    border: "1px solid #d8cec2",
    borderRadius: "999px",
    color: "#1d1a17",
    fontSize: "14px",
    fontWeight: 700,
    padding: "12px 20px",
    textDecoration: "none",
    margin: "0 6px 10px",
  },
  footer: {
    color: "#8d8174",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
  },
}

export default function AdminBookingNotificationEmail({
  customerName,
  customerEmail,
  customerPhone,
  service,
  date,
  time,
  deposit,
  remaining,
  notes,
  calendarUrl,
}: {
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  date: string
  time: string
  deposit: string
  remaining?: string | null
  notes?: string | null
  calendarUrl: string
}) {
  const mailto = `mailto:${customerEmail}`
  const tel = customerPhone ? `tel:${customerPhone.replace(/\s+/g, "")}` : undefined

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.hero}>
            <Img src={LOGO_URL} alt="Hauslash" style={styles.logo} />
            <Text style={styles.eyebrow}>New booking received</Text>
            <Heading style={styles.heading}>{customerName} has booked.</Heading>
          </Section>

          <Section style={styles.inner}>
            <Section style={styles.card}>
              <Text style={styles.label}>Appointment</Text>
              <Text style={styles.value}>{service}</Text>
              <Text style={styles.value}>
                {date} at {time}
              </Text>
              <Text style={styles.value}>{STUDIO_ADDRESS}</Text>
            </Section>

            <Section style={styles.card}>
              <Text style={styles.label}>Client details</Text>
              <Text style={styles.value}>{customerName}</Text>
              <Text style={styles.value}>{customerEmail}</Text>
              <Text style={styles.value}>{customerPhone}</Text>
            </Section>

            <Section style={styles.card}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>Deposit paid: {deposit}</Text>
              {remaining && <Text style={styles.value}>Balance due at appointment: {remaining}</Text>}
            </Section>

            {notes && (
              <Section style={styles.card}>
                <Text style={styles.label}>Client notes</Text>
                <Text style={styles.value}>{notes}</Text>
              </Section>
            )}

            <Section style={{ textAlign: "center", marginTop: "26px" }}>
              <Link href={calendarUrl} style={styles.button}>
                Add to calendar
              </Link>
              <Link href={`${SITE_URL}/admin`} style={styles.secondaryButton}>
                Open admin
              </Link>
              <Link href={mailto} style={styles.secondaryButton}>
                Email client
              </Link>
              {tel && (
                <Link href={tel} style={styles.secondaryButton}>
                  Call client
                </Link>
              )}
            </Section>

            <Text style={styles.copy}>
              A calendar file is attached too, so the appointment can be added from Apple Calendar,
              Outlook, Gmail, or most phone calendar apps.
            </Text>

            <Hr style={{ borderColor: "#e7ded2", margin: "30px 0" }} />

            <Text style={styles.footer}>Hauslash admin notification</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
