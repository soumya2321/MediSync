import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Activity, BarChart3, Bot, Building2, Clock3, Hand, MessageSquareMore, Send, Target, TimerOff } from 'lucide-react';
import type { AnalyticsSummary, DateRange } from '@shared/dto.ts';
import { STATUS_LABELS } from '@shared/domain/diagnosis.ts';
import { isPracticeRole } from '@shared/domain/permissions.ts';
import { useAuth } from '@/app/auth-context';
import { refillService } from '@/services';
import { BLOCKER_LABELS, StatusBadge } from '@/components/ui/Badges';
import { Select } from '@/components/ui/Field';
import { Card, CardHeader, PageHeader } from '@/components/ui/Layout';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { cn } from '@/lib/format';
import { HBarChart, WeeklyColumnChart, fadeUp } from './charts';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const RANGES = [
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
] as const;
type RangeDays = (typeof RANGES)[number]['days'];

export function rangeFor(days: number, now: number = Date.now()): DateRange {
  return { from: new Date(now - days * 86_400_000).toISOString(), to: new Date(now).toISOString() };
}

const linkBtn = 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-input)] px-4 text-sm font-medium transition-all duration-200 hover:-translate-y-px';
const linkPrimary = cn(linkBtn, 'bg-brand-700 text-white shadow-[0_6px_16px_-6px_rgb(27_77_91/0.6)] hover:bg-brand-800');
const linkSecondary = cn(linkBtn, 'border border-line-strong bg-white text-ink-900 hover:border-brand-300 hover:bg-brand-50');

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [days, setDays] = useState<RangeDays>(30);
  const range = useMemo(() => rangeFor(days), [days]);
  const query = useQuery({
    queryKey: ['analytics', range],
    queryFn: () => refillService.getAnalyticsSummary(range),
    placeholderData: keepPreviousData,
  });

  const practice = user ? isPracticeRole(user.role) : true;
  const data = query.data;
  const isEmpty = data !== undefined && data.openCases + data.resolvedCases === 0;
  const refetching = query.isFetching && query.isPlaceholderData;

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title={
          <>
            Refill <span className="font-bold">performance</span>
          </>
        }
        description={
          practice
            ? 'How quickly stuck refills move from pharmacy request to pharmacy-confirmed — across your whole practice.'
            : `Requests you submitted to linked practices from ${user?.orgName ?? 'your pharmacy'}, and how fast they came back.`
        }
        actions={
          <div className="w-44">
            <Select label="Date range" hideLabel value={days} onChange={(e) => setDays(Number(e.target.value) as RangeDays)}>
              {RANGES.map((r) => (
                <option key={r.days} value={r.days}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      {query.isPending ? (
        <AnalyticsSkeleton />
      ) : query.isError ? (
        <ErrorState title="Couldn't load analytics" error={query.error} onRetry={() => void query.refetch()} />
      ) : isEmpty || !data ? (
        <AnalyticsEmpty role={user?.role} />
      ) : (
        <div className={cn('space-y-5 transition-opacity', refetching && 'opacity-60')} aria-busy={refetching || undefined}>
          <NorthStar pct={data.northStarPct} practice={practice} />
          <KpiTiles data={data} practice={practice} />

          <div className="grid gap-5 xl:grid-cols-5">
            <motion.div {...fadeUp(4)} className="surface min-w-0 xl:col-span-3 rounded-3xl border border-white/95 bg-white/90 backdrop-blur-xl shadow-sm overflow-hidden">
              <WeeklyColumnChart
                data={data.weekly}
                title="Resolved per week"
                description="Cases resolved each week, and how many of those were pharmacy-confirmed within 48 business hours."
                footnote="Earlier weeks come from the nightly metrics rollup; this week is live."
              />
            </motion.div>
            <motion.div {...fadeUp(5)} className="surface min-w-0 xl:col-span-2 rounded-3xl border border-white/95 bg-white/90 backdrop-blur-xl shadow-sm overflow-hidden">
              <HBarChart
                title="Top blockers"
                description={practice ? 'What stops refills most often.' : 'Why your requests needed more work.'}
                rows={data.topBlockers.map((b) => ({ key: b.code, label: BLOCKER_LABELS[b.code], text: BLOCKER_LABELS[b.code], value: b.count }))}
                footnote={data.topBlockers.length === 0 ? 'No blockers raised in this period.' : 'A case can carry more than one blocker.'}
              />
            </motion.div>
          </div>

          <div className="grid gap-5 xl:grid-cols-5">
            <motion.div {...fadeUp(6)} className="surface min-w-0 xl:col-span-2 rounded-3xl border border-white/95 bg-white/90 backdrop-blur-xl shadow-sm overflow-hidden">
              <HBarChart
                title="Cases by status"
                description="Where every case sits right now."
                rows={data.casesByStatus.map((s) => ({ key: s.status, label: <StatusBadge status={s.status} />, text: STATUS_LABELS[s.status], value: s.count }))}
              />
            </motion.div>
            <motion.div {...fadeUp(7)} className="min-w-0 xl:col-span-3">
              <ByPharmacy rows={data.byPharmacy} practice={practice} />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ North Star

function NorthStar({ pct, practice }: { pct: number; practice: boolean }) {
  return (
    <motion.section {...fadeUp(0)} aria-labelledby="north-star-label" className="cadabra-glass-card relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.08)]">
      <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#98FF98]/20 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <div className="shrink-0">
          <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0D9488]">
            <Target className="size-3.5" aria-hidden /> North Star
          </p>
          <p className="mt-1 font-sans text-[56px] font-extrabold leading-none text-[#2D2118] sm:text-[64px]">
            <AnimatedCounter value={pct} />
            <span className="ml-0.5 text-[28px] font-bold text-[#0D9488]">%</span>
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="north-star-label" className="text-lg font-bold leading-snug text-[#2D2118]">
            of stuck refills resolved (pharmacy-confirmed) within 48 business hours
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-[#5E4837]">
            A refill is <em>stuck</em> when something blocks it — no refills left, a visit or lab due, missing information, or insurance. It counts as resolved only when the pharmacy confirms
            receipt, not when {practice ? 'your team' : 'the practice'} clicks approve.
          </p>
          <div className="mt-4 h-2.5 w-full max-w-xl overflow-hidden rounded-full bg-[#F5F0E6] border border-[#8B6B4A]/15" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Stuck refills resolved within 48 business hours">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ------------------------------------------------------------------ KPI tiles

interface Tile {
  label: string;
  value: ReactNode;
  unit?: string;
  hint: string;
  icon: ReactNode;
}

function Value({ n, unit }: { n: number | string; unit?: string }) {
  const num = typeof n === 'number' ? n : Number(n);
  return (
    <span className="inline-flex items-baseline gap-1">
      {Number.isFinite(num) ? (
        <AnimatedCounter value={num} className="text-[28px] font-extrabold leading-none text-[#2D2118]" />
      ) : (
        <span className="text-[28px] font-extrabold leading-none text-[#2D2118]">{n}</span>
      )}
      {unit && <span className="text-sm font-semibold text-[#8B6B4A]">{unit}</span>}
    </span>
  );
}

function KpiTiles({ data, practice }: { data: AnalyticsSummary; practice: boolean }) {
  const ic = 'size-4';
  const total = data.openCases + data.resolvedCases;
  const tiles: Tile[] = [
    { label: 'Median time to pharmacy confirmation', value: <Value n={data.medianHoursToConfirm} unit="h" />, hint: 'From request received to pharmacy confirmed. Lower is better.', icon: <Clock3 className={ic} /> },
    { label: 'Touches per refill', value: <Value n={data.touchesPerRefill} unit="touches" />, hint: 'Manual actions by people per case. Lower is better.', icon: <Hand className={ic} /> },
    { label: 'Info-request round trips', value: <Value n={data.infoRoundTrips} unit="per case" />, hint: 'Questions sent back for missing details. Lower is better.', icon: <MessageSquareMore className={ic} /> },
    { label: 'SLA breach rate', value: <Value n={data.slaBreachRate} unit="%" />, hint: 'Cases escalated for missing a response deadline. Lower is better.', icon: <TimerOff className={ic} /> },
    { label: 'AI suggestion acceptance', value: <Value n={data.aiAcceptanceRate} unit="%" />, hint: 'Suggestions staff accepted as-is. AI never changes rules.', icon: <Bot className={ic} /> },
    {
      label: 'Open vs resolved',
      value: (
        <span className="flex items-baseline gap-3">
          <Value n={data.openCases} unit="open" />
          <span className="text-[#8B6B4A]" aria-hidden>
            /
          </span>
          <Value n={data.resolvedCases} unit="resolved" />
        </span>
      ),
      hint: practice ? `${total} cases in this period.` : `${total} requests in this period.`,
      icon: <Activity className={ic} />,
    },
  ];
  return (
    <ul aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tiles.map((t, i) => (
        <motion.li key={t.label} {...fadeUp(i + 1)} className="cadabra-glass-card flex flex-col gap-3 p-5 rounded-3xl border border-white/90 shadow-[0_12px_28px_rgba(139,107,74,0.06)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(139,107,74,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[13px] font-bold text-[#5E4837]">{t.label}</p>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#93C572]/20 text-[#0D9488]" aria-hidden>
              {t.icon}
            </span>
          </div>
          <div>{t.value}</div>
          <p className="text-[12px] font-medium text-[#8B6B4A]">{t.hint}</p>
        </motion.li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------------ By pharmacy

function ByPharmacy({ rows, practice }: { rows: AnalyticsSummary['byPharmacy']; practice: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader
        icon={<Building2 className="size-4" aria-hidden />}
        title={practice ? 'By pharmacy' : 'Your pharmacy'}
        description="Cases and median hours from sending to the pharmacy until they acknowledged it."
      />
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-ink-500">No pharmacy activity in this period.</p>
      ) : (
        <>
          <table className="hidden w-full text-sm sm:table">
            <caption className="sr-only">Cases and median hours to acknowledge, by pharmacy</caption>
            <thead>
              <tr className="border-b border-[#8B6B4A]/15 bg-white/40 text-left text-[12px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                <th scope="col" className="px-6 py-3">
                  Pharmacy
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Cases
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Median to acknowledge
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-[#8B6B4A]/10 last:border-0 hover:bg-white/80 transition-colors">
                  <th scope="row" className="px-6 py-3.5 text-left font-bold text-[#2D2118]">
                    {r.name}
                  </th>
                  <td className="px-6 py-3.5 text-right tabular-nums font-semibold text-[#5E4837]">{r.cases}</td>
                  <td className="px-6 py-3.5 text-right tabular-nums font-semibold text-[#5E4837]">{r.medianAckHours ? `${r.medianAckHours} h` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-[#8B6B4A]/10 sm:hidden">
            {rows.map((r) => (
              <li key={r.name} className="px-5 py-3.5">
                <p className="font-bold text-[#2D2118]">{r.name}</p>
                <dl className="mt-1 flex gap-6 text-[13px]">
                  <div>
                    <dt className="text-[#8B6B4A]">Cases</dt>
                    <dd className="font-bold tabular-nums text-[#2D2118]">{r.cases}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8B6B4A]">Median to acknowledge</dt>
                    <dd className="font-bold tabular-nums text-[#2D2118]">{r.medianAckHours ? `${r.medianAckHours} h` : '—'}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

// ------------------------------------------------------------------ States

function AnalyticsEmpty({ role }: { role: string | undefined }) {
  let description = 'Numbers appear here once refill requests start flowing through MediSync.';
  let actions: ReactNode = null;
  if (role === 'pharmacy_admin') {
    description = 'Once you send refill requests to a linked practice, you will see how quickly they come back.';
    actions = (
      <Link to="/pharmacy/requests/new" className={linkPrimary}>
        <Send className="size-4" aria-hidden /> Submit your first refill request
      </Link>
    );
  } else if (role === 'practice_admin') {
    description = 'Invite the pharmacies you work with. Their refill requests — and these numbers — start flowing once they accept.';
    actions = (
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link to="/settings/pharmacies" className={linkPrimary}>
          <Building2 className="size-4" aria-hidden /> Invite your pharmacy
        </Link>
        <Link to="/cases/new" className={linkSecondary}>
          Log a phone request
        </Link>
      </div>
    );
  } else if (role === 'provider') {
    actions = (
      <Link to="/provider/inbox" className={linkSecondary}>
        Open your inbox
      </Link>
    );
  }
  return <EmptyState icon={<BarChart3 className="size-6" aria-hidden />} title="No data yet" description={description} action={actions} />;
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading analytics">
      <div className="surface flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Skeleton className="h-16 w-32" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3.5 w-full max-w-lg" />
          <Skeleton className="h-2 w-full max-w-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface space-y-3 p-4">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="surface p-5 xl:col-span-3">
          <Skeleton className="mb-4 h-4 w-40" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="surface space-y-3 p-5 xl:col-span-2">
          <Skeleton className="mb-2 h-4 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
