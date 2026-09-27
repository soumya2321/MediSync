import { motion } from 'motion/react';
import { AlarmClock, HelpCircle, Hourglass, RefreshCw, UserRound, Zap } from 'lucide-react';
import { Badge, BlockerChip, SlaBadge } from '@/components/ui/Badges';
import { Skeleton, ErrorState } from '@/components/ui/States';
import { useNow } from '@/lib/hooks';
import { useDiagnosis } from './hooks';

/** "Why is this stuck?" — the explainability panel (§5.8). */
export function DiagnosisPanel({ caseId, compact }: { caseId: string; compact?: boolean }) {
  const q = useDiagnosis(caseId);
  const now = useNow(30_000);
  if (q.isLoading) {
    return (
      <div className="surface space-y-3 p-5" aria-busy>
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} title="Couldn't explain this case" />;
  const d = q.data!;
  const breached = d.slaState === 'breached';
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="diag-title"
      className={`relative overflow-hidden rounded-3xl border bg-white/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(139,107,74,0.08)] ${breached ? 'border-bad-400/60' : 'border-white/95'}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 ${breached ? 'bg-bad-500' : d.slaState === 'at_risk' ? 'bg-warn-500' : 'bg-gradient-to-r from-[#0D9488] to-[#93C572]'}`} aria-hidden />
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5">
        <div>
          <h2 id="diag-title" className="flex items-center gap-2 text-[15px] font-bold text-[#2D2118]">
            <HelpCircle className="size-4 text-[#0D9488]" aria-hidden /> Why is this stuck?
          </h2>
          <p className="mt-1 text-[15px] font-bold text-[#2D2118]">{d.headline}</p>
        </div>
        <SlaBadge state={d.slaState} dueAt={d.dueAt} now={now} />
      </div>
      <dl className="grid gap-3 px-5 pb-5 text-sm">
        <Row icon={<UserRound className="size-4" />} label="Owner">
          {d.ownerLabel}
        </Row>
        <Row icon={<Hourglass className="size-4" />} label="Waiting for">
          {d.waitingFor}
        </Row>
        {!compact && d.blockers.length > 0 && (
          <Row icon={<Zap className="size-4" />} label="Blockers">
            <ul className="mt-1 space-y-2">
              {d.blockers.map((b) => (
                <li key={b.code} className="flex flex-col gap-1">
                  <BlockerChip code={b.code} source={b.source} />
                  <span className="text-[13px] leading-snug text-[#5E4837]">{b.detail}</span>
                </li>
              ))}
            </ul>
          </Row>
        )}
        {d.lastAttempt && (
          <Row icon={<RefreshCw className="size-4" />} label="Last attempt">
            {d.lastAttempt}
          </Row>
        )}
        {d.nextAutomaticAction && (
          <Row icon={<AlarmClock className="size-4" />} label="Next automatic action">
            <span className="inline-flex flex-wrap items-center gap-1.5">
              {d.nextAutomaticAction}
              {breached && <Badge tone="bad">Escalated</Badge>}
            </span>
          </Row>
        )}
      </dl>
    </motion.section>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[20px_1fr] gap-x-2.5">
      <span className="mt-0.5 text-[#0D9488]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11.5px] font-bold uppercase tracking-wide text-[#8B6B4A]">{label}</dt>
        <dd className="mt-0.5 text-[13.5px] font-semibold leading-snug text-[#2D2118]">{children}</dd>
      </div>
    </div>
  );
}
