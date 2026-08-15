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
import { STORE_PHONE, STORE_WHATSAPP } from '../lib/constants';

export interface CustomerInquiryConfirmationProps {
  inquiryId: string;
  fullName: string;
  phoneNumber: string;
  inquiryType: string;
  message: string;
  deliveryCity?: string;
  productName?: string;
  variantLabel?: string;
  priceFormatted?: string;
}

export const CustomerInquiryConfirmation = ({
  inquiryId = 'INQ-1001',
  fullName = 'Valued Customer',
  phoneNumber = '+977 981-9877070',
  inquiryType = 'general',
  message = 'I would like to check stock availability and delivery to Golfutar.',
  deliveryCity = 'Kathmandu',
  productName,
  variantLabel,
  priceFormatted,
}: CustomerInquiryConfirmationProps) => {
  const previewText = `Namaste ${fullName}! Your inquiry #${inquiryId} has been received by MUSCLEWORKS SUPPLEMENTS Nepal.`;
  const sanitizedWhatsApp = STORE_WHATSAPP.replace(/\D/g, '');

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Header Banner */}
          <Section style={headerStyle}>
            <Text style={brandBadgeStyle}>MUSCLEWORKS SUPPLEMENTS</Text>
            <Heading style={headingStyle}>Inquiry Receipt Confirmed</Heading>
            <Text style={subheadingStyle}>
              Golfutar, Budha-Nilkantha, Kathmandu · 100% Genuine Importer Guarantee
            </Text>
          </Section>

          {/* Main Greeting */}
          <Section style={contentSectionStyle}>
            <Text style={paragraphStyle}>
              Namaste <strong>{fullName}</strong>,
            </Text>
            <Text style={paragraphStyle}>
              Thank you for contacting <strong>MUSCLEWORKS SUPPLEMENTS</strong>. We have received
              your inquiry (Ref: <code>{inquiryId}</code>). Our team at our Golfutar flagship store
              is reviewing your details and will contact you via {phoneNumber} shortly.
            </Text>
          </Section>

          <Hr style={dividerStyle} />

          {/* Summary Details */}
          <Section style={cardSectionStyle}>
            <Heading style={cardHeadingStyle}>Inquiry Summary</Heading>
            
            <Text style={detailRowStyle}>
              <strong>Inquiry Reference:</strong> {inquiryId}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Phone Number:</strong> {phoneNumber}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Delivery City:</strong> {deliveryCity}
            </Text>
            <Text style={detailRowStyle}>
              <strong>Inquiry Type:</strong> {inquiryType.toUpperCase()}
            </Text>

            {productName && (
              <div style={productBoxStyle}>
                <Text style={productTitleStyle}>📦 Product Context</Text>
                <Text style={detailRowStyle}>
                  <strong>Item:</strong> {productName}
                </Text>
                {variantLabel && (
                  <Text style={detailRowStyle}>
                    <strong>Variant:</strong> {variantLabel}
                  </Text>
                )}
                {priceFormatted && (
                  <Text style={detailRowStyle}>
                    <strong>Price:</strong> {priceFormatted}
                  </Text>
                )}
              </div>
            )}

            <Text style={messageBoxTitleStyle}>📝 Submitted Message:</Text>
            <Text style={messageBoxStyle}>&quot;{message}&quot;</Text>
          </Section>

          {/* Authenticity Guarantee Banner */}
          <Section style={trustBannerStyle}>
            <Text style={trustTitleStyle}>🛡️ 100% Genuine Importer Authenticity</Text>
            <Text style={trustTextStyle}>
              All supplements at MUSCLEWORKS feature official national importer hologram seals and
              scratch-and-verify codes. Zero compromise on quality.
            </Text>
          </Section>

          {/* Quick Action Button */}
          <Section style={actionSectionStyle}>
            <Button
              href={`https://wa.me/${sanitizedWhatsApp}`}
              style={whatsappButtonStyle}
            >
              💬 Need Urgent Help? Chat via WhatsApp
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              <strong>MUSCLEWORKS SUPPLEMENTS NEPAL</strong>
            </Text>
            <Text style={footerSubtextStyle}>
              Golfutar, Budha-Nilkantha, Kathmandu (44500), Nepal
            </Text>
            <Text style={footerSubtextStyle}>
              Opening Hours: Sun–Fri 10:00 AM – 8:00 PM | Sat: Contact Store
            </Text>
            <Text style={footerSubtextStyle}>
              Phone: {STORE_PHONE} | Web: {' '}
              <Link href="https://muscleworksnepal.com" style={linkStyle}>
                muscleworksnepal.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CustomerInquiryConfirmation;

// Styling Tokens (Minimal Premium Luxury Dark Athletic Theme)
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

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingBottom: '20px',
};

const brandBadgeStyle: React.CSSProperties = {
  color: '#FFFFFF', // Crisp White
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  margin: '0 0 8px 0',
  textTransform: 'uppercase',
};

const headingStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: 800,
  margin: '0 0 8px 0',
};

const subheadingStyle: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '13px',
  margin: 0,
};

const contentSectionStyle: React.CSSProperties = {
  padding: '16px 0',
};

const paragraphStyle: React.CSSProperties = {
  color: '#E4E4E7',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px 0',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#2C2C2C',
  margin: '24px 0',
};

const cardSectionStyle: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #2C2C2C',
};

const cardHeadingStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: 700,
  margin: '0 0 16px 0',
};

const detailRowStyle: React.CSSProperties = {
  color: '#D4D4D8',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const productBoxStyle: React.CSSProperties = {
  backgroundColor: '#242424',
  padding: '12px 16px',
  borderRadius: '6px',
  margin: '16px 0',
  borderLeft: '3px solid #71717A',
};

const productTitleStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '13px',
  fontWeight: 700,
  margin: '0 0 8px 0',
};

const messageBoxTitleStyle: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '13px',
  fontWeight: 600,
  margin: '16px 0 6px 0',
};

const messageBoxStyle: React.CSSProperties = {
  color: '#F4F4F5',
  fontSize: '14px',
  fontStyle: 'italic',
  backgroundColor: '#242424',
  padding: '12px 16px',
  borderRadius: '6px',
  margin: 0,
};

const trustBannerStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center',
};

const trustTitleStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: 700,
  margin: '0 0 4px 0',
};

const trustTextStyle: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '12px',
  margin: 0,
  lineHeight: '18px',
};

const actionSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '8px 0 16px 0',
};

const whatsappButtonStyle: React.CSSProperties = {
  backgroundColor: '#059669', // Emerald WhatsApp
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: 700,
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '12px',
};

const footerTextStyle: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '13px',
  margin: '0 0 4px 0',
};

const footerSubtextStyle: React.CSSProperties = {
  color: '#71717A',
  fontSize: '12px',
  margin: '0 0 4px 0',
};

const linkStyle: React.CSSProperties = {
  color: '#FFFFFF',
  textDecoration: 'underline',
};
