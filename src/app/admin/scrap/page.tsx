'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { scrapPriceSchema, type ScrapPriceInput } from '@/lib/validations';
import { SCRAP_CATEGORIES, CURRENCIES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

type Row = ScrapPriceInput & { id: string };

const emptyValues: ScrapPriceInput = {
  date: new Date().toISOString().slice(0, 10),
  category: SCRAP_CATEGORIES[0],
  price: 0,
  currency: 'USD',
  notes: '',
};

export default function ScrapAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ScrapPriceInput>({
    resolver: zodResolver(scrapPriceSchema),
    defaultValues: emptyValues,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scrap-prices');
      const data = await res.json();
      setRows(
        data.map((r: Row & { date: string }) => ({
          ...r,
          date: String(r.date).slice(0, 10),
        })),
      );
    } catch {
      toast.error('Failed to load prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    form.reset(emptyValues);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditingId(row.id);
    form.reset({
      date: row.date,
      category: row.category,
      price: Number(row.price),
      currency: row.currency,
      notes: row.notes ?? '',
    });
    setOpen(true);
  }

  async function onSubmit(values: ScrapPriceInput) {
    try {
      const res = await fetch(
        editingId ? `/api/scrap-prices/${editingId}` : '/api/scrap-prices',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Price updated' : 'Price added');
      setOpen(false);
      load();
    } catch {
      toast.error('Save failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this price record?')) return;
    try {
      const res = await fetch(`/api/scrap-prices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Scrap Prices"
        description="Add daily indicative scrap steel prices. Newest first on the public page."
        action={
          <Button onClick={openAdd}>
            <Plus /> Add Price
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border bg-background shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No records yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell>
                    <Badge variant="muted">{r.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(Number(r.price), r.currency)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.currency}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {r.notes || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(r.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Price' : 'Add Price'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input list="scrap-categories" {...field} />
                      </FormControl>
                      <datalist id="scrap-categories">
                        {SCRAP_CATEGORIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
