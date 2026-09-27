import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRound,
  Building2,
  Stethoscope,
  Users,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface JourneyStep {
  id: string;
  name: string;
  role: string;
  icon: typeof UserRound;
  action: string;
  sla: string;
  accent: string;
  border: string;
  badge: string;
  activeGlow: string;
}

const STEPS: JourneyStep[] = [
  {
    id: 'patient-1',
    name: 'Patient',
    role: 'Care Initiator',
    icon: UserRound,
    action: 'Submits refill inquiry online or at retail desk',
    sla: 'T+0m',
    accent: 'bg-[#0D9488]/15 text-[#0F5143]',
    border: 'border-[#0D9488]/40',
    badge: 'Step 01',
    activeGlow: 'shadow-[0_0_24px_rgba(13,148,136,0.35)] ring-2 ring-[#0D9488]',
  },
  {
    id: 'pharmacy-1',
    name: 'Pharmacy',
    role: 'Retail Dispenser',
    icon: Building2,
    action: 'Scans prescription, detects zero authorized refills',
    sla: 'T+12m',
    accent: 'bg-[#8B6B4A]/15 text-[#543825]',
    border: 'border-[#8B6B4A]/40',
    badge: 'Step 02',
    activeGlow: 'shadow-[0_0_24px_rgba(139,107,74,0.35)] ring-2 ring-[#8B6B4A]',
  },
  {
    id: 'provider-1',
    name: 'Provider',
    role: 'Clinical Authority',
    icon: Stethoscope,
    action: 'Reviews clinical lab history, medication adherence',
    sla: 'T+4h',
    accent: 'bg-[#93C572]/20 text-[#1E4D2B]',
    border: 'border-[#93C572]/50',
    badge: 'Step 03',
    activeGlow: 'shadow-[0_0_24px_rgba(147,197,114,0.45)] ring-2 ring-[#93C572]',
  },
  {
    id: 'staff-1',
    name: 'Practice Staff',
    role: 'Care Coordinator',
    icon: Users,
    action: 'Schedules required wellness visit or routine A1c lab',
    sla: 'T+6h',
    accent: 'bg-[#0D9488]/15 text-[#0F5143]',
    border: 'border-[#0D9488]/40',
    badge: 'Step 04',
    activeGlow: 'shadow-[0_0_24px_rgba(13,148,136,0.35)] ring-2 ring-[#0D9488]',
  },
  {
    id: 'insurance-1',
    name: 'Insurance',
    role: 'Payer System',
    icon: ShieldAlert,
    action: 'Electronic prior auth (ePA) validated in real-time',
    sla: 'T+8h',
    accent: 'bg-[#D8A7B1]/30 text-[#632935]',
    border: 'border-[#D8A7B1]/60',
    badge: 'Step 05',
    activeGlow: 'shadow-[0_0_24px_rgba(216,167,177,0.45)] ring-2 ring-[#D8A7B1]',
  },
  {
    id: 'pharmacy-2',
    name: 'Pharmacy',
    role: 'Dispensing Unit',
    icon: Building2,
    action: 'Fulfills maintenance medication, packages order',
    sla: 'T+14h',
    accent: 'bg-[#8B6B4A]/15 text-[#543825]',
    border: 'border-[#8B6B4A]/40',
    badge: 'Step 06',
    activeGlow: 'shadow-[0_0_24px_rgba(139,107,74,0.35)] ring-2 ring-[#8B6B4A]',
  },
  {
    id: 'patient-2',
    name: 'Patient',
    role: 'Medication Received',
    icon: CheckCircle2,
    action: 'Receives SMS confirmation; medication ready for pickup',
    sla: 'T+16h',
    accent: 'bg-[#98FF98]/30 text-[#0F5143]',
    border: 'border-[#93C572]/60',
    badge: 'Resolved',
    activeGlow: 'shadow-[0_0_24px_rgba(152,255,152,0.6)] ring-2 ring-[#0D9488]',
  },
];

export function RefillJourneyDiagram() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle active pulse across the journey
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeStep = STEPS[activeIdx];

  return (
    <div
      className="cadabra-glass-card p-6 sm:p-8 rounded-3xl border border-white/95 shadow-[0_20px_50px_rgba(139,107,74,0.08)] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#98FF98]/20 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-[#D8A7B1]/20 blur-[90px]" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488]">
            <Sparkles className="size-3 animate-spin" style={{ animationDuration: '4s' }} />
            Continuous Closed-Loop Orchestration
          </span>
          <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#2D2118]">
            Refill Journey Lifecycle
          </h3>
          <p className="text-xs sm:text-sm text-[#5E4837] mt-1">
            Watch the active pulse coordinate all 7 stages from initial request to patient hand-off.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex size-2 rounded-full bg-[#0D9488] animate-ping" />
          <span className="font-mono text-xs font-semibold text-[#8B6B4A]">
            Live Flow Active
          </span>
        </div>
      </div>

      {/* Interactive Horizontal Flow Grid */}
      <div className="relative">
        {/* Animated Connecting Line Bar behind nodes on desktop */}
        <div className="hidden xl:block absolute top-[42px] left-[4%] right-[4%] h-[3px] bg-gradient-to-r from-[#0D9488]/30 via-[#93C572]/40 to-[#0D9488]/30 -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0D9488] to-[#93C572] shadow-[0_0_12px_#0D9488]"
            style={{
              width: `${((activeIdx + 1) / STEPS.length) * 100}%`,
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5 relative z-10">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeIdx;
            const isCompleted = idx < activeIdx;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveIdx(idx);
                  setIsPaused(true);
                }}
                className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? `bg-white/95 border-2 ${step.border} ${step.activeGlow} scale-[1.04]`
                    : isCompleted
                      ? 'bg-white/70 border border-white/90 hover:bg-white/90 hover:scale-[1.02]'
                      : 'bg-white/40 border border-white/70 opacity-80 hover:opacity-100 hover:bg-white/80'
                }`}
              >
                {/* Node Icon Circle */}
                <div className="relative">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm ${
                      isActive
                        ? `${step.accent} ${step.border} scale-110 shadow-md`
                        : `${step.accent} ${step.border}`
                    }`}
                  >
                    <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex size-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75" />
                      <span className="relative inline-flex rounded-full size-3.5 bg-[#0D9488]" />
                    </span>
                  )}
                </div>

                {/* Step badge */}
                <span className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                  {step.badge}
                </span>

                {/* Node Name */}
                <span className="mt-1 font-display text-sm font-bold text-[#2D2118] group-hover:text-[#0D9488] transition-colors">
                  {step.name}
                </span>

                {/* Role subtitle */}
                <span className="mt-0.5 text-[11px] font-medium text-[#5E4837] truncate max-w-full">
                  {step.role}
                </span>

                {/* SLA pill */}
                <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#F5F0E6] px-2 py-0.5 text-[10px] font-semibold text-[#8B6B4A] border border-[#8B6B4A]/20">
                  <Clock className="size-2.5 text-[#0D9488]" />
                  {step.sla}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Details Callout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-white/90 bg-white/80 p-4 sm:p-5 backdrop-blur-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${activeStep.accent} ${activeStep.border}`}
            >
              <activeStep.icon className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0D9488]">
                  Stage {activeIdx + 1} of 7: {activeStep.name} ({activeStep.role})
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#2D2118]">
                {activeStep.action}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs font-medium text-[#8B6B4A]">
              Next Hand-Off
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-1 rounded-lg">
              <span>{STEPS[(activeIdx + 1) % STEPS.length].name}</span>
              <ArrowRight className="size-3 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
