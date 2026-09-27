import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, FileLock2, ShieldCheck, Users } from 'lucide-react';
import { Logo } from '@/components/ui/Layout';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'MFA on every clinical decision', text: 'Providers confirm the exact order before it is sent.' },
  { icon: FileLock2, title: 'Append-only audit trail', text: 'Every change is recorded with who, what and when.' },
  { icon: Users, title: 'Minimum-necessary sharing', text: 'Pharmacies see only what they need to fill.' },
];

interface AuthLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  /** Rendered under the form card (e.g. demo accounts). */
  below?: ReactNode;
  footer?: ReactNode;
}

/** Split-screen auth shell: brand panel (desktop) + form card. Mobile shows only the form with the logo on top. */
export function AuthLayout({ title, description, eyebrow, children, below, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] bg-[#F5F0E6] text-[#2D2118]">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0F5143] via-[#115E59] to-[#0D9488] border-r border-[#98FF98]/25 text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-[#98FF98]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-[360px] rounded-full bg-[#93C572]/20 blur-3xl" aria-hidden />

        <Link to="/" className="relative w-fit rounded-lg">
          <Logo dark={true} />
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative max-w-md">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#98FF98]">Refill coordination</p>
          <blockquote className="mt-4 font-display text-[34px] leading-[1.15] tracking-tight text-white xl:text-[40px]">
            <span className="font-light text-white/90">One shared case.</span>{' '}
            <span className="font-bold text-white drop-shadow-[0_0_20px_rgba(152,255,152,0.4)]">
              One owner.
            </span>{' '}
            <span className="font-light text-white/90">One next step.</span>
          </blockquote>
          <p className="mt-4 text-[15px] leading-relaxed text-white/80 font-medium">The practice, the pharmacy and the patient finally look at the same thing — and nobody has to chase.</p>
        </motion.div>

        <ul className="relative space-y-4">
          {TRUST_POINTS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.45 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-[#98FF98] shadow-sm">
                <p.icon className="size-[18px] text-[#98FF98]" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{p.title}</span>
                <span className="block text-[13px] text-white/75">{p.text}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </aside>

      {/* Main form panel */}
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#F5F0E6] px-4 py-6 sm:px-8 lg:py-10 text-[#2D2118]">
        {/* Soft botanical ambient lighting */}
        <div className="pointer-events-none absolute -right-20 top-20 size-[500px] rounded-full bg-[#98FF98]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-20 bottom-10 size-[450px] rounded-full bg-[#D8A7B1]/20 blur-3xl" aria-hidden />

        <div className="relative flex items-center justify-between gap-4">
          <Link to="/" className="rounded-lg lg:hidden">
            <Logo dark={false} />
          </Link>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-bold text-[#0D9488] bg-white/80 border border-[#8B6B4A]/20 transition-colors hover:bg-white shadow-xs">
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to home
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="cadabra-glass-card rounded-3xl p-6 border border-white/95 shadow-[0_20px_50px_rgba(139,107,74,0.08)] sm:p-8 bg-white/90 text-[#2D2118]">
            {eyebrow && <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0D9488]">{eyebrow}</p>}
            <h1 className="mt-1.5 text-[26px] leading-tight font-display font-extrabold text-[#2D2118] sm:text-[28px]">{title}</h1>
            {description && <p className="mt-2 text-sm leading-relaxed text-[#5E4837]">{description}</p>}
            <div className="mt-6">{children}</div>
          </motion.div>
          {footer && <div className="mt-5 text-center text-sm font-semibold text-[#8B6B4A]">{footer}</div>}
          {below && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }} className="mt-6">
              {below}
            </motion.div>
          )}
        </div>
        <p className="relative text-center text-[12px] text-[#8B6B4A]">Synthetic demo data only. Not for clinical use.</p>
      </main>
    </div>
  );
}
