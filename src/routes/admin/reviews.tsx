import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Star, Quote, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

type ReviewItem = any; // Will use any for now since it's dynamic from DB

export const Route = createFileRoute('/admin/reviews')({
  component: ManageReviews,
});

function ManageReviews() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase.from('reviews').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review visibility updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    }
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Customer Reviews</h1>
          <p className="mt-2 text-muted-foreground">Manage the testimonials shown on the homepage.</p>
        </div>
        <button 
          onClick={() => {
            setEditingReview(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Review
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews?.map((review) => (
          <div key={review.id} className={`flex flex-col rounded-2xl border bg-card p-6 transition-all ${review.is_active ? 'border-border shadow-sm' : 'border-border/50 opacity-60'}`}>
            <div className="flex-1">
              <Quote className="h-8 w-8 text-brand/30 mb-4" />
              
              <div className="flex gap-1 mb-4 text-brand">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">"{review.text}"</p>
              
              <div>
                <h4 className="font-bold text-foreground">{review.name}</h4>
                <p className="text-sm text-brand">{review.place}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button 
                onClick={() => toggleActiveMutation.mutate({ id: review.id, is_active: !review.is_active })}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {review.is_active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingReview(review);
                    setIsModalOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this review?')) {
                      deleteMutation.mutate(review.id);
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ReviewModal
          review={editingReview}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReview(null);
          }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────  Modal  ───────────────────────────── */

function ReviewModal({
  review,
  onClose,
  onSaved,
}: {
  review: ReviewItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!review;

  const [form, setForm] = useState({
    name: review?.name ?? '',
    place: review?.place ?? '',
    text: review?.text ?? '',
    rating: review?.rating ?? 5,
    sort_order: review?.sort_order ?? 0,
    is_active: review?.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Reviewer name is required');
      return;
    }
    if (!form.text.trim()) {
      toast.error('Review text is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        place: form.place.trim(),
        text: form.text.trim(),
        rating: form.rating,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('reviews')
          .update(payload)
          .eq('id', review.id);
        if (error) throw error;
        toast.success(`Review from "${form.name.trim()}" updated successfully`);
      } else {
        const { error } = await supabase.from('reviews').insert(payload);
        if (error) throw error;
        toast.success(`Review from "${form.name.trim()}" added successfully`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      const message = err?.message || err?.details || err?.hint || 'An unknown error occurred';
      toast.error(`Failed to save review: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {isEdit ? 'Edit Review' : 'Add New Review'}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Reviewer Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Place/Location</label>
                <input
                  value={form.place}
                  onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
                  placeholder="e.g. London, UK"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Review Text *</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="What did the customer say?"
                required
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value) || 5 }))}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 && 's'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-sm font-medium text-foreground">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>

              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className={`flex h-[42px] items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
                  form.is_active
                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                    : 'border-border bg-muted/30 text-muted-foreground'
                }`}
              >
                {form.is_active ? (
                  <><Eye className="h-4 w-4" /> Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" /> Hidden</>
                )}
              </button>
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Add Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
