'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Briefcase, MapPin, Building2 } from 'lucide-react';
import type { CareerDTO } from '@/lib/data/careers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ApplicationForm } from '@/components/forms/application-form';
import { Stagger, StaggerItem } from '@/components/shared/motion';

export function CareerOpenings({ careers }: { careers: CareerDTO[] }) {
  const t = useTranslations('Career');
  const [active, setActive] = useState<CareerDTO | null>(null);
  const [generalOpen, setGeneralOpen] = useState(false);

  return (
    <>
      {careers.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground shadow-soft">
          {t('noOpenings')}
        </div>
      ) : (
        <Stagger className="grid gap-6 md:grid-cols-2">
          {careers.map((c) => (
            <StaggerItem key={c.id}>
              <Card className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold leading-snug">{c.position}</h3>
                    <Badge variant="accent">
                      {t(`employmentType.${c.employmentType}`)}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {c.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {c.location}
                    </span>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <Button className="mt-6 self-start" onClick={() => setActive(c)}>
                    {t('applyTitle')}
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <div className="mt-10 text-center">
        <Button variant="outline" onClick={() => setGeneralOpen(true)}>
          <Briefcase />
          {t('applyGeneral')}
        </Button>
      </div>

      {/* Position-specific application dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.position}</DialogTitle>
            <DialogDescription>
              {active ? `${active.department} · ${active.location}` : ''}
            </DialogDescription>
          </DialogHeader>
          {active && (
            <ApplicationForm careerId={active.id} onDone={() => setActive(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* General application dialog */}
      <Dialog open={generalOpen} onOpenChange={setGeneralOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('applyGeneral')}</DialogTitle>
            <DialogDescription>{t('bannerBody')}</DialogDescription>
          </DialogHeader>
          <ApplicationForm onDone={() => setGeneralOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
