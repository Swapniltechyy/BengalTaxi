import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Star, Quote } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/reviews')({
  component: ManageReviews,
});

function ManageReviews() {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });

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
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
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
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground hover:brightness-95">
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
    </div>
  );
}
