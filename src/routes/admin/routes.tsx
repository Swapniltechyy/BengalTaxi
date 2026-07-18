import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutes } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/routes')({
  component: ManageRoutes,
});

function ManageRoutes() {
  const queryClient = useQueryClient();
  const { data: routes, isLoading } = useQuery({ queryKey: ['routes'], queryFn: getRoutes });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase.from('routes').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route visibility updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('routes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully');
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Popular Routes</h1>
          <p className="mt-2 text-muted-foreground">Manage the destination cards shown on the homepage.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Add Route
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes?.map((route) => (
          <div key={route.id} className={`overflow-hidden rounded-2xl border bg-card transition-all ${route.is_active ? 'border-border' : 'border-border/50 opacity-60'}`}>
            <div className="aspect-video w-full bg-muted overflow-hidden relative">
              <img src={route.image_url} alt={route.title} className="h-full w-full object-cover" />
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
                  onClick={() => toggleActiveMutation.mutate({ id: route.id, is_active: !route.is_active })}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {route.is_active ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
                </button>
                <div className="flex gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this route?')) {
                        deleteMutation.mutate(route.id);
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
    </div>
  );
}
