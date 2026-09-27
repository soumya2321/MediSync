import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'success' | 'glow' | 'glass';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white font-semibold shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_24px_rgba(13,148,136,0.4)] hover:scale-[1.03] active:scale-[0.98]',
  secondary:
    'border border-[#8B6B4A]/20 bg-white/90 backdrop-blur-md text-[#2D2118] font-semibold hover:border-[#0D9488]/40 hover:bg-white hover:scale-[1.03] shadow-xs active:scale-[0.98]',
  ghost:
    'text-[#5E4837] font-semibold hover:bg-white/80 hover:text-[#0D9488] hover:scale-[1.03] active:scale-[0.98]',
  subtle:
    'bg-[#93C572]/20 text-[#0F5143] font-semibold hover:bg-[#93C572]/30 hover:scale-[1.03] active:scale-[0.98]',
  danger:
    'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold shadow-[0_4px_16px_rgba(225,29,72,0.25)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.4)] hover:scale-[1.03] active:scale-[0.98]',
  success:
    'bg-gradient-to-r from-[#93C572] to-[#0D9488] text-white font-semibold shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_24px_rgba(13,148,136,0.4)] hover:scale-[1.03] active:scale-[0.98]',
  glow:
    'bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#0F766E] text-white font-semibold border border-[#98FF98]/40 shadow-[0_0_22px_rgba(13,148,136,0.35),0_4px_16px_rgba(139,107,74,0.1)] hover:from-[#14B8A6] hover:to-[#0D9488] hover:shadow-[0_0_28px_rgba(13,148,136,0.5)] hover:scale-[1.03] active:scale-[0.98]',
  glass:
    'bg-white/80 backdrop-blur-md text-[#0D9488] font-semibold border border-white/95 hover:bg-white hover:text-[#0F5143] hover:scale-[1.03] shadow-[0_4px_16px_rgba(139,107,74,0.06)] active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, iconRight, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[var(--radius-input)] font-medium transition-all duration-200 ease-out',
        'hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
});
