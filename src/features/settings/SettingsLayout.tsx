import type { ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, ClipboardCheck, ScrollText, SlidersHorizontal, UserRound, Users } from 'lucide-react';
import { can } from '@shared/domain/permissions.ts';
import type { Role } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { PageHeader } from '@/components/ui/Layout';
import { cn } from '@/lib/format';

interface SettingsTab {
  to: string;
  label: string;
  icon: ReactNode;
}

const I = 'size-4';

export function settingsTabsFor(role: Role): SettingsTab[] {
  const tabs: SettingsTab[] = [{ to: '/settings/profile', label: 'Profile', icon: <UserRound className={I} aria-hidden /> }];
  if (can(role, 'team.manage')) {
    tabs.push({ to: '/settings/team', label: 'Team', icon: <Users className={I} aria-hidden /> });
    tabs.push({
      to: '/settings/pharmacies',
      label: role === 'pharmacy_admin' ? 'Practices' : 'Pharmacies',
      icon: <Building2 className={I} aria-hidden />,
    });
  }
  if (can(role, 'policies.edit')) tabs.push({ to: '/settings/policies', label: 'Policies', icon: <SlidersHorizontal className={I} aria-hidden /> });
  if (can(role, 'audit.view')) tabs.push({ to: '/settings/audit', label: 'Audit log', icon: <ScrollText className={I} aria-hidden /> });
  return tabs;
}

export default function SettingsLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (pathname.replace(/\/+$/, '') === '/settings') return <Navigate to="/settings/profile" replace />;
  if (!user) return null;
  const tabs = settingsTabsFor(user.role);

  return (
    <div>
      <PageHeader
        eyebrow={user.orgName}
        title={
          <>
            <span className="font-bold">Settings</span>
          </>
        }
        description="Your account, your organisation and how MediSync behaves for your team."
      />
      <nav aria-label="Settings" className="-mx-4 mb-8 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div className="inline-flex rounded-2xl bg-white/80 p-1.5 border border-white/90 backdrop-blur-md shadow-xs gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                  isActive ? 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-xs' : 'text-[#5E4837] hover:bg-white/90 hover:text-[#0D9488]',
                )
              }
            >
              {t.icon}
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="min-w-0">
        <Outlet />
      </div>
      {can(user.role, 'audit.view') && (
        <p className="mt-10 flex items-center gap-1.5 text-[12px] text-ink-400">
        <ClipboardCheck className="size-3.5" aria-hidden /> Changes to team, links and policies are recorded in the audit log.
        </p>
      )}
    </div>
  );
}
