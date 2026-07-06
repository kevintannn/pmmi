import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conditional class handling. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency for display in tables/charts. */
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a date as YYYY-MM-DD (locale-independent, safe for SSR hydration). */
export function formatDateISO(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

/**
 * Build a WhatsApp chat link from a phone number. Strips spaces, dashes and the
 * leading "+", e.g. "+62 851 2107 4332" → "https://wa.me/6285121074332".
 */
export function whatsappUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
