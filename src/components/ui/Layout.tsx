import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/format';

export function Card({ children, className, as: As = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & Record<string, unknown>) {
  return (
    <As className={cn('surface rounded-3xl border border-white/95 bg-white/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(139,107,74,0.06)] text-[#2D2118]', className)} {...rest}>
      {children}
    </As>
  );
}

export function CardHeader({ title, description, action, icon }: { title: ReactNode; description?: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#8B6B4A]/15 bg-white/40 px-6 py-4">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 text-[#0D9488]">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#2D2118]">{title}</h3>
          {description && <p className="mt-0.5 text-[13px] text-[#5E4837] font-medium">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0D9488]">{eyebrow}</div>}
        <h1 className="text-[28px] sm:text-[34px] font-light leading-tight text-[#2D2118]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm font-medium text-[#5E4837]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.header>
  );
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return null;
  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-[#8B6B4A]" aria-label="Pagination">
      <span>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className="rounded-xl p-2 hover:bg-[#93C572]/15 text-[#2D2118] disabled:opacity-30 transition" aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2 font-bold text-[#0D9488]">
          {page} / {pages}
        </span>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} className="rounded-xl p-2 hover:bg-[#93C572]/15 text-[#2D2118] disabled:opacity-30 transition" aria-label="Next page">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { value: T; label: ReactNode; count?: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-[#8B6B4A]/15 [scrollbar-width:none]">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn('relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors', active ? 'text-[#0D9488] font-bold' : 'text-[#5E4837] hover:text-[#2D2118]')}
          >
            <span className="flex items-center gap-1.5">
              {t.label}
              {t.count !== undefined && (
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', active ? 'bg-[#0D9488]/15 text-[#0D9488] border border-[#0D9488]/30' : 'bg-[#F5F0E6] text-[#8B6B4A] border border-[#8B6B4A]/20')}>
                  {t.count}
                </span>
              )}
            </span>
            {active && <motion.span layoutId={`tab-${label}`} className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] shadow-[0_2px_8px_rgba(13,148,136,0.3)]" />}
          </button>
        );
      })}
    </div>
  );
}

export function KeyValue({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-bold uppercase tracking-wider text-[#8B6B4A]">{label}</dt>
      <dd className={cn('mt-0.5 truncate text-sm font-semibold text-[#2D2118]', mono && 'font-mono text-[13px] text-[#0D9488]')}>{children}</dd>
    </div>
  );
}

export function Logo({ className, compact, dark = false }: { className?: string; compact?: boolean; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img src="/logo.png" alt="MediSync" className="size-8 shrink-0 object-contain drop-shadow-sm" />
      {!compact && (
        <span className="font-display text-[18px] tracking-tight">
          <span className={cn('font-bold', dark ? 'text-white' : 'text-[#2D2118]')}>Medi</span>
          <span className="font-extrabold text-[#0D9488] drop-shadow-[0_0_12px_rgba(13,148,136,0.3)]">Sync</span>
        </span>
      )}
    </span>
  );
}
