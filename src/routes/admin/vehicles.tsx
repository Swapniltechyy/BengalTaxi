import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Users, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/vehicles')({
  component: ManageVehicles,
});

function ManageVehicles() {
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading } = useQuery({ queryKey: ['vehicles'], queryFn: getVehicles });

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
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
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
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles?.map((vehicle) => (
          <div key={vehicle.id} className={`flex flex-col overflow-hidden rounded-2xl border bg-card transition-all ${vehicle.is_active ? 'border-border shadow-sm' : 'border-border/50 opacity-60'}`}>
            <div className="flex aspect-video items-center justify-center bg-muted/30 p-6 relative">
              <img src={vehicle.image_url} alt={vehicle.name} className="h-full w-full object-contain drop-shadow-lg" />
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
                  <button className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this vehicle?')) {
                        deleteMutation.mutate(vehicle.id);
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
