import { fontVariables } from '@/app/fonts';

// Non-localized entry layout for the language selector at "/".
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
