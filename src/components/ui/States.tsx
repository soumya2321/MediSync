import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { ApiError, friendlyMessage } from '@/services';
import { cn } from '@/lib/format';
import { Button } from './Button';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4', className)} aria-hidden />;
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/95 bg-white/80 backdrop-blur-md p-4 shadow-xs">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({ icon, title, description, action, className }: { icon: ReactNode; title: string; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex flex-col items-center rounded-3xl border border-dashed border-[#8B6B4A]/25 bg-white/80 px-6 py-14 text-center backdrop-blur-xl shadow-xs', className)}>
      <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#93C572]/20 to-[#98FF98]/30 text-[#0D9488] shadow-sm border border-[#93C572]/30">
        <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#93C572]/20" aria-hidden />
        <span className="relative text-[#0D9488]">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-[#2D2118]">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm font-medium text-[#5E4837]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({ error, onRetry, title = "Couldn't load this", className }: { error: unknown; onRetry?: () => void; title?: string; className?: string }) {
  const requestId = error instanceof ApiError ? error.requestId : undefined;
  return (
    <div role="alert" className={cn('flex flex-col items-center rounded-3xl border border-rose-200 bg-rose-50/90 px-6 py-12 text-center backdrop-blur-xl shadow-sm', className)}>
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 shadow-xs">
        <AlertCircle className="size-6" aria-hidden />
      </div>
      <h3 className="text-base font-bold text-rose-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm font-medium text-rose-800">{friendlyMessage(error)}</p>
      {requestId && <p className="mt-2 font-mono text-xs text-[#8B6B4A]">Reference: {requestId.slice(0, 8)}</p>}
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry} icon={<RotateCcw className="size-4" />}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={cn('inline-block size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600', className)} role="status" aria-label="Loading" />;
}
