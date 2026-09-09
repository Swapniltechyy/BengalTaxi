import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, updateBookingStatus, deleteBooking, Booking } from '@/lib/api';
import {
  CalendarCheck, Clock, Phone, MapPin, Users,
  CheckCircle2, XCircle, AlertCircle, Trash2, Search,
  RefreshCw, MessageSquare, Loader2, ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/admin/bookings')({
  component: ManageBookings,
});

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

function ManageBookings() {
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await updateBookingStatus(id, status);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(`Booking status updated to ${variables.status}`);
    },
    onError: (err: any) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deleteBooking(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully');
      setSelectedBooking(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete booking: ${err.message}`);
    },
  });

  // Filtered and searched bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'all' || b.status?.toLowerCase() === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        b.name?.toLowerCase().includes(q) ||
        b.phone?.toLowerCase().includes(q) ||
        b.from_location?.toLowerCase().includes(q) ||
        b.to_location?.toLowerCase().includes(q) ||
        b.details?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  // Counts
  const counts = useMemo(() => {
    const res = { all: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const s = (b.status?.toLowerCase() || 'pending') as keyof typeof res;
      if (res[s] !== undefined) res[s]++;
    });
    return res;
  }, [bookings]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500 border border-blue-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20">
            <AlertCircle className="h-3.5 w-3.5" /> Pending
          </span>
        );
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand">
            <CalendarCheck className="h-4 w-4" />
            Customer Bookings
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground">
            Booking Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage incoming ride and tour booking requests submitted via the website.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin text-brand' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Status Count Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { key: 'all', label: 'All Requests', count: counts.all, color: 'text-foreground', bg: 'bg-card' },
          { key: 'pending', label: 'Pending', count: counts.pending, color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/20' },
          { key: 'confirmed', label: 'Confirmed', count: counts.confirmed, color: 'text-blue-500', bg: 'bg-blue-500/5 border-blue-500/20' },
          { key: 'completed', label: 'Completed', count: counts.completed, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/20' },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled, color: 'text-rose-500', bg: 'bg-rose-500/5 border-rose-500/20' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key as StatusFilter)}
            className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
              statusFilter === item.key
                ? 'border-brand ring-2 ring-brand/20 bg-card shadow-sm'
                : 'border-border bg-card hover:border-border/80'
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className={`mt-1 font-display text-2xl font-extrabold ${item.color}`}>
              {item.count}
            </p>
          </button>
        ))}
      </div>

      {/* ── Search Bar ────────────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
        <Search className="h-5 w-5 text-muted-foreground shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Search by customer name, phone number, pickup or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Bookings List ─────────────────────────────────── */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CalendarCheck className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No booking requests found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {search || statusFilter !== 'all'
              ? 'Try changing your search query or status filter.'
              : 'New booking requests submitted on the website will automatically show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const cleanPhone = b.phone?.replace(/\D/g, '') || '';
            const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
            const waCustomerLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Hello ${b.name}, this is Bengal Taxi regarding your booking request from ${b.from_location} to ${b.to_location}.`
            )}`;

            return (
              <div
                key={b.id}
                className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-border/80 hover:shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Customer & Route details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-display text-lg font-bold text-foreground">
                        {b.name}
                      </span>
                      {getStatusBadge(b.status)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(b.created_at)}
                      </span>
                    </div>

                    {/* Route badges */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5 font-medium text-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                        <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-muted-foreground text-xs uppercase font-bold">From:</span>
                        <span>{b.from_location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-medium text-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
                        <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                        <span className="text-muted-foreground text-xs uppercase font-bold">To:</span>
                        <span>{b.to_location}</span>
                      </div>

                      {b.pickup_date && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/20 px-2.5 py-1.5 rounded-lg">
                          <CalendarCheck className="h-3.5 w-3.5 text-brand" />
                          <span>Date: {b.pickup_date}</span>
                        </div>
                      )}

                      {b.pax && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/20 px-2.5 py-1.5 rounded-lg">
                          <Users className="h-3.5 w-3.5 text-blue-400" />
                          <span>{b.pax} Guests</span>
                        </div>
                      )}
                    </div>

                    {/* Details Note */}
                    {b.details && (
                      <div className="rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground border border-border/40">
                        <span className="font-semibold text-foreground">Notes:</span> {b.details}
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end shrink-0 pt-2 lg:pt-0 border-t border-border lg:border-t-0">
                    {/* WhatsApp button */}
                    <a
                      href={waCustomerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/10 px-3.5 py-2 text-xs font-bold text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                      title="Chat with Customer on WhatsApp"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>WhatsApp</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>

                    {/* Direct Call */}
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      title="Call Customer"
                    >
                      <Phone className="h-3.5 w-3.5 text-brand" />
                      <span>{b.phone}</span>
                    </a>

                    {/* Status dropdown */}
                    <div className="flex items-center gap-1">
                      <select
                        value={b.status?.toLowerCase() || 'pending'}
                        onChange={(e) => statusMutation.mutate({ id: b.id, status: e.target.value })}
                        disabled={statusMutation.isPending}
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-brand cursor-pointer"
                      >
                        <option value="pending">Set Pending</option>
                        <option value="confirmed">Set Confirmed</option>
                        <option value="completed">Set Completed</option>
                        <option value="cancelled">Set Cancelled</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete booking request from ${b.name}?`)) {
                            deleteMutation.mutate(b.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
