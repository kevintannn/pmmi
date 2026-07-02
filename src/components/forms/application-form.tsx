'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { applicationSchema, type ApplicationInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

export function ApplicationForm({
  careerId,
  onDone,
}: {
  careerId?: string;
  onDone?: () => void;
}) {
  const t = useTranslations('Career.form');
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      careerId: careerId ?? '',
      name: '',
      email: '',
      phone: '',
      resumeUrl: '',
      coverLetter: '',
    },
  });

  async function onSubmit(values: ApplicationInput) {
    try {
      let resumeUrl = '';
      const file = fileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!up.ok) throw new Error('upload failed');
        const data = (await up.json()) as { url: string };
        resumeUrl = data.url;
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, careerId: careerId ?? '', resumeUrl }),
      });
      if (!res.ok) throw new Error('submit failed');

      toast.success(t('success'));
      form.reset();
      setFileName('');
      onDone?.();
    } catch {
      toast.error(t('error'));
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone')}</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resume upload (handled outside RHF, sent to /api/upload) */}
        <FormItem>
          <FormLabel>{t('resume')}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                <Upload />
                {fileName || t('resume')}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              />
            </div>
          </FormControl>
          <FormDescription>{t('resumeHint')}</FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('coverLetter')}</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {t('submit')}
        </Button>
      </form>
    </Form>
  );
}
