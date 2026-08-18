import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutes } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useRef, useCallback, useEffect } from 'react';

export const Route = createFileRoute('/admin/routes')({
  component: ManageRoutes,
});

interface RouteItem {
  id: string;
  title: string;
  note: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

interface RouteFormData {
  title: string;
  note: string;
  sort_order: number;
  is_active: boolean;
}

// Removed Supabase Storage logic since we are storing images as base64 strings in the DB directly

/* ─────────────────────────────  Image Component  ───────────────────────────── */

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span className="mt-2 text-xs font-medium">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

/* ─────────────────────────────  Modal  ───────────────────────────── */

function RouteModal({
  route,
  onClose,
  onSaved,
}: {
  route: RouteItem | null; // null = add mode
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!route;

  const [form, setForm] = useState<RouteFormData>({
    title: route?.title ?? '',
    note: route?.note ?? '',
    sort_order: route?.sort_order ?? 0,
    is_active: route?.is_active ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(route?.image_url ?? null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      toast.success('Image successfully loaded for preview');
    };
    reader.onerror = () => {
      toast.error('Failed to read the selected image');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.note.trim()) {
      toast.error('Note / Subtitle is required');
      return;
    }
    if (!imagePreview && !route?.image_url) {
      toast.error('Route image is required');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = route?.image_url ?? '';

      // Use the base64 string directly
      if (imageFile && imagePreview) {
        imageUrl = imagePreview;
      }

      if (!imageUrl) {
        toast.error('Route image is required');
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        note: form.note.trim(),
        sort_order: form.sort_order,
        is_active: form.is_active,
        image_url: imageUrl,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('routes')
          .update(payload)
          .eq('id', route.id);
        if (error) throw error;
        toast.success(`Route "${form.title.trim()}" updated successfully`);
      } else {
        const { error } = await supabase.from('routes').insert(payload);
        if (error) throw error;
        toast.success(`Route "${form.title.trim()}" added successfully`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      const message = err?.message || err?.details || err?.hint || 'An unknown error occurred';
      toast.error(`Failed to save route: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {isEdit ? 'Edit Route' : 'Add New Route'}
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
            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Route Image *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-brand/50 hover:bg-muted/50"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-800">
                        <Upload className="h-4 w-4" />
                        Change Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs">PNG, JPG, WebP — max 5 MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Route Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Siliguri → Darjeeling"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Note / Subtitle *</label>
              <input
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="e.g. Queen of the Hills"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            {/* Sort Order + Active toggle */}
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

            {/* Actions */}
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
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Add Route'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────  Main Component  ─────────────────────── */

function ManageRoutes() {
  const queryClient = useQueryClient();
  const { data: routes, isLoading } = useQuery({ queryKey: ['routes'], queryFn: getRoutes });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);

  const openAddModal = () => {
    setEditingRoute(null);
    setModalOpen(true);
  };

  const openEditModal = (route: RouteItem) => {
    setEditingRoute(route);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRoute(null);
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['routes'] });
  };

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('routes').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route visibility updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (route: RouteItem) => {
      const { error } = await supabase.from('routes').delete().eq('id', route.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Popular Routes</h1>
          <p className="mt-2 text-muted-foreground">
            Manage the destination cards shown on the homepage.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Add Route
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes?.map((route: RouteItem) => (
          <div
            key={route.id}
            className={`overflow-hidden rounded-2xl border bg-card transition-all ${
              route.is_active ? 'border-border' : 'border-border/50 opacity-60'
            }`}
          >
            <div className="aspect-video w-full bg-muted overflow-hidden relative">
                <ImageWithFallback
                  src={route.image_url}
                  alt={route.title}
                  className="h-full w-full object-cover"
                />
              {!route.is_active && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <EyeOff className="h-4 w-4" /> Hidden
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold">{route.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{route.note}</p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <button
                  onClick={() =>
                    toggleActiveMutation.mutate({
                      id: route.id,
                      is_active: !route.is_active,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {route.is_active ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Show
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(route)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this route?')) {
                        deleteMutation.mutate(route);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <RouteModal route={editingRoute} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
