import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
} from '@react-email/components'

const SITE_URL = 'https://hauslash.co.uk'
const LOGO_URL = `${SITE_URL}/images/brand/hauslash-original-wordmark.png`

const styles = {
  body: {
    backgroundColor: '#f4f0e9',
    fontFamily: 'Arial, sans-serif',
    padding: '32px 0',
    color: '#1d1a17',
  },
  container: {
    backgroundColor: '#fffdf9',
    border: '1px solid #e3dbcf',
    borderRadius: '18px',
    maxWidth: '560px',
    overflow: 'hidden',
  },
  inner: {
    padding: '34px',
  },
  logo: {
    margin: '0 auto 22px',
    width: '150px',
    height: 'auto',
  },
  eyebrow: {
    color: '#8d8174',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
  },
  heading: {
    margin: '12px 0 0',
    color: '#1d1a17',
    fontFamily: 'Georgia, serif',
    fontSize: '32px',
    fontWeight: 400,
    lineHeight: '1.1',
    textAlign: 'center' as const,
  },
  copy: {
    color: '#5f5750',
    fontSize: '15px',
    lineHeight: '1.7',
  },
  code: {
    backgroundColor: '#1d1a17',
    borderRadius: '16px',
    color: '#fffdf9',
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '0.28em',
    padding: '18px 20px',
    textAlign: 'center' as const,
  },
  footer: {
    color: '#8d8174',
    fontSize: '12px',
    lineHeight: '1.6',
    textAlign: 'center' as const,
  },
}

export default function CustomerBookingAccessCodeEmail({ code }: { code: string }) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.inner}>
            <Img src={LOGO_URL} alt="Hauslash" style={styles.logo} />
            <Text style={styles.eyebrow}>Secure booking access</Text>
            <Heading style={styles.heading}>Your Hauslash code</Heading>

            <Text style={{ ...styles.copy, marginTop: '24px' }}>
              Enter this code on the Hauslash website to view your appointment history.
              It expires in 10 minutes.
            </Text>

            <Text style={styles.code}>{code}</Text>

            <Text style={styles.copy}>
              If you did not request this, you can ignore this email. Your booking details
              will not be shown without this code.
            </Text>

            <Hr style={{ borderColor: '#e7ded2', margin: '30px 0' }} />

            <Text style={styles.footer}>Hauslash · Stoke-On-Trent</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
