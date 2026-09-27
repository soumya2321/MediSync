import { motion } from 'motion/react';
import {
  RefreshCcw,
  Stethoscope,
  CalendarClock,
  ScanText,
  AlertCircle,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { fadeUp } from './landing-ui';

interface HexBlockerItem {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  offsetDirection: 'left' | 'right';
  desktopPos: {
    left: number;
    top: number;
    centerX: number;
    centerY: number;
  };
}

const HEX_PATH =
  'M 115 8 L 215 8 Q 240 8 250 24 L 308 114 Q 322 130 308 146 L 250 236 Q 240 252 215 252 L 115 252 Q 90 252 80 236 L 22 146 Q 8 130 22 114 L 80 24 Q 90 8 115 8 Z';

export const REFILL_BLOCKERS: HexBlockerItem[] = [
  {
    num: '01',
    title: 'No Refills Remaining',
    desc: 'Expired prescription or zero authorized refills remaining. The pharmacy cannot dispense without physician reauthorization.',
    icon: RefreshCcw,
    gradientFrom: '#0D9488',
    gradientTo: '#2DD4BF',
    offsetDirection: 'left',
    desktopPos: { left: 40, top: 0, centerX: 200, centerY: 130 },
  },
  {
    num: '02',
    title: 'Provider Approval Required',
    desc: 'Dosage adjustments, therapeutic substitution, or medical director sign-off required prior to releasing the maintenance therapy.',
    icon: Stethoscope,
    gradientFrom: '#10B981',
    gradientTo: '#6EE7B7',
    offsetDirection: 'right',
    desktopPos: { left: 340, top: 140, centerX: 500, centerY: 270 },
  },
  {
    num: '03',
    title: 'Patient Visit Needed',
    desc: 'Annual wellness exam overdue, chronic care checkup needed, or monitoring appointment required before continuing medications.',
    icon: CalendarClock,
    gradientFrom: '#047857',
    gradientTo: '#34D399',
    offsetDirection: 'left',
    desktopPos: { left: 40, top: 280, centerX: 200, centerY: 410 },
  },
  {
    num: '04',
    title: 'Missing Information',
    desc: 'Illegible faxes, missing prescriber NPI, unclear SIG instructions, missing quantity, or omitted diagnosis codes stalling fulfillment.',
    icon: ScanText,
    gradientFrom: '#16A34A',
    gradientTo: '#86EFAC',
    offsetDirection: 'right',
    desktopPos: { left: 340, top: 420, centerX: 500, centerY: 550 },
  },
  {
    num: '05',
    title: 'Clinical Review Required',
    desc: 'Overdue surveillance bloodwork (e.g. HbA1c, eGFR, liver enzymes) or drug-drug interaction alerts requiring provider judgment.',
    icon: AlertCircle,
    gradientFrom: '#65A30D',
    gradientTo: '#A3E635',
    offsetDirection: 'left',
    desktopPos: { left: 40, top: 560, centerX: 200, centerY: 690 },
  },
  {
    num: '06',
    title: 'Insurance Blockers',
    desc: 'Prior authorization required, formulary tier exclusion, or step therapy protocol requirements standing between patient and medication.',
    icon: ShieldAlert,
    gradientFrom: '#0F766E',
    gradientTo: '#14B8A6',
    offsetDirection: 'right',
    desktopPos: { left: 340, top: 700, centerX: 500, centerY: 830 },
  },
];

function HexagonCard({
  item,
}: {
  item: HexBlockerItem;
}) {
  const Icon = item.icon;
  const isRight = item.offsetDirection === 'right';

  return (
    <div className="group relative h-[260px] w-[320px] sm:w-[330px] shrink-0 cursor-default select-none transition-transform duration-300 hover:-translate-y-1.5">
      {/* 3D Colored Backing Plate */}
      <div
        className={`absolute inset-0 transition-transform duration-300 group-hover:scale-105 ${
          isRight ? 'translate-x-3.5 translate-y-3' : '-translate-x-3.5 translate-y-3'
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 330 260"
          className="h-full w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.18)]"
          fill="none"
        >
          <defs>
            <linearGradient id={`hex-grad-${item.num}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={item.gradientFrom} />
              <stop offset="100%" stopColor={item.gradientTo} />
            </linearGradient>
          </defs>
          <path d={HEX_PATH} fill={`url(#hex-grad-${item.num})`} />
        </svg>
      </div>

      {/* Front White Rounded Hexagon Card */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg
          viewBox="0 0 330 260"
          className="h-full w-full drop-shadow-[0_12px_32px_rgba(139,107,74,0.10)]"
          fill="none"
        >
          <path
            d={HEX_PATH}
            fill="#FFFFFF"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Internal Content (Icon + Step + Title + Description) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        {/* Line Icon */}
        <div
          className="flex size-11 items-center justify-center rounded-2xl shadow-sm border transition-transform duration-300 group-hover:scale-110 mb-2"
          style={{
            backgroundColor: `${item.gradientFrom}15`,
            borderColor: `${item.gradientFrom}35`,
            color: item.gradientFrom,
          }}
        >
          <Icon className="size-5.5" />
        </div>

        {/* Step Pill */}
        <span
          className="font-mono text-[10.5px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: `${item.gradientFrom}15`,
            color: item.gradientFrom,
          }}
        >
          Step {item.num}
        </span>

        {/* Title */}
        <h3 className="mt-1 font-display text-[15px] sm:text-[16px] font-extrabold text-[#2D2118] leading-tight group-hover:text-[#0D9488] transition-colors max-w-[220px]">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-[11.5px] sm:text-[12px] leading-relaxed text-[#5E4837] font-medium max-w-[230px]">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export function WhyRefillsGetStuckHexagons() {
  return (
    <div className="relative mt-12 w-full">
      {/* Desktop Interlocking Hexagonal Honeycomb (md and above) */}
      <div className="hidden md:block relative mx-auto h-[970px] w-full max-w-[700px]">
        {/* SVG Zigzag Connecting Pipeline */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 700 970"
          fill="none"
          aria-hidden="true"
        >
          {/* Outer grey pipeline track */}
          <path
            d="M 200 130 L 500 270 L 200 410 L 500 550 L 200 690 L 500 830"
            stroke="#CBD5E1"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Inner clean highlight line */}
          <path
            d="M 200 130 L 500 270 L 200 410 L 500 550 L 200 690 L 500 830"
            stroke="#F8FAFC"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          {/* Joint connection rings */}
          {[
            [200, 130],
            [500, 270],
            [200, 410],
            [500, 550],
            [200, 690],
            [500, 830],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="10" fill="#CBD5E1" />
              <circle cx={cx} cy={cy} r="5" fill="#FFFFFF" />
            </g>
          ))}
        </svg>

        {/* 6 Interlocking Hexagon Cards */}
        {REFILL_BLOCKERS.map((item, idx) => (
          <motion.div
            key={item.num}
            variants={fadeUp}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="absolute z-10"
            style={{
              left: `${item.desktopPos.left}px`,
              top: `${item.desktopPos.top}px`,
            }}
          >
            <HexagonCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Mobile Responsive Vertical Chain (< md) */}
      <div className="relative flex flex-col items-center gap-7 md:hidden">
        {/* Central connecting pipeline line */}
        <div
          className="pointer-events-none absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-3 rounded-full bg-[#CBD5E1] shadow-inner"
          aria-hidden="true"
        >
          <div className="h-full w-1 mx-auto bg-white/80 rounded-full" />
        </div>

        {/* 6 Centered Cards with Alternating 3D Plates */}
        {REFILL_BLOCKERS.map((item, idx) => (
          <motion.div
            key={item.num}
            variants={fadeUp}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
            className="relative z-10"
          >
            <HexagonCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
