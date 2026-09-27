import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BellRing, FilePlus2, Inbox, Search } from 'lucide-react';
import type { CaseSummary } from '@shared/dto.ts';
import { isTerminal } from '@shared/domain/state-machine.ts';
import { useAuth } from '@/app/auth-context';
import { StatusBadge } from '@/components/ui/Badges';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { PageHeader, Tabs } from '@/components/ui/Layout';
import { EmptyState, ErrorState, SkeletonRows } from '@/components/ui/States';
import { cn, timeAgo } from '@/lib/format';
import { useDebounced } from '@/lib/hooks';
import { useCases } from '@/features/cases/hooks';

type Tab = 'action' | 'progress' | 'closed';
const ACTION_STATES = ['SENT_TO_PHARMACY', 'PHARMACY_CONFIRMED', 'FILLING', 'READY_FOR_PICKUP'];
const needsAction = (r: CaseSummary) => ACTION_STATES.includes(r.status) || /asked you/i.test(r.nextAction);

export default function PharmacyRequestsPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'action';
  const [search, setSearch] = useState('');
  const debounced = useDebounced(search, 300);
  const q = useCases({ status: 'ALL', limit: 100, sort: 'updated', search: debounced || undefined });
  const groups = useMemo(() => {
    const rows = q.data?.data ?? [];
    return {
      action: rows.filter((r) => !isTerminal(r.status) && needsAction(r)),
      progress: rows.filter((r) => !isTerminal(r.status) && !needsAction(r)),
      closed: rows.filter((r) => isTerminal(r.status)),
    };
  }, [q.data]);
  const rows = groups[tab];

  return (
    <div>
      <PageHeader
        eyebrow={user?.orgName}
        title={
          <>
            <span className="font-light">Refill</span> <span className="font-bold">requests</span>
          </>
        }
        description="Requests you've sent to linked practices. You see exactly where each one is — and what you need to do."
        actions={
          <Link to="/pharmacy/requests/new">
            <Button icon={<FilePlus2 className="size-4" />}>New request</Button>
          </Link>
        }
      />
      <div className="surface rounded-3xl border border-white/95 bg-white/90 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-4 pb-2 sm:p-6 sm:pb-3 sm:flex-row sm:items-end sm:justify-between">
          <Tabs<Tab>
            label="Request groups"
            value={tab}
            onChange={(v) => setParams(v === 'action' ? {} : { tab: v }, { replace: true })}
            tabs={[
              { value: 'action', label: 'Needs your action', count: groups.action.length },
              { value: 'progress', label: 'With the practice', count: groups.progress.length },
              { value: 'closed', label: 'Closed', count: groups.closed.length },
            ]}
          />
          <div className="pb-1 sm:w-72">
            <Input label="Search requests" placeholder="Case #, initials or medication" value={search} onChange={(e) => setSearch(e.target.value)} leading={<Search className="size-4" />} />
          </div>
        </div>
        <div className="border-t border-[#8B6B4A]/10 p-4 sm:p-6">
          {q.isLoading ? (
            <SkeletonRows rows={5} />
          ) : q.isError ? (
            <ErrorState error={q.error} onRetry={() => q.refetch()} title="Couldn't load your requests" />
          ) : rows.length === 0 ? (
            tab === 'action' ? (
              <EmptyState icon={<BellRing className="size-6" />} title="Nothing needs you right now" description="Approved prescriptions and practice questions appear here." action={<Link to="/pharmacy/requests/new"><Button variant="secondary">Send a refill request</Button></Link>} />
            ) : (
              <EmptyState icon={<Inbox className="size-6" />} title="No requests here" description={debounced ? 'Try a different search.' : 'Submit your first refill request to a linked practice.'} action={<Link to="/pharmacy/requests/new"><Button>Submit your first refill request</Button></Link>} />
            )
          ) : (
            <ul className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((r, i) => (
                <motion.li key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                  <Link
                    to={`/cases/${r.id}`}
                    className={cn(
                      'group flex h-full flex-col rounded-2xl border bg-white/80 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:bg-white',
                      needsAction(r) && !isTerminal(r.status) ? 'border-[#0D9488]/40 ring-1 ring-[#0D9488]/20' : 'border-[#8B6B4A]/15',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12.5px] font-bold text-[#0D9488]">{r.caseNumber}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-2.5 text-lg font-bold text-[#2D2118]">
                      {r.patientName} <span className="text-sm font-medium text-[#5E4837]">· {r.medication}</span>
                    </p>
                    <p className="mt-1 flex-1 text-[13px] font-medium text-[#4A3B32]">{r.nextAction}</p>
                    <div className="mt-4 flex items-center justify-between text-[12px] font-medium text-[#8B6B4A]">
                      <span>
                        {r.practiceName} · {timeAgo(r.updatedAt)}
                      </span>
                      <ArrowRight className="size-4 text-[#0D9488] transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
