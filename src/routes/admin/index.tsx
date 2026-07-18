import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getRoutes, getVehicles, getServices, getReviews } from '@/lib/api';
import {
  Map, Car, Package, Star, Loader2, ArrowUpRight,
  TrendingUp, Clock, CheckCircle2, Eye, Plus,
  Settings, ExternalLink, Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

/* ── tiny animated counter ─────────────────────────── */
function AnimatedNumber({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 800;
    const step = (ts: number, startTs?: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTs));
    };
    requestAnimationFrame((t) => step(t));
  }, [target]);
  return <>{value}</>;
}

/* ── greeting based on time of day ─────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── quick-action cards ────────────────────────────── */
const quickActions = [
  { label: 'Add Route', icon: Map, to: '/admin/routes', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Add Vehicle', icon: Car, to: '/admin/vehicles', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { label: 'Add Service', icon: Package, to: '/admin/services', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40' },
  { label: 'Site Settings', icon: Settings, to: '/admin/site-settings', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
];

function AdminDashboard() {
  const { data: routes, isLoading: lr } = useQuery({ queryKey: ['routes'], queryFn: getRoutes });
  const { data: vehicles, isLoading: lv } = useQuery({ queryKey: ['vehicles'], queryFn: getVehicles });
  const { data: services, isLoading: ls } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: reviews, isLoading: lre } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });

  const isLoading = lr || lv || ls || lre;

  const stats = [
    {
      label: 'Popular Routes', value: routes?.length || 0, icon: Map,
      to: '/admin/routes' as const,
      accent: 'from-blue-500/20 to-blue-500/5 dark:from-blue-500/30 dark:to-blue-500/5',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    },
    {
      label: 'Fleet Vehicles', value: vehicles?.length || 0, icon: Car,
      to: '/admin/vehicles' as const,
      accent: 'from-emerald-500/20 to-emerald-500/5 dark:from-emerald-500/30 dark:to-emerald-500/5',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      label: 'Services', value: services?.length || 0, icon: Package,
      to: '/admin/services' as const,
      accent: 'from-violet-500/20 to-violet-500/5 dark:from-violet-500/30 dark:to-violet-500/5',
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-100 dark:bg-violet-900/50',
    },
    {
      label: 'Reviews', value: reviews?.length || 0, icon: Star,
      to: '/admin/reviews' as const,
      accent: 'from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/5',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    },
  ];

  const activeReviews = reviews?.filter((r: any) => r.is_active) || [];
  const hiddenReviews = reviews?.filter((r: any) => !r.is_active) || [];
  const activeVehicles = vehicles?.filter((v: any) => v.is_active) || [];

  return (
    <div className="space-y-8">
      {/* ── Greeting Banner ──────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand/10 via-card to-card p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-brand">
            <Sparkles className="h-4 w-4" />
            Admin Dashboard
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            {getGreeting()}, Admin
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Here's what's happening with Bengal Taxi today. Manage your content, track your fleet, and keep reviews up to date.
          </p>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-0.5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  {isLoading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                      <AnimatedNumber target={stat.value} />
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              <span>Manage</span>
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Two-column: Quick Actions + Content Status ─ */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-bold text-foreground">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`group flex flex-col items-center gap-3 rounded-xl border border-border ${action.bg} p-5 transition-all duration-200 hover:border-border/60 hover:shadow-sm hover:-translate-y-0.5`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-white/10 ${action.color} shadow-sm transition-transform group-hover:scale-110`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Status */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-bold text-foreground">Content Overview</h2>
          </div>

          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status rows */}
              {[
                { label: 'Active vehicles in fleet', value: activeVehicles.length, total: vehicles?.length || 0, icon: Car, color: 'text-emerald-500' },
                { label: 'Published reviews', value: activeReviews.length, total: reviews?.length || 0, icon: Star, color: 'text-amber-500' },
                { label: 'Hidden reviews', value: hiddenReviews.length, total: reviews?.length || 0, icon: Eye, color: 'text-red-400' },
                { label: 'Routes configured', value: routes?.length || 0, total: routes?.length || 0, icon: Map, color: 'text-blue-500' },
                { label: 'Services listed', value: services?.length || 0, total: services?.length || 0, icon: Package, color: 'text-violet-500' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <row.icon className={`h-4 w-4 ${row.color}`} />
                    <span className="text-sm text-foreground">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:w-28">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-700"
                        style={{ width: row.total > 0 ? `${(row.value / row.total) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="min-w-[3ch] text-right text-sm font-bold text-foreground">
                      {row.value}<span className="text-muted-foreground font-normal">/{row.total}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Content Tables ────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent Routes */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-blue-500" />
              <h3 className="font-display font-bold text-foreground">Recent Routes</h3>
            </div>
            <Link to="/admin/routes" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : routes && routes.length > 0 ? (
            <div className="divide-y divide-border">
              {routes.slice(0, 5).map((route: any, i: number) => (
                <div key={route.id || i} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{route.from} → {route.to}</p>
                      {route.distance && (
                        <p className="text-xs text-muted-foreground">{route.distance}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {route.is_active !== false ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Map className="h-8 w-8 opacity-30" />
              <p className="text-sm">No routes yet</p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <h3 className="font-display font-bold text-foreground">Latest Reviews</h3>
            </div>
            <Link to="/admin/reviews" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="divide-y divide-border">
              {reviews.slice(0, 5).map((review: any, i: number) => (
                <div key={review.id || i} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-foreground">
                      {review.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{review.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">"{review.text?.slice(0, 50)}…"</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-brand">
                    {[...Array(review.rating || 5)].map((_: unknown, j: number) => (
                      <Star key={j} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Star className="h-8 w-8 opacity-30" />
              <p className="text-sm">No reviews yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer tip ───────────────────────────────── */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Clock className="h-4 w-4" />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> All changes you make in the admin panel are{' '}
          <span className="font-medium text-brand">instantly reflected</span> on the live website. Use the sidebar to navigate between sections.
        </p>
      </div>
    </div>
  );
}
