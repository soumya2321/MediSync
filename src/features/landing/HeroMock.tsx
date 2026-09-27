import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CalendarClock, Check, CheckCircle2, Inbox, MessageSquareText, PackageCheck, RefreshCcw, Send, Stethoscope, Timer, UserRound } from 'lucide-react';
import { cn } from '@/lib/format';

const STATES = [
  { label: 'Received', icon: Inbox, owner: 'Practice staff', tone: 'bg-[#93C572]/20 text-[#1E4D2B] ring-[#93C572]/50 shadow-[0_2px_10px_rgba(147,197,114,0.25)]' },
  { label: 'Waiting on provider', icon: Stethoscope, owner: 'Dr. Verma', tone: 'bg-[#D8A7B1]/25 text-[#632935] ring-[#D8A7B1]/60 shadow-[0_2px_10px_rgba(216,167,177,0.3)]' },
  { label: 'Approved', icon: CheckCircle2, owner: 'Dr. Verma', tone: 'bg-[#98FF98]/30 text-[#0F5132] ring-[#93C572]/60 shadow-[0_2px_12px_rgba(152,255,152,0.35)]' },
  { label: 'Sent to pharmacy', icon: Send, owner: 'CityCare Pharmacy', tone: 'bg-[#8B6B4A]/15 text-[#543825] ring-[#8B6B4A]/30' },
  { label: 'Pharmacy confirmed', icon: PackageCheck, owner: 'CityCare Pharmacy', tone: 'bg-[#0D9488]/15 text-[#0F5143] ring-[#0D9488]/40 shadow-[0_2px_12px_rgba(13,148,136,0.25)]' },
] as const;

const SMS = ['We got your refill request.', 'Your provider is reviewing it.', 'Approved — sending to your pharmacy.', 'Sent to CityCare Pharmacy.', 'CityCare has your prescription.'];

/** Illustrated product mock (pure HTML/CSS): a case card cycling through its lifecycle. Decorative. */
export function HeroMock() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(reduce ? STATES.length - 1 : 0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % STATES.length), 2200);
    return () => clearInterval(t);
  }, [reduce]);

  const s = STATES[i];
  const resolved = i >= 2;

  return (
    <div className="relative mx-auto w-full max-w-[460px] select-none pb-10 pt-6 sm:pb-14" aria-hidden>
      {/* luminous ambient glow orbs */}
      <div className="absolute -left-12 top-4 size-60 rounded-full bg-[#93C572]/25 blur-3xl pointer-events-none" />
      <div className="absolute -right-8 bottom-0 size-64 rounded-full bg-[#D8A7B1]/30 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 top-1/4 size-44 rounded-full bg-[#98FF98]/25 blur-2xl pointer-events-none" />

      {/* case card */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="cadabra-glass-card relative rounded-3xl p-5 sm:p-6 border border-white/90 shadow-[0_24px_50px_rgba(139,107,74,0.12),0_4px_16px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11.5px] text-[#8B6B4A] flex items-center gap-1.5 font-medium">
              <span className="size-1.5 rounded-full bg-[#93C572] shadow-[0_0_6px_#93C572]" />
              RB-1042 · Portal intake
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[15px] font-semibold text-[#2D2118]">
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-[11px] font-bold text-white shadow-sm border border-white/40">
                ML
              </span>
              M.L. <span className="font-normal text-[#8B6B4A]">·</span>{' '}
              <span className="truncate font-semibold text-[#0D9488]">Metformin 1000 mg</span>
            </p>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={s.label}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset backdrop-blur-md', s.tone)}
            >
              <s.icon className="size-3.5" />
              <span className="hidden min-[400px]:inline">{s.label}</span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* blockers */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ring-1 ring-inset transition-all duration-500 backdrop-blur-sm',
              resolved
                ? 'bg-neutral-100 text-neutral-400 line-through ring-neutral-200'
                : 'bg-[#D8A7B1]/20 text-[#6B2E38] ring-[#D8A7B1]/50 shadow-sm',
            )}
          >
            <RefreshCcw className="size-3" /> No refills remaining <span className="font-mono text-[10px] opacity-75">R6</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#93C572]/15 px-2.5 py-0.5 text-[11.5px] font-medium text-[#1E4D2B] ring-1 ring-inset ring-[#93C572]/40 backdrop-blur-sm">
            <CalendarClock className="size-3 text-[#0D9488]" /> A1c overdue <span className="font-mono text-[10px] opacity-75">R7</span>
          </span>
        </div>

        {/* timeline */}
        <ol className="mt-5 space-y-2.5">
          {STATES.map((st, idx) => {
            const done = idx < i;
            const now = idx === i;
            return (
              <li key={st.label} className="flex items-center gap-3">
                <span className="relative flex size-6 shrink-0 items-center justify-center">
                  {now && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#93C572]/50" />}
                  <span
                    className={cn(
                      'relative flex size-6 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-500',
                      done
                        ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-white shadow-sm border border-white/40'
                        : now
                          ? 'bg-[#0D9488] text-white ring-2 ring-[#98FF98] shadow-md'
                          : 'border border-[#8B6B4A]/25 bg-white/70 text-[#8B6B4A]',
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} /> : idx + 1}
                  </span>
                </span>
                <span
                  className={cn(
                    'flex-1 text-[13px] transition-colors duration-500',
                    done || now ? 'font-semibold text-[#2D2118]' : 'text-[#8B6B4A]',
                  )}
                >
                  {st.label}
                </span>
                {now && (
                  <motion.span
                    layoutId="hero-owner"
                    className="hidden items-center gap-1 rounded-full bg-[#93C572]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#1E4D2B] ring-1 ring-[#93C572]/40 min-[400px]:inline-flex shadow-sm"
                  >
                    <UserRound className="size-3" /> {st.owner}
                  </motion.span>
                )}
              </li>
            );
          })}
        </ol>

        {/* progress */}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F5F0E6] ring-1 ring-[#8B6B4A]/15">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#93C572] via-[#0D9488] to-[#98FF98] shadow-[0_0_10px_rgba(152,255,152,0.6)]"
            animate={{ width: `${((i + 1) / STATES.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* floating SMS bubble */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute -bottom-1 right-0 w-[230px] sm:-right-6 sm:bottom-2"
      >
        <div className="cadabra-glass-card animate-float rounded-2xl rounded-br-md p-3.5 border border-white shadow-[0_16px_36px_rgba(139,107,74,0.14)]">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0D9488]">
            <MessageSquareText className="size-3.5 text-[#0D9488]" /> SMS to patient
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="mt-1 text-[12.5px] leading-snug font-medium text-[#2D2118]"
            >
              {SMS[i]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* floating stat pill */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="absolute -top-1 left-2 sm:-left-8 sm:top-0">
        <div className="cadabra-pill flex animate-float items-center gap-2 py-1.5 pl-1.5 pr-3.5 shadow-[0_12px_28px_rgba(139,107,74,0.1)] border border-white/90 [animation-delay:-3s]">
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#0D9488] to-[#93C572] text-white shadow-sm">
            <Timer className="size-4 text-white" />
          </span>
          <span className="text-[12px] font-medium text-[#2D2118]">
            Resolved in <span className="font-bold text-[#0D9488]">3 h 12 m</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
