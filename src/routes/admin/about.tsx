import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAboutContent } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/about')({
  component: ManageAbout,
});

function ManageAbout() {
  const queryClient = useQueryClient();
  const { data: about, isLoading } = useQuery({ queryKey: ['aboutContent'], queryFn: getAboutContent });
  
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (about) {
      setFormData(about as Record<string, string>);
    }
  }, [about]);

  const updateContentMutation = useMutation({
    mutationFn: async (newContent: Record<string, string>) => {
      const promises = Object.entries(newContent).map(([section, content]) => 
        supabase.from('about_content').update({ content }).eq('section', section)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      toast.success('About page content updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update content: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContentMutation.mutate(formData);
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
        <h1 className="font-display text-3xl font-extrabold text-foreground">About Page Content</h1>
        <p className="mt-2 text-muted-foreground">Manage the text content shown on your About Us page.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold border-b border-border pb-2">Page Header</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <input
                name="hero_title"
                value={formData.hero_title || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <textarea
                name="hero_subtitle"
                value={formData.hero_subtitle || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold border-b border-border pb-2">Our Story</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Paragraph 1</label>
              <textarea
                name="story_p1"
                value={formData.story_p1 || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Paragraph 2</label>
              <textarea
                name="story_p2"
                value={formData.story_p2 || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Paragraph 3</label>
              <textarea
                name="story_p3"
                value={formData.story_p3 || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold border-b border-border pb-2">Our Mission</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mission Statement</label>
              <textarea
                name="mission"
                value={formData.mission || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={updateContentMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              {updateContentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
