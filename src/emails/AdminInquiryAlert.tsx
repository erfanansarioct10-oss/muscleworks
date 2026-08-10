import * as React from 'react';
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
  Button,
  Preview,
} from '@react-email/components';

export interface AdminInquiryAlertProps {
  inquiryId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  inquiryType: string;
  message: string;
  preferredContactMethod?: string;
  deliveryCity?: string;
  productName?: string;
  variantLabel?: string;
  priceFormatted?: string;
  submittedAt?: string;
}

export const AdminInquiryAlert = ({
  inquiryId = 'INQ-1001',
  fullName = 'John Doe',
  phoneNumber = '+977 9801234567',
  email = 'john@example.com',
  inquiryType = 'general',
  message = 'Looking to buy 5 lbs Gold Standard Whey and check delivery to Pokhara.',
  preferredContactMethod = 'whatsapp',
  deliveryCity = 'Pokhara',
  productName = 'Gold Standard 100% Whey Protein',
  variantLabel = '5 lbs (2.27 kg) / Double Rich Chocolate',
  priceFormatted = 'NPR 11,500',
  submittedAt = new Date().toISOString(),
}: AdminInquiryAlertProps) => {
  const previewText = `🚨 ADMIN ALERT: New Inquiry #${inquiryId} from ${fullName} (${deliveryCity})`;

  const formattedPhoneDigits = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Alert Banner */}
          <Section style={alertHeaderStyle}>
            <Text style={alertBadgeStyle}>🚨 HIGH-PRIORITY STORE LEAD</Text>
            <Heading style={headingStyle}>New Web Inquiry Submitted</Heading>
            <Text style={subheadingStyle}>Ref ID: {inquiryId} · Golfutar Store Admin Alert</Text>
          </Section>

          {/* Contact Details Card */}
          <Section style={cardSectionStyle}>
            <Heading style={cardHeadingStyle}>👤 Customer Contact Details</Heading>
            <Text style={detailRowStyle}>
              <strong>Full Name:</strong> {fullName}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Phone Number:</strong>{' '}
              <Link href={`tel:${phoneNumber}`} style={phoneLinkStyle}>
                {phoneNumber}
              </Link>
            </Text>
            {email && (
              <Text style={detailRowStyle}>
                <strong>Email Address:</strong> {email}
              </Text>
            )}
            <Text style={detailRowStyle}>
              <strong>Delivery City:</strong> {deliveryCity}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Preferred Channel:</strong> {preferredContactMethod.toUpperCase()}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Inquiry Category:</strong> {inquiryType.toUpperCase()}
            </Text>
          </Section>

          {/* Product Context (If applicable) */}
          {productName && (
            <Section style={productCardSectionStyle}>
              <Heading style={cardHeadingStyle}>📦 Target Product Requested</Heading>
              <Text style={detailRowStyle}>
                <strong>Item Name:</strong> {productName}
              </Text>
              {variantLabel && (
                <Text style={detailRowStyle}>
                  <strong>Selected Variant:</strong> {variantLabel}
                </Text>
              )}
              {priceFormatted && (
                <Text style={detailRowStyle}>
                  <strong>Listed Price:</strong> {priceFormatted}
                </Text>
              )}
            </Section>
          )}

          {/* Message Content */}
          <Section style={cardSectionStyle}>
            <Heading style={cardHeadingStyle}>📝 Customer Message</Heading>
            <Text style={messageTextStyle}>&quot;{message}&quot;</Text>
          </Section>

          {/* Action CTAs */}
          <Section style={actionSectionStyle}>
            <Button
              href={`https://wa.me/${formattedPhoneDigits}?text=${encodeURIComponent(
                `Namaste ${fullName}! Regarding your MUSCLEWORKS inquiry (${inquiryId}):`
              )}`}
              style={whatsappButtonStyle}
            >
              💬 Instant Reply via WhatsApp
            </Button>
            <Text style={actionOrStyle}>or</Text>
            <Button href={`tel:${phoneNumber}`} style={callButtonStyle}>
              📞 Direct Call Customer
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          {/* Footer Metadata */}
          <Section style={footerStyle}>
            <Text style={footerSubtextStyle}>Submitted At: {submittedAt}</Text>
            <Text style={footerSubtextStyle}>
              MUSCLEWORKS SUPPLEMENTS Store Dispatch System · Golfutar, Kathmandu
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminInquiryAlert;

// Styling Tokens (Minimal Premium Luxury Admin Alert Theme)
const mainStyle: React.CSSProperties = {
  backgroundColor: '#0B0B0B',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  color: '#FFFFFF',
  padding: '20px 0',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#121212',
  margin: '0 auto',
  padding: '32px 24px',
  borderRadius: '12px',
  border: '1px solid #2C2C2C',
  maxWidth: '580px',
};

const alertHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingBottom: '20px',
};

const alertBadgeStyle: React.CSSProperties = {
  backgroundColor: '#DC2626', // Crimson Alert
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  padding: '4px 12px',
  borderRadius: '9999px',
  display: 'inline-block',
  margin: '0 0 12px 0',
  textTransform: 'uppercase',
};

const headingStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '22px',
  fontWeight: 800,
  margin: '0 0 6px 0',
};

const subheadingStyle: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '13px',
  margin: 0,
};

const cardSectionStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '18px',
  borderRadius: '8px',
  border: '1px solid #2C2C2C',
  margin: '0 0 16px 0',
};

const productCardSectionStyle: React.CSSProperties = {
  backgroundColor: '#1F1F1F',
  padding: '18px',
  borderRadius: '8px',
  border: '1px solid #D4AF37', // Gold Border for product context
  margin: '0 0 16px 0',
};

const cardHeadingStyle: React.CSSProperties = {
  color: '#D4AF37',
  fontSize: '15px',
  fontWeight: 700,
  margin: '0 0 12px 0',
};

const detailRowStyle: React.CSSProperties = {
  color: '#E4E4E7',
  fontSize: '14px',
  margin: '0 0 6px 0',
};

const phoneLinkStyle: React.CSSProperties = {
  color: '#D4AF37',
  fontWeight: 700,
  textDecoration: 'underline',
};

const messageTextStyle: React.CSSProperties = {
  color: '#F4F4F5',
  fontSize: '14px',
  fontStyle: 'italic',
  backgroundColor: '#242424',
  padding: '12px 14px',
  borderRadius: '6px',
  margin: 0,
};

const actionSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px 0',
};

const whatsappButtonStyle: React.CSSProperties = {
  backgroundColor: '#059669',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: 700,
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '0 0 8px 0',
};

const actionOrStyle: React.CSSProperties = {
  color: '#71717A',
  fontSize: '12px',
  margin: '4px 0',
};

const callButtonStyle: React.CSSProperties = {
  backgroundColor: '#27272A',
  color: '#FFFFFF',
  border: '1px solid #3F3F46',
  fontSize: '13px',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#2C2C2C',
  margin: '20px 0',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const footerSubtextStyle: React.CSSProperties = {
  color: '#71717A',
  fontSize: '12px',
  margin: '0 0 4px 0',
};
