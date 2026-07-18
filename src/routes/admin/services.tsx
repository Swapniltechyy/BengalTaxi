import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Plane, Car, MapPin, Mountain, Trees, Briefcase, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/services')({
  component: ManageServices,
});

// Helper to map icon string to actual Lucide component
const IconMap: Record<string, React.ElementType> = {
  Plane, Car, MapPin, Mountain, Trees, Briefcase, CheckCircle2
};

function ManageServices() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });

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
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
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
                  <button className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95">
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
    </div>
  );
}
