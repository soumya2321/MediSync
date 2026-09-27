import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Link2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { refillService } from '@/services';
import { ApiError } from '@/services/errors';
import { Skeleton } from '@/components/ui/States';
import { cn } from '@/lib/format';

/** AI-3 provider summary: ≤ 3 bullets, each citing its source records. Plain text only; read-only aid. */
export function AiSummaryCard({ caseId, version, onSourceClick }: { caseId: string; version: number; onSourceClick?: (ref: string) => void }) {
  const q = useQuery({ queryKey: ['ai', 'summary', caseId, version], queryFn: () => refillService.getCaseSummary(caseId), retry: false, staleTime: 5 * 60_000 });
  const [feedback, setFeedback] = useState<'accepted' | 'rejected' | null>(null);
  const vote = (o: 'accepted' | 'rejected') => {
    if (!q.data) return;
    setFeedback(o);
    void refillService.recordAiOutcome(q.data.suggestionId, o);
  };
  return (
    <section aria-labelledby="ai-summary" className="relative overflow-hidden rounded-3xl border border-white/95 bg-white/90 p-5 shadow-[0_16px_40px_rgba(139,107,74,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <h3 id="ai-summary" className="flex items-center gap-2 text-[15px] font-bold text-[#2D2118]">
          <Sparkles className="size-4 text-[#0D9488]" aria-hidden /> Case summary
        </h3>
        <span className="rounded-full bg-[#0D9488]/10 border border-[#0D9488]/25 px-2.5 py-0.5 text-[11px] font-bold text-[#0D9488] shadow-xs">{q.data?.mock ? 'Demo AI (mock)' : 'AI Assist'}</span>
      </div>
      {q.isLoading && (
        <div className="mt-3 space-y-2" aria-busy>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-4/6" />
        </div>
      )}
      {q.isError && (
        <p className="mt-3 text-sm text-[#5E4837]">
          Summary unavailable{q.error instanceof ApiError && q.error.code === 'AI_UNAVAILABLE' ? ' — AI assist is offline' : ''}. Use the records below; nothing is blocked.
        </p>
      )}
      {q.data && (
        <>
          <ul className="mt-3 space-y-2.5">
            {q.data.bullets.map((b, i) => (
              <motion.li key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#2D2118]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0D9488]" aria-hidden />
                <span>
                  {b.text}{' '}
                  {b.sourceRefs.map((s, sIndex) => (
                    <button
                      key={`${s.ref}-${sIndex}`}
                      type="button"
                      onClick={() => onSourceClick?.(s.ref)}
                      className="ml-0.5 inline-flex items-center gap-0.5 rounded-lg bg-[#0D9488]/10 border border-[#0D9488]/25 px-1.5 py-0.5 align-middle text-[11px] font-bold text-[#0D9488] hover:bg-[#0D9488]/20 transition-colors"
                      title={`Source: ${s.ref}`}
                    >
                      <Link2 className="size-3" aria-hidden />
                      {s.label}
                    </button>
                  ))}
                </span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#8B6B4A]/15 pt-3">
            <p className="text-[11.5px] text-[#8B6B4A] font-medium">Suggestion only — decide from the source records. {q.data.promptVersion}</p>
            <div className="flex gap-1" role="group" aria-label="Was this summary helpful?">
              <button type="button" onClick={() => vote('accepted')} aria-pressed={feedback === 'accepted'} className={cn('rounded-lg p-1.5 text-[#8B6B4A] hover:bg-emerald-50 hover:text-emerald-700 transition-colors', feedback === 'accepted' && 'bg-emerald-100 text-emerald-800')} aria-label="Helpful">
                <ThumbsUp className="size-4" />
              </button>
              <button type="button" onClick={() => vote('rejected')} aria-pressed={feedback === 'rejected'} className={cn('rounded-lg p-1.5 text-[#8B6B4A] hover:bg-rose-50 hover:text-rose-700 transition-colors', feedback === 'rejected' && 'bg-rose-100 text-rose-800')} aria-label="Not helpful">
                <ThumbsDown className="size-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
