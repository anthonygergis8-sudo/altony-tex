import type { Language } from '@/lib/i18n/dictionaries';

const GOOGLE_SHEETS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
  process.env.VITE_GOOGLE_SHEETS_URL ||
  '';

export interface SheetsPayload {
  type: 'signup' | 'price_request';
  timestamp: string;
  username: string;
  companyName: string;
  phone: string;
  email: string;
  productName: string;
  variationValue: string;
  requestedManufacturer: string;
  language: Language;
}

export interface SignupInput {
  username: string;
  email: string;
  phone: string;
  companyName: string;
  language: Language;
}

export interface PriceRequestInput {
  username: string;
  phone: string;
  companyName: string;
  productName: string;
  variationValue: string;
  requestedManufacturer: string;
  language: Language;
}

function buildPayload(
  type: 'signup' | 'price_request',
  data: Partial<SignupInput & PriceRequestInput>,
): SheetsPayload {
  return {
    type,
    timestamp: new Date().toISOString(),
    username: data.username || '',
    companyName: data.companyName || '',
    phone: data.phone || '',
    email: data.email || '',
    productName: data.productName || '',
    variationValue: data.variationValue || '',
    requestedManufacturer: data.requestedManufacturer || '',
    language: data.language || 'en',
  };
}

async function sendToSheets(payload: SheetsPayload): Promise<{ ok: boolean; message: string }> {
  if (!GOOGLE_SHEETS_URL) {
    const msg = 'Google Sheets URL is not configured in .env';
    console.warn(msg);
    return { ok: false, message: msg };
  }

  try {
    const res = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!res.ok && res.status !== 0) {
      const msg = `Google Sheets responded with status ${res.status}`;
      console.error(msg, payload);
      return { ok: false, message: msg };
    }

    return { ok: true, message: 'Data saved to Google Sheets successfully!' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Failed to send data to Google Sheets:', msg, payload);
    return { ok: false, message: `Google Sheets error: ${msg}` };
  }
}

export const GoogleSheetsService = {
  sendSignup: (data: SignupInput) =>
    sendToSheets(buildPayload('signup', data)),

  sendPriceRequest: (data: PriceRequestInput) =>
    sendToSheets(buildPayload('price_request', data)),
};
