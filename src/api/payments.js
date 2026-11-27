// Payments (Paypack mobile money) — shared by vote packages and paid tickets.
//
// How a payment works:
//   1. The page asks the backend to start something payable (a vote purchase or a ticket order) and sends
//      the payer's MTN / Airtel number. The backend asks Paypack to send a prompt to that phone.
//   2. The payer approves the prompt on their phone with their mobile-money PIN.
//   3. Paypack tells our backend the result (webhook). The backend credits the votes / issues the tickets.
//   4. Meanwhile this page asks the backend every few seconds "is it paid yet?" (POST /payments/:id/check)
//      and shows the result.
// In test mode (PAYMENT_SIMULATION=true, no Paypack keys) no phone prompt is sent: the page shows
// "Simulate success / failure" buttons instead.
import { useEffect, useState } from 'react';
import { api } from './client';

let cached = null;

// { enabled, mode: 'live' | 'test' | 'off', methods, currency }
export function usePaymentConfig() {
  const [config, setConfig] = useState(cached);
  useEffect(() => {
    if (cached) return;
    api('/payments/config', { auth: false })
      .then((d) => {
        cached = d;
        setConfig(d);
      })
      .catch(() => setConfig({ enabled: false, mode: 'off', methods: [] }));
  }, []);
  return config;
}

// MTN starts with 078/079, Airtel with 072/073. Same rule as the backend.
export function isRwandaMobileMoney(phone) {
  const digits = String(phone).replace(/\D/g, '');
  const local = digits.startsWith('250') ? `0${digits.slice(3)}` : digits;
  return /^07[2389]\d{7}$/.test(local);
}

export const checkPayment = (id) => api(`/payments/${id}/check`, { method: 'POST' }).then((d) => d.payment);
export const simulatePayment = (id, outcome) =>
  api(`/payments/${id}/simulate`, { method: 'POST', body: { outcome } }).then((d) => d.payment);
