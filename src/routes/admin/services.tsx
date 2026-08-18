import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Plane, Car, MapPin, Mountain, Trees, Briefcase, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export const Route = createFileRoute('/admin/services')({
  component: ManageServices,
});

// Helper to map icon string to actual Lucide component
const IconMap: Record<string, React.ElementType> = {
  Plane, Car, MapPin, Mountain, Trees, Briefcase, CheckCircle2
};
const AVAILABLE_ICONS = Object.keys(IconMap);

type ServiceItem = any; // We'll just use any for now since it's dynamic from DB

function ManageServices() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase.from('services').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service visibility updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
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
          <h1 className="font-display text-3xl font-extrabold text-foreground">Services</h1>
          <p className="mt-2 text-muted-foreground">Manage the services offered by Bengal Taxi.</p>
        </div>
        <button 
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services?.map((service) => {
          const IconComponent = IconMap[service.icon_name] || CheckCircle2;
          
          return (
            <div key={service.id} className={`flex flex-col rounded-2xl border bg-card p-6 transition-all ${service.is_active ? 'border-border shadow-sm hover:shadow-md' : 'border-border/50 opacity-60'}`}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand relative">
                <IconComponent className="h-5 w-5" />
                {!service.is_active && (
                  <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                    <EyeOff className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold uppercase text-foreground">{service.title}</h3>
                <p className="mt-3 text-muted-foreground">{service.description}</p>
                
                <ul className="mt-4 space-y-2">
                  {service.points?.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <button 
                  onClick={() => toggleActiveMutation.mutate({ id: service.id, is_active: !service.is_active })}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {service.is_active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingService(service);
                      setIsModalOpen(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this service?')) {
                        deleteMutation.mutate(service.id);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────  Modal  ───────────────────────────── */

function ServiceModal({
  service,
  onClose,
  onSaved,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!service;

  const [form, setForm] = useState({
    title: service?.title ?? '',
    description: service?.description ?? '',
    icon_name: service?.icon_name ?? 'CheckCircle2',
    points_raw: (service?.points ?? []).join('\n'),
    sort_order: service?.sort_order ?? 0,
    is_active: service?.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }

    setSaving(true);
    try {
      const pointsArray = form.points_raw
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon_name: form.icon_name,
        points: pointsArray,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', service.id);
        if (error) throw error;
        toast.success(`Service "${form.title.trim()}" updated successfully`);
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
        toast.success(`Service "${form.title.trim()}" added successfully`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      const message = err?.message || err?.details || err?.hint || 'An unknown error occurred';
      toast.error(`Failed to save service: ${message}`);
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
              {isEdit ? 'Edit Service' : 'Add New Service'}
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Airport Transfers"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief summary of the service..."
                required
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Icon *</label>
              <select
                value={form.icon_name}
                onChange={(e) => setForm((f) => ({ ...f, icon_name: e.target.value }))}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              >
                {AVAILABLE_ICONS.map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Points (one per line)</label>
              <textarea
                value={form.points_raw}
                onChange={(e) => setForm((f) => ({ ...f, points_raw: e.target.value }))}
                placeholder={"Pickup from Bagdogra\nDrop to Darjeeling\nZero waiting charge"}
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand font-mono text-xs"
              />
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
                {isEdit ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
