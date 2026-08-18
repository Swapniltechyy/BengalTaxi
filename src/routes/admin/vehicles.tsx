import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, X, Upload, ImageIcon, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useRef, useCallback, useEffect } from 'react';

export const Route = createFileRoute('/admin/vehicles')({
  component: ManageVehicles,
});

interface VehicleItem {
  id: string;
  name: string;
  type: string;
  seats: string;
  luggage: string;
  features: string[];
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

interface VehicleFormData {
  name: string;
  type: string;
  seats: string;
  luggage: string;
  features_raw: string; // Comma separated for easy editing
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

function VehicleModal({
  vehicle,
  onClose,
  onSaved,
}: {
  vehicle: VehicleItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!vehicle;

  const [form, setForm] = useState<VehicleFormData>({
    name: vehicle?.name ?? '',
    type: vehicle?.type ?? '',
    seats: vehicle?.seats ?? '',
    luggage: vehicle?.luggage ?? '',
    features_raw: vehicle?.features?.join(', ') ?? '',
    sort_order: vehicle?.sort_order ?? 0,
    is_active: vehicle?.is_active ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(vehicle?.image_url ?? null);
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

    // Validate all required fields
    if (!imagePreview && !vehicle?.image_url) {
      toast.error('Vehicle image is required');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.type.trim()) {
      toast.error('Type is required');
      return;
    }
    if (!form.seats.trim()) {
      toast.error('Seats is required');
      return;
    }
    if (!form.luggage.trim()) {
      toast.error('Luggage is required');
      return;
    }
    if (!form.features_raw.trim()) {
      toast.error('Features is required');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = vehicle?.image_url ?? '';

      // Use the base64 string directly
      if (imageFile && imagePreview) {
        imageUrl = imagePreview;
      }

      if (!imageUrl) {
        toast.error('Vehicle image is required');
        setSaving(false);
        return;
      }

      // Convert comma separated string to array
      const featuresArray = form.features_raw
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const payload = {
        name: form.name.trim(),
        type: form.type.trim(),
        seats: form.seats.trim(),
        luggage: form.luggage.trim(),
        features: featuresArray,
        sort_order: form.sort_order,
        is_active: form.is_active,
        image_url: imageUrl,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('vehicles')
          .update(payload)
          .eq('id', vehicle.id);
        if (error) throw error;
        toast.success(`Vehicle "${form.name.trim()}" updated successfully`);
      } else {
        const { error } = await supabase.from('vehicles').insert(payload);
        if (error) throw error;
        toast.success(`Vehicle "${form.name.trim()}" added successfully`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      const message = err?.message || err?.details || err?.hint || 'An unknown error occurred';
      toast.error(`Failed to save vehicle: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Vehicle Image *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-brand/50 hover:bg-muted/50"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-contain p-4"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-800">
                        <Upload className="h-4 w-4" />
                        Change Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Innova Crysta"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Type *</label>
                <input
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  placeholder="e.g. SUV / MUV"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Seats *</label>
                <input
                  value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                  placeholder="e.g. 6+1 Seats"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Luggage *</label>
                <input
                  value={form.luggage}
                  onChange={(e) => setForm((f) => ({ ...f, luggage: e.target.value }))}
                  placeholder="e.g. 4 Bags"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Features (comma separated) *</label>
              <textarea
                value={form.features_raw}
                onChange={(e) => setForm((f) => ({ ...f, features_raw: e.target.value }))}
                placeholder="AC, Carrier, Bluetooth"
                rows={2}
                required
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
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
            
            <div className="flex shrink-0 justify-end gap-3 pt-5 mt-2">
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
                {isEdit ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────  Main Component  ─────────────────────── */

function ManageVehicles() {
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading } = useQuery({ queryKey: ['vehicles'], queryFn: getVehicles });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);

  const openAddModal = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const openEditModal = (vehicle: VehicleItem) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  };

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase.from('vehicles').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle visibility updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (vehicle: VehicleItem) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle deleted successfully');
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
          <h1 className="font-display text-3xl font-extrabold text-foreground">Fleet / Vehicles</h1>
          <p className="mt-2 text-muted-foreground">Manage the cars available in your fleet.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles?.map((vehicle: VehicleItem) => (
          <div key={vehicle.id} className={`flex flex-col overflow-hidden rounded-2xl border bg-card transition-all ${vehicle.is_active ? 'border-border shadow-sm' : 'border-border/50 opacity-60'}`}>
            <div className="flex aspect-video items-center justify-center bg-muted/30 p-6 relative">
                <ImageWithFallback
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="h-full w-full object-contain drop-shadow-lg"
                />
              {!vehicle.is_active && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm rounded-t-2xl">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <EyeOff className="h-4 w-4" /> Hidden
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold">{vehicle.name}</h3>
                    <p className="text-sm font-medium text-brand">{vehicle.type}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.seats}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{vehicle.luggage}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Features</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {vehicle.features?.slice(0, 2).map((feat: string, i: number) => (
                      <li key={i}>{feat}</li>
                    ))}
                    {vehicle.features?.length > 2 && (
                      <li>+{vehicle.features.length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <button 
                  onClick={() => toggleActiveMutation.mutate({ id: vehicle.id, is_active: !vehicle.is_active })}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {vehicle.is_active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(vehicle)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this vehicle?')) {
                        deleteMutation.mutate(vehicle);
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

      {modalOpen && (
        <VehicleModal vehicle={editingVehicle} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
