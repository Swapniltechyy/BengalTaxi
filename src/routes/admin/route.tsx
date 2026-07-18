import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router';
import { getSession, signOut } from '@/lib/auth';
import {
  ShieldCheck, LogOut, LayoutDashboard, Map, Car, Settings,
  Star, Info, Package, ChevronRight, ExternalLink, Menu, X,
  PanelLeftClose, PanelLeftOpen, Moon, Sun
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    // If we're already on the login page, don't check for session to avoid redirect loop
    if (location.pathname === '/admin/login') return;

    const { session } = await getSession();
    if (!session) {
      throw redirect({
        to: '/admin/login',
      });
    }
  },
  component: AdminLayout,
});

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/site-settings', icon: Settings, label: 'Site Settings' },
  { to: '/admin/routes', icon: Map, label: 'Popular Routes' },
  { to: '/admin/vehicles', icon: Car, label: 'Fleet / Vehicles' },
  { to: '/admin/services', icon: Package, label: 'Services' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/about', icon: Info, label: 'About Page' },
];

function AdminLayout() {
  const router = useRouter();
  const location = router.state.location;
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('admin-sidebar-collapsed') === 'true';
  });

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  // Don't show the dashboard layout on the login page
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logged out successfully');
    router.navigate({ to: '/admin/login' });
  };

  const currentPage = navItems.find((item) =>
    item.exact
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to)
  );

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]';
  const mainMargin = collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]';

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Mobile overlay ──────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarWidth} ${
          mobileOpen ? 'translate-x-0 !w-[260px]' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className={`relative flex h-16 shrink-0 items-end pb-2 border-b border-border ${collapsed && !mobileOpen ? 'justify-center items-center pb-0' : 'justify-between px-4'}`}>
          <div className={`flex flex-col items-start overflow-hidden ${collapsed && !mobileOpen ? 'hidden' : 'flex'}`}>
            <span className="font-display text-xl font-extrabold tracking-tight relative z-0 inline-block leading-none pb-1 mb-2">
              Bengal<span className="text-brand">Taxi</span>
              <svg className="absolute bottom-0 left-0 w-full -z-10" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="underline-fade-admin" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#FACC15" stopOpacity="1" /><stop offset="60%" stopColor="#FACC15" stopOpacity="0.6" /><stop offset="100%" stopColor="#FACC15" stopOpacity="0.1" /></linearGradient></defs><path d="M2 6 L298 6" stroke="url(#underline-fade-admin)" strokeWidth="5" strokeLinecap="round" style={{ strokeDasharray: "none" }}/></svg>
            </span>
            <span className="block whitespace-nowrap text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none">Admin Panel</span>
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex items-center justify-center rounded-md p-1.5 mb-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors ${collapsed && !mobileOpen ? 'm-0' : 'ml-auto'}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>

          <button onClick={() => setMobileOpen(false)} className={`lg:hidden rounded-md p-1 text-muted-foreground hover:text-foreground ${collapsed && !mobileOpen ? 'hidden' : 'ml-auto mb-1.5'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">

          <div className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground ${
                  collapsed && !mobileOpen
                    ? 'justify-center px-0 py-2.5 mx-1'
                    : 'gap-3 px-3 py-2.5'
                }`}
                activeProps={{
                  className:
                    'bg-brand/10 text-brand hover:bg-brand/15 hover:text-brand font-semibold',
                }}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className={`flex-1 whitespace-nowrap transition-all duration-300 ${collapsed && !mobileOpen ? 'w-0 opacity-0 overflow-hidden absolute' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>
                <ChevronRight className={`h-3.5 w-3.5 transition-all ${collapsed && !mobileOpen ? 'hidden' : 'opacity-0 group-hover:opacity-50'}`} />

                {/* Tooltip on hover when collapsed */}
                {collapsed && !mobileOpen && (
                  <span className="pointer-events-none absolute left-full ml-2 z-[60] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="shrink-0 border-t border-border p-2 space-y-1">
          {/* View Live Site */}
          <Link
            to="/"
            className={`group relative flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors ${
              collapsed && !mobileOpen ? 'justify-center px-0 py-2.5 mx-1' : 'gap-3 px-3 py-2'
            }`}
            title={collapsed && !mobileOpen ? 'View Live Site' : undefined}
          >
            <ExternalLink className="h-[18px] w-[18px] shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${collapsed && !mobileOpen ? 'w-0 opacity-0 overflow-hidden absolute' : 'w-auto opacity-100'}`}>
              View Live Site
            </span>
            {collapsed && !mobileOpen && (
              <span className="pointer-events-none absolute left-full ml-2 z-[60] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                View Live Site
              </span>
            )}
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`group relative flex w-full items-center rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${
              collapsed && !mobileOpen ? 'justify-center px-0 py-2.5 mx-1' : 'gap-3 px-3 py-2'
            }`}
            title={collapsed && !mobileOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${collapsed && !mobileOpen ? 'w-0 opacity-0 overflow-hidden absolute' : 'w-auto opacity-100'}`}>
              Sign Out
            </span>
            {collapsed && !mobileOpen && (
              <span className="pointer-events-none absolute left-full ml-2 z-[60] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Sign Out
              </span>
            )}
          </button>


        </div>
      </aside>

      {/* ── Main Content ────────────────────────────── */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${mainMargin}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {currentPage && (
              <div className="flex items-center gap-2">
                <currentPage.icon className="h-4 w-4 text-brand" />
                <h2 className="font-display text-sm font-bold text-foreground">
                  {currentPage.label}
                </h2>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle in top bar (for quick access) */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <div className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-1.5 transition-colors hover:bg-muted/30">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand/70 text-brand-foreground text-xs font-bold shadow-sm">
                A
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
