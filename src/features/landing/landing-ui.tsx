import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/format';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } });

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[#93C572]/45 bg-[#93C572]/15 px-3.5 py-1 text-[12px] font-bold uppercase tracking-[0.14em] text-[#1E4D2B] backdrop-blur-md shadow-sm',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-[#0D9488] shadow-[0_0_8px_#0D9488] animate-pulse" />
      {children}
    </span>
  );
}

/** Section header: eyebrow + light/bold heading + lede, revealed once when scrolled into view. */
export function SectionHeading({
  eyebrow,
  light,
  bold,
  lede,
  id,
  align = 'left',
  className,
}: {
  eyebrow: string;
  light: string;
  bold: string;
  lede?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger(0.08)}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      <motion.div variants={fadeUp}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </motion.div>
      <motion.h2 variants={fadeUp} id={id} className="mt-3.5 text-[34px] leading-[1.08] tracking-tight sm:text-[44px]">
        <span className="font-light text-[#2D2118]">{light}</span>{' '}
        <span className="font-extrabold bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] bg-clip-text text-transparent drop-shadow-sm">
          {bold}
        </span>
      </motion.h2>
      {lede && (
        <motion.p variants={fadeUp} className="mt-4 text-[16px] leading-relaxed text-[#5E4837] sm:text-[17px]">
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Reveal-on-scroll wrapper for a group of children that use `fadeUp` variants. */
export function RevealGroup({ children, className, gap = 0.08, as = 'div' }: { children: ReactNode; className?: string; gap?: number; as?: 'div' | 'ul' | 'ol' }) {
  const Comp = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div;
  return (
    <Comp initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(gap)} className={className}>
      {children}
    </Comp>
  );
}
