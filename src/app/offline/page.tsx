import { WifiOff } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

// Served by the service worker when a navigation request fails offline.
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        <WifiOff className="h-8 w-8" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold">You are offline · 您已离线</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          This page isn&apos;t available without an internet connection.
          <br />
          在没有网络连接的情况下无法访问此页面，请重新连接后重试。
        </p>
      </div>
      {/* Hard navigation on purpose: this page is served by the service worker
          when offline, so a full reload re-attempts the network. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Try Again · 重试
      </a>
    </div>
  );
}
