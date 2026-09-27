import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, motion } from 'motion/react';
import { cn } from '@/lib/format';

export interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
}

/**
 * Animated number reveal component that counts up from 0 to the target value
 * triggered ONLY when scrolled into the viewport.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.8,
  className,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(
    formatter ? formatter(0) : `${prefix}0${suffix}`,
  );


  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: [0.16, 1, 0.3, 1], // Apple-style smooth decelerating curve
        onUpdate: (latest) => {
          if (formatter) {
            setDisplayValue(formatter(latest));
          } else {
            const formattedNum = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString('en-US');
            setDisplayValue(`${prefix}${formattedNum}${suffix}`);
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration, prefix, suffix, decimals, formatter, count]);

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block tabular-nums font-display tracking-tight', className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {displayValue}
    </motion.span>
  );
}
