'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

type Entry = { id: string; key: string; locale: string; value: string };

export default function ContentAdminPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState({ key: '', locale: 'en', value: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/site-content');
      setEntries(await res.json());
    } catch {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(key: string, locale: string, value: string) {
    const rowKey = `${key}:${locale}`;
    setSavingKey(rowKey);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, locale, value }),
      });
      if (!res.ok) throw new Error();
      toast.success('Saved');
      await load();
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingKey(null);
    }
  }

  function updateLocal(id: string, value: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, value } : e)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Content"
        description="Edit database-backed text (contact info, and any custom keys). Changes appear on the site without a redeploy."
      />

      {/* Add new entry */}
      <div className="rounded-2xl border bg-background p-5 shadow-soft">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Add / overwrite entry
        </h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_2fr_auto]">
          <Input
            placeholder="key (e.g. contact.email)"
            value={draft.key}
            onChange={(e) => setDraft({ ...draft, key: e.target.value })}
          />
          <Input
            placeholder="locale"
            className="sm:w-24"
            value={draft.locale}
            onChange={(e) => setDraft({ ...draft, locale: e.target.value })}
          />
          <Input
            placeholder="value"
            value={draft.value}
            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
          />
          <Button
            onClick={async () => {
              if (!draft.key || !draft.locale) return toast.error('Key and locale required');
              await save(draft.key, draft.locale, draft.value);
              setDraft({ key: '', locale: 'en', value: '' });
            }}
          >
            <Plus /> Save
          </Button>
        </div>
      </div>

      {/* Existing entries */}
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border bg-background p-12 text-center text-muted-foreground shadow-soft">
          No content entries. Run the seed script or add one above.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const rowKey = `${e.key}:${e.locale}`;
            return (
              <div
                key={e.id}
                className="rounded-2xl border bg-background p-4 shadow-soft sm:flex sm:items-start sm:gap-4"
              >
                <div className="mb-2 flex items-center gap-2 sm:mb-0 sm:w-64 sm:shrink-0">
                  <Badge variant="secondary" className="font-mono">
                    {e.locale}
                  </Badge>
                  <code className="text-xs text-muted-foreground">{e.key}</code>
                </div>
                <div className="flex flex-1 items-start gap-2">
                  <Textarea
                    rows={2}
                    value={e.value}
                    onChange={(ev) => updateLocal(e.id, ev.target.value)}
                    className="min-h-0 flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={savingKey === rowKey}
                    onClick={() => save(e.key, e.locale, e.value)}
                  >
                    {savingKey === rowKey ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
