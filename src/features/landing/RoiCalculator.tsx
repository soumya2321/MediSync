import { useEffect, useId, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { Calculator, Info } from 'lucide-react';
import { computeRoi, PRICE_PER_PROVIDER, ROI_DEFAULTS, type RoiInputs } from './roi';
import { fadeUp, RevealGroup } from './landing-ui';

const usd = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const num = (v: number) => Math.round(v).toLocaleString('en-US');
const mult = (v: number) => `${v.toFixed(1)}×`;

/** Number that tweens to its new value; the final value is always what's in the DOM for assistive tech. */
function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.55, ease: 'easeOut' });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

const FIELDS: { key: keyof RoiInputs; label: string; min: number; max: number; step: number; prefix?: string; suffix?: string }[] = [
  { key: 'providers', label: 'Providers', min: 1, max: 200, step: 1 },
  { key: 'refills', label: 'Stuck refills / month', min: 0, max: 3000, step: 10 },
  { key: 'minutesPerRefill', label: 'Staff minutes saved per refill', min: 0, max: 60, step: 1, suffix: 'min' },
  { key: 'hourlyCost', label: 'Loaded hourly staff cost', min: 10, max: 120, step: 1, prefix: '$' },
  { key: 'calls', label: 'Patient calls avoided / month', min: 0, max: 2000, step: 10 },
  { key: 'minutesPerCall', label: 'Minutes per call', min: 1, max: 30, step: 1, suffix: 'min' },
];

function SliderField({ field, value, onChange }: { field: (typeof FIELDS)[number]; value: number; onChange: (v: number) => void }) {
  const id = useId();
  const pct = ((value - field.min) / (field.max - field.min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-semibold text-[#2D2118]">
          {field.label}
        </label>
        <div className="flex items-center gap-1 rounded-xl border border-[#8B6B4A]/25 bg-white/90 px-2.5 focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#93C572]/20 backdrop-blur-md shadow-sm">
          {field.prefix && <span className="text-[13px] font-medium text-[#8B6B4A]">{field.prefix}</span>}
          <input
            type="number"
            aria-label={`${field.label} (exact value)`}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) onChange(Math.max(field.min, Math.min(field.max * 10, v)));
            }}
            className="h-8 w-16 bg-transparent text-right font-mono text-[13px] font-bold text-[#0D9488] focus:outline-none"
          />
          {field.suffix && <span className="text-[12px] font-medium text-[#8B6B4A]">{field.suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={Math.min(value, field.max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#0D9488]"
        style={{ background: `linear-gradient(90deg, #0D9488 ${Math.min(100, pct)}%, #E5DDD0 ${Math.min(100, pct)}%)` }}
      />
    </div>
  );
}

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(ROI_DEFAULTS);
  const r = computeRoi(inputs);
  const set = (key: keyof RoiInputs) => (v: number) => setInputs((s) => ({ ...s, [key]: v }));

  const results = [
    { label: 'Staff hours saved / month', value: r.hoursSaved, format: (v: number) => `${num(v)} h` },
    { label: 'Monthly value', value: r.monthlyValue, format: usd },
    { label: 'Annual value', value: r.annualValue, format: usd },
    { label: `MediSync cost / month`, value: r.monthlyCost, format: usd, note: `${inputs.providers} × $${PRICE_PER_PROVIDER}` },
  ];

  return (
    <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <motion.form variants={fadeUp} onSubmit={(e) => e.preventDefault()} className="cadabra-glass-card space-y-6 p-5 sm:p-7 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.08)]" aria-label="ROI calculator inputs">
        <div className="flex items-center gap-2 text-[#0D9488]">
          <Calculator className="size-5 text-[#0D9488]" aria-hidden />
          <h3 className="text-[16px] font-bold text-[#2D2118]">Your practice</h3>
        </div>
        {FIELDS.map((f) => (
          <SliderField key={f.key} field={f} value={inputs[f.key]} onChange={set(f.key)} />
        ))}
      </motion.form>

      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5143] via-[#115E59] to-[#0D9488] p-5 text-white border border-[#98FF98]/30 shadow-[0_24px_50px_rgba(13,148,136,0.25)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#98FF98]/20 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#98FF98]">Estimated return</p>
          <p className="mt-3 font-display text-[56px] font-extrabold leading-none tracking-tight sm:text-[64px] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#98FF98] to-[#93C572] drop-shadow-sm">
            <AnimatedNumber value={r.roiMultiple} format={mult} />
          </p>
          <p className="mt-2 text-sm text-white/90 font-medium">value returned for every dollar spent</p>
          <dl className="mt-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {results.map((x) => (
              <div key={x.label} className="rounded-2xl bg-white/15 p-3.5 backdrop-blur-md border border-white/20 transition-all hover:bg-white/25">
                <dt className="text-[12px] font-medium text-white/80">{x.label}</dt>
                <dd className="mt-1 font-display text-[22px] font-bold tracking-tight text-white">
                  <AnimatedNumber value={x.value} format={x.format} />
                </dd>
                {x.note && <dd className="text-[11.5px] font-medium text-[#98FF98]">{x.note}</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-white/80">
            <Info className="mt-0.5 size-3.5 shrink-0 text-[#98FF98]" aria-hidden />
            Illustrative estimate only. Value = refills × minutes ÷ 60 × hourly cost + calls × minutes per call ÷ 60 × hourly cost. Your pilot measures your real baseline.
          </p>
        </div>
      </motion.div>
    </RevealGroup>
  );
}
