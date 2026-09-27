import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Bot, Building2, ChevronDown, Cog, User } from 'lucide-react';
import type { CaseEvent } from '@shared/dto.ts';
import { StatusBadge } from '@/components/ui/Badges';
import { EmptyState, ErrorState, SkeletonRows } from '@/components/ui/States';
import { cn, formatDateTime, timeAgo } from '@/lib/format';
import { useCaseEvents } from './hooks';

const ACTOR = {
  user: { icon: <User className="size-3.5" />, ring: 'bg-[#0D9488] text-white shadow-sm', label: 'Person' },
  system: { icon: <Cog className="size-3.5" />, ring: 'bg-white text-[#8B6B4A] border border-[#8B6B4A]/30 shadow-xs', label: 'System' },
  ai: { icon: <Bot className="size-3.5" />, ring: 'bg-gradient-to-br from-[#0D9488] to-[#93C572] text-white shadow-sm', label: 'AI' },
  pharmacy_system: { icon: <Building2 className="size-3.5" />, ring: 'bg-[#8B6B4A] text-white shadow-sm', label: 'Pharmacy system' },
} as const;

export function Timeline({ caseId, showWhy = true }: { caseId: string; showWhy?: boolean }) {
  const q = useCaseEvents(caseId);
  if (q.isLoading) return <SkeletonRows rows={4} />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} title="Couldn't load the timeline" />;
  const events = q.data!.data;
  if (events.length === 0) return <EmptyState icon={<Cog className="size-6 text-[#0D9488]" />} title="No activity yet" description="Events appear here as the case moves." />;
  return (
    <ol className="relative space-y-1" aria-label="Case timeline, newest first">
      <span className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-[#0D9488] via-[#8B6B4A]/30 to-transparent" aria-hidden />
      {events.map((e, i) => (
        <TimelineItem key={e.id} event={e} index={i} showWhy={showWhy} />
      ))}
    </ol>
  );
}

function TimelineItem({ event: e, index, showWhy }: { event: CaseEvent; index: number; showWhy: boolean }) {
  const [open, setOpen] = useState(false);
  const actor = ACTOR[e.actorType];
  const hasWhy = showWhy && (e.reason || e.ruleIds.length > 0 || e.promptVersion);
  return (
    <motion.li initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(index * 0.03, 0.3) }} className="relative flex gap-3 rounded-2xl py-2 pl-0 pr-2">
      <span className={cn('relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-[#F5F0E6]', actor.ring)} title={actor.label} aria-hidden>
        {actor.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-sm font-bold text-[#2D2118]">{e.title}</p>
          <time dateTime={e.createdAt} title={formatDateTime(e.createdAt)} className="shrink-0 text-[12px] font-medium text-[#8B6B4A]">
            {timeAgo(e.createdAt)}
          </time>
        </div>
        <p className="text-[12.5px] font-medium text-[#5E4837]">
          <span className="sr-only">{actor.label}: </span>
          {e.actorName}
        </p>
        {e.fromStatus && e.toStatus && e.fromStatus !== e.toStatus && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={e.fromStatus} />
            <ArrowRight className="size-3.5 text-[#8B6B4A]" aria-label="to" />
            <StatusBadge status={e.toStatus} />
          </div>
        )}
        {hasWhy && (
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[12px] font-bold text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors">
            Why?
            <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
          </button>
        )}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-2 space-y-2 rounded-2xl border border-white/95 bg-white/95 p-3.5 text-[13px] text-[#2D2118] shadow-sm">
                {e.reason && <p className="leading-relaxed font-medium">{e.reason}</p>}
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
                  <dt className="text-[#8B6B4A] font-semibold">Actor</dt>
                  <dd className="text-[#2D2118] font-medium">
                    {actor.label} · {e.actorName}
                  </dd>
                  {e.ruleIds.length > 0 && (
                    <>
                      <dt className="text-[#8B6B4A] font-semibold">Rules</dt>
                      <dd className="flex flex-wrap gap-1">
                        {e.ruleIds.map((r) => (
                          <span key={r} className="rounded-md bg-[#0D9488]/10 border border-[#0D9488]/25 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#0D9488]">
                            {r}
                          </span>
                        ))}
                      </dd>
                    </>
                  )}
                  {e.promptVersion && (
                    <>
                      <dt className="text-[#8B6B4A] font-semibold">Prompt</dt>
                      <dd className="font-mono text-[#0D9488]">{e.promptVersion}</dd>
                    </>
                  )}
                  <dt className="text-[#8B6B4A] font-semibold">Request ID</dt>
                  <dd className="truncate font-mono text-[#5E4837]">{e.requestId}</dd>
                  <dt className="text-[#8B6B4A] font-semibold">Time</dt>
                  <dd className="text-[#5E4837]">{formatDateTime(e.createdAt)}</dd>
                </dl>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}
