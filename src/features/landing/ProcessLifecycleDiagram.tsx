import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock,
  PackageCheck,
  ScanText,
  Stethoscope,
  UserCheck,
  Workflow,
} from 'lucide-react';

interface Stage {
  step: string;
  title: string;
  badge: string;
  desc: string;
  icon: typeof ScanText;
  owner: string;
}

const STAGES: Stage[] = [
  {
    step: '01',
    title: 'Intake & OCR',
    badge: 'Multi-Channel',
    desc: 'Refill inquiry captured via eRx, phone, or fax. Optical OCR digitizes handwriting with field confidence scores.',
    icon: ScanText,
    owner: 'Intake Pipeline',
  },
  {
    step: '02',
    title: 'Patient Matching',
    badge: 'Identity Match',
    desc: 'Deterministic cross-check against EHR master index by chart #, DOB, and active medication history.',
    icon: UserCheck,
    owner: 'Practice Staff',
  },
  {
    step: '03',
    title: 'Blocker Triage',
    badge: 'Rules R1–R10',
    desc: 'Evaluates blockers instantly: 0 refills remaining, overdue A1c lab, prior authorization, or visit required.',
    icon: AlertCircle,
    owner: 'Cognitive Engine',
  },
  {
    step: '04',
    title: 'Ownership & SLA',
    badge: 'Accountability',
    desc: 'Case routed to a single named owner with an active countdown SLA timer and automated escalation triggers.',
    icon: Workflow,
    owner: 'Single Owner',
  },
  {
    step: '05',
    title: 'Provider Review',
    badge: '111111 MFA',
    desc: 'Clinician inspects synthesized medical summary, approves or modifies order, and signs with step-up MFA.',
    icon: Stethoscope,
    owner: 'Licensed Provider',
  },
  {
    step: '06',
    title: 'Fulfillment Sync',
    badge: 'Dispensary',
    desc: 'Approved prescription sent to pharmacy. Dispense confirmation automatically closes the shared case.',
    icon: PackageCheck,
    owner: 'Retail Pharmacy',
  },
  {
    step: '07',
    title: 'Patient Updated',
    badge: 'Live Tracker',
    desc: 'Safe plain-language SMS notification dispatched with web status lookup link. Zero phone chasing required.',
    icon: BellRing,
    owner: 'Informed Patient',
  },
];

export function ProcessLifecycleDiagram() {
  return (
    <div className="relative">
      {/* Horizontal step-by-step connected nodes flow */}
      <div className="overflow-x-auto pb-6 pt-2 [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex min-w-full items-stretch gap-3 lg:gap-4">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isLast = idx === STAGES.length - 1;

            return (
              <div key={s.step} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex w-[240px] sm:w-[260px] flex-col justify-between rounded-3xl border border-white/90 bg-white/95 p-5 shadow-[0_14px_36px_rgba(26,158,150,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#1A9E96]/40 hover:shadow-[0_20px_48px_rgba(26,158,150,0.12)] shrink-0"
                >
                  {/* Step Top Bar */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black tracking-wider text-[#1A9E96] bg-[#F0FAF9] px-2.5 py-1 rounded-xl border border-[#1A9E96]/20">
                        STAGE {s.step}
                      </span>
                      <span className="text-[11px] font-bold text-[#8B6B4A] bg-[#F5F0E6] px-2 py-0.5 rounded-lg">
                        {s.owner}
                      </span>
                    </div>

                    {/* Stage Icon & Title */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A9E96] to-[#14B8A6] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1E293B] group-hover:text-[#1A9E96] transition-colors leading-snug">
                          {s.title}
                        </h4>
                        <span className="text-[11.5px] font-semibold text-[#1A9E96]">
                          {s.badge}
                        </span>
                      </div>
                    </div>

                    {/* Stage Description */}
                    <p className="mt-3.5 text-[12.5px] leading-relaxed text-[#5E4837] font-medium">
                      {s.desc}
                    </p>
                  </div>

                  {/* Stage Footer Status */}
                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-bold text-[#0D9488]">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-[#1A9E96]" /> Synchronized
                    </span>
                    <span className="text-[#8B6B4A]">Step {idx + 1} of 7</span>
                  </div>
                </motion.div>

                {/* Horizontal Arrow Connector (between nodes) */}
                {!isLast && (
                  <div className="hidden lg:flex shrink-0 items-center justify-center px-1.5 text-[#1A9E96]/60">
                    <div className="flex items-center">
                      <span className="h-0.5 w-3 bg-gradient-to-r from-[#1A9E96]/30 to-[#1A9E96]" />
                      <ArrowRight className="size-4 -ml-1 text-[#1A9E96]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagram Bottom Summary Pill */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 border border-white/90 shadow-2xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-xl bg-[#1A9E96] text-white">
            <Workflow className="size-4" />
          </span>
          <p className="text-xs sm:text-sm font-bold text-[#1E293B]">
            Continuous Single Source of Truth: <span className="font-medium text-[#5E4837]">No step occurs in an isolated silo. Every transition emits real-time events to all parties.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#1A9E96]">
          <Clock className="size-3.5" />
          <span>Average SLA: &lt; 3.2 Hours Total</span>
        </div>
      </div>
    </div>
  );
}
