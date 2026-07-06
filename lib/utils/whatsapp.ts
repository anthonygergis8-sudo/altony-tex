export const WHATSAPP_BUSINESS_NUMBER = '201207714446';

export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsApp(message: string): void {
  try {
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open WhatsApp:', error);
  }
}
