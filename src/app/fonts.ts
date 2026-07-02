import { Inter, Manrope } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
});

/** Combined font CSS variable classes; apply to the <html> element. */
export const fontVariables = `${inter.variable} ${manrope.variable}`;
