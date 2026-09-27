// Hand-rolled, dependency-free charts with Cadabra medical styling & smooth bar growth animations.
import { useId, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/format';

export const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] as const },
});

/** Clean integer ticks (0, 5, 10 …) for small counts. */
export function niceScale(maxValue: number, count = 4): { max: number; ticks: number[] } {
  const raw = Math.max(maxValue, 1) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag);
  const max = Math.max(step, Math.ceil(maxValue / step) * step);
  const ticks: number[] = [];
  for (let t = 0; t <= max + 1e-9; t += step) ticks.push(Math.round(t));
  return { max, ticks };
}

function ChartFigure({ title, description, children, footnote }: { title: string; description?: ReactNode; children: (ids: { titleId: string }) => ReactNode; footnote?: ReactNode }) {
  const titleId = useId();
  return (
    <figure aria-labelledby={titleId} className="flex h-full flex-col">
      <figcaption className="border-b border-[#8B6B4A]/15 px-6 py-4 bg-white/40">
        <h3 id={titleId} className="text-[16px] font-bold text-[#2D2118]">
          {title}
        </h3>
        {description && <p className="mt-1 text-[13px] text-[#5E4837] font-medium">{description}</p>}
      </figcaption>
      <div className="flex-1 px-6 py-5">{children({ titleId })}</div>
      {footnote && <p className="border-t border-[#8B6B4A]/15 px-6 py-3 text-[12px] text-[#8B6B4A] font-medium bg-white/30">{footnote}</p>}
    </figure>
  );
}

// ------------------------------------------------------------------ Weekly grouped columns

export interface WeeklyPoint {
  week: string;
  resolved: number;
  within48h: number;
}

const SERIES = [
  { key: 'resolved' as const, label: 'Resolved', swatch: 'bg-[#93C572]', line: 'bg-[#93C572]' },
  { key: 'within48h' as const, label: 'Resolved within 48 h', swatch: 'bg-[#0D9488]', line: 'bg-[#0D9488]' },
];

export function WeeklyColumnChart({ data, title, description, footnote }: { data: WeeklyPoint[]; title: string; description?: ReactNode; footnote?: ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const { max, ticks } = niceScale(Math.max(0, ...data.map((d) => Math.max(d.resolved, d.within48h))));
  const pct = (v: number) => (v / max) * 100;
  const last = data.length - 1;

  return (
    <ChartFigure title={title} description={description} footnote={footnote}>
      {({ titleId }) => (
        <>
          <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] font-semibold text-[#5E4837]" aria-label="Legend">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-2">
                <span className={cn('size-3 rounded-full shadow-sm', s.swatch)} aria-hidden />
                {s.label}
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            {/* y-axis */}
            <div className="relative h-48 w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#8B6B4A]" aria-hidden>
              {ticks.map((t) => (
                <span key={t} className="absolute right-0 translate-y-1/2 leading-none" style={{ bottom: `${pct(t)}%` }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="relative h-48" onMouseLeave={() => setActive(null)}>
                {/* hairline grid */}
                {ticks.map((t) => (
                  <div key={t} className={cn('absolute inset-x-0 h-px', t === 0 ? 'bg-[#8B6B4A]/25' : 'bg-[#8B6B4A]/10')} style={{ bottom: `${pct(t)}%` }} aria-hidden />
                ))}
                <div className="relative flex h-full items-stretch">
                  {data.map((d, i) => {
                    const isActive = active === i;
                    const dim = active !== null && !isActive;
                    const top = Math.max(pct(d.resolved), pct(d.within48h));
                    return (
                      <div
                        key={d.week}
                        role="img"
                        tabIndex={0}
                        aria-label={`${d.week}: ${d.resolved} resolved, ${d.within48h} within 48 hours`}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive((a) => (a === i ? null : a))}
                        className={cn('relative flex h-full min-w-0 flex-1 cursor-default items-end justify-center gap-1 rounded-2xl px-[6%] outline-offset-0 transition-colors', isActive && 'bg-[#93C572]/15')}
                      >
                        {SERIES.map((s) => (
                          <motion.div
                            key={s.key}
                            initial={{ height: 0 }}
                            animate={{ height: `${pct(d[s.key])}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                            className={cn('w-full max-w-6 rounded-t-lg shadow-sm transition-opacity duration-300', s.swatch, dim && 'opacity-40')}
                          />
                        ))}
                        {i === last && !isActive && (
                          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold tabular-nums text-[#0D9488]" style={{ bottom: `calc(${top}% + 4px)` }} aria-hidden>
                            {d.within48h}/{d.resolved}
                          </span>
                        )}
                        {isActive && (
                          <div
                            role="tooltip"
                            className={cn(
                              'pointer-events-none absolute z-20 w-max min-w-36 rounded-2xl border border-white/90 bg-white/95 backdrop-blur-xl px-3.5 py-2.5 text-left shadow-[0_12px_28px_rgba(139,107,74,0.15)]',
                              i === 0 ? 'left-0' : i === last ? 'right-0' : 'left-1/2 -translate-x-1/2',
                            )}
                            style={{ bottom: `calc(${Math.min(top, 70)}% + 12px)` }}
                          >
                            <p className="mb-1 text-[11.5px] font-bold text-[#8B6B4A]">{d.week === 'This week' ? 'This week (live)' : `Week of ${d.week}`}</p>
                            {SERIES.map((s) => (
                              <p key={s.key} className="flex items-center gap-2 text-[12.5px] font-medium">
                                <span className={cn('h-1 w-3 rounded-full', s.line)} aria-hidden />
                                <span className="font-bold tabular-nums text-[#2D2118]">{d[s.key]}</span>
                                <span className="text-[#5E4837]">{s.label.toLowerCase()}</span>
                              </p>
                            ))}
                            <p className="mt-1 border-t border-[#8B6B4A]/15 pt-1 text-[11.5px] font-semibold text-[#0D9488]">{d.resolved ? `${Math.round((d.within48h / d.resolved) * 100)}% within 48 h` : 'No resolved cases'}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* x-axis */}
              <div className="mt-2 flex" aria-hidden>
                {data.map((d) => (
                  <span key={d.week} className="min-w-0 flex-1 px-0.5 text-center text-[10.5px] font-semibold leading-tight text-[#8B6B4A] sm:text-[11px]">
                    {d.week}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <table className="sr-only" aria-labelledby={titleId}>
            <thead>
              <tr>
                <th scope="col">Week</th>
                <th scope="col">Resolved</th>
                <th scope="col">Resolved within 48 hours</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.week}>
                  <th scope="row">{d.week}</th>
                  <td>{d.resolved}</td>
                  <td>{d.within48h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </ChartFigure>
  );
}

// ------------------------------------------------------------------ Horizontal bars (single series)

export interface HBarRow {
  key: string;
  label: ReactNode;
  text: string;
  value: number;
}

export function HBarChart({ rows, title, description, unit = 'cases', footnote }: { rows: HBarRow[]; title: string; description?: ReactNode; unit?: string; footnote?: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;

  return (
    <ChartFigure title={title} description={description} footnote={footnote}>
      {() => (
        <ul className="space-y-1.5" onMouseLeave={() => setActive(null)}>
          {rows.map((r, i) => {
            const isActive = active === r.key;
            const dim = active !== null && !isActive;
            const share = Math.round((r.value / total) * 100);
            return (
              <li
                key={r.key}
                tabIndex={0}
                onMouseEnter={() => setActive(r.key)}
                onFocus={() => setActive(r.key)}
                onBlur={() => setActive((a) => (a === r.key ? null : a))}
                className={cn('relative grid grid-cols-1 gap-1 rounded-2xl px-2.5 py-2 transition-colors sm:grid-cols-[minmax(0,10.5rem)_minmax(0,1fr)] sm:items-center sm:gap-3', isActive && 'bg-[#93C572]/15')}
              >
                <span className="min-w-0 truncate text-[13px] font-semibold text-[#2D2118]">{r.label}</span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `max(4px, calc((100% - 3.5rem) * ${r.value / max}))` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                    className={cn('h-3 flex-none rounded-full bg-gradient-to-r from-[#0D9488] to-[#93C572] shadow-sm transition-opacity duration-300', dim && 'opacity-40')}
                    aria-hidden
                  />
                  <span className="text-[12.5px] font-bold tabular-nums text-[#2D2118]">
                    {r.value}
                    <span className="sr-only">
                      {' '}
                      {unit}, {share}% of total
                    </span>
                  </span>
                </span>
                {isActive && (
                  <span className="pointer-events-none absolute -top-7 right-2 z-20 whitespace-nowrap rounded-xl border border-white/90 bg-white/95 backdrop-blur-xl px-2.5 py-1 text-[11.5px] font-medium text-[#5E4837] shadow-[0_8px_20px_rgba(139,107,74,0.12)]" aria-hidden>
                    <span className="font-bold text-[#0D9488]">{r.value}</span> {unit} · {share}% of total
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ChartFigure>
  );
}
