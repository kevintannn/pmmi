import { useTranslations } from 'next-intl';
import { Linkedin, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { NAV_ITEMS, SOCIAL, COMPANY } from '@/lib/constants';
import { Logo } from '@/components/shared/logo';

export function Footer({
  email,
  phone,
}: {
  email: string;
  phone: string;
}) {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/40">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t('quickLinks')}</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.filter((i) => i.key !== 'home').map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t('contact')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" /> {email}
                </a>
              </li>
              <li>{phone}</li>
              <li className="pt-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  {t('follow')}
                </span>
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-background"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {year} Kevin Tan 陈羽悎 • {t('rights')}
          </p>
          <p>{COMPANY.shortName}</p>
        </div>
      </div>
    </footer>
  );
}
