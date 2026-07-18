import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSiteSettings } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/site-settings')({
  component: SiteSettings,
});

function SiteSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['siteSettings'], queryFn: getSiteSettings });
  
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings as Record<string, string>);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Record<string, string>) => {
      // Update each setting in the database
      const promises = Object.entries(newSettings).map(([key, value]) => 
        supabase.from('site_settings').update({ value }).eq('key', key)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Site Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage global contact information and basic site details.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <input
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp Number</label>
              <input
                name="whatsapp"
                value={formData.whatsapp || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
            
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <input
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium">Physical Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
            
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium">Phone Href (for tel: links)</label>
              <input
                name="phone_href"
                value={formData.phone_href || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand font-mono text-xs"
              />
            </div>
            
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium">WhatsApp Href (for wa.me/ links)</label>
              <input
                name="whatsapp_href"
                value={formData.whatsapp_href || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {updateSettingsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
