import { motion } from 'motion/react';
import {
  UserRound,
  Building2,
  Stethoscope,
  Users,
  Layers,
  XCircle,
  CheckCircle2,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

export function SharedCaseDiagram() {
  return (
    <div className="cadabra-glass-card p-6 sm:p-8 rounded-3xl border border-white/95 shadow-[0_20px_50px_rgba(139,107,74,0.08)] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-16 -left-16 size-60 rounded-full bg-[#D8A7B1]/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 size-60 rounded-full bg-[#98FF98]/25 blur-[80px]" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488]">
          <Sparkles className="size-3 animate-spin" style={{ animationDuration: '4s' }} />
          Architectural Paradigm Shift
        </span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#2D2118]">
          The Shared Case Architecture
        </h3>
        <p className="mt-2 text-sm text-[#5E4837]">
          Compare the chaotic ping-pong of disconnected point-to-point inquiries against MediSync's unified hub-and-spoke model.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-stretch">
        {/* =========================================================================
            LEFT: Traditional Disconnected Fragmentation
           ========================================================================= */}
        <div className="rounded-3xl border-2 border-[#D8A7B1]/60 bg-gradient-to-b from-white/90 to-[#F5F0E6]/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#8B6B4A]/15 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle className="size-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">The Problem</span>
                <h4 className="text-lg font-bold text-[#2D2118]">Traditional Fragmentation</h4>
              </div>
            </div>
            <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
              Disconnected Ping-Pong
            </span>
          </div>

          {/* Visual Mesh of Disconnected Arrows */}
          <div className="my-8 relative min-h-[260px] flex items-center justify-center">
            {/* 4 Corner Nodes */}
            <div className="absolute top-2 left-2 flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-red-200 shadow-sm text-xs font-bold text-[#2D2118]">
              <UserRound className="size-4 text-red-500" /> Patient
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-red-200 shadow-sm text-xs font-bold text-[#2D2118]">
              <Building2 className="size-4 text-red-500" /> Pharmacy
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-red-200 shadow-sm text-xs font-bold text-[#2D2118]">
              <Users className="size-4 text-red-500" /> Practice Staff
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-red-200 shadow-sm text-xs font-bold text-[#2D2118]">
              <Stethoscope className="size-4 text-red-500" /> Provider
            </div>

            {/* Chaotic SVG Arrows Crossing Between Nodes */}
            <svg className="w-full h-52 pointer-events-none select-none" viewBox="0 0 320 200">
              {/* Patient <-> Pharmacy */}
              <motion.line
                x1="80" y1="30" x2="240" y2="30"
                stroke="#E11D48" strokeWidth="2" strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
              {/* Pharmacy <-> Staff */}
              <motion.line
                x1="260" y1="50" x2="60" y2="160"
                stroke="#E11D48" strokeWidth="2" strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, 20] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />
              {/* Staff <-> Provider */}
              <motion.line
                x1="90" y1="170" x2="230" y2="170"
                stroke="#E11D48" strokeWidth="2" strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
              />
              {/* Patient <-> Staff */}
              <motion.line
                x1="50" y1="50" x2="50" y2="150"
                stroke="#E11D48" strokeWidth="2" strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, 20] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
              {/* Provider <-> Pharmacy */}
              <motion.line
                x1="270" y1="150" x2="270" y2="50"
                stroke="#E11D48" strokeWidth="2" strokeDasharray="5,5"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              />
            </svg>

            {/* Center Frustration Callout */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="rounded-xl bg-red-100/90 border border-red-300 px-3 py-1.5 text-xs font-extrabold text-red-700 shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                <ArrowRightLeft className="size-3.5" />
                Unindexed Fax &amp; Voicemail
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-[#5E4837] border-t border-[#8B6B4A]/15 pt-4">
            <p className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-red-500" />
              Multiple uncoordinated messages across telephone, fax, and paper
            </p>
            <p className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-red-500" />
              No centralized owner; tasks drop through operational cracks
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT: MediSync Hub-and-Spoke Single Source of Truth
           ========================================================================= */}
        <div className="rounded-3xl border-2 border-[#0D9488]/50 bg-gradient-to-b from-white/95 to-[#98FF98]/10 p-6 sm:p-7 shadow-[0_16px_40px_rgba(13,148,136,0.12)] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#8B6B4A]/15 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#0D9488] text-white shadow-sm">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">The MediSync Model</span>
                <h4 className="text-lg font-bold text-[#2D2118]">Single Source of Truth</h4>
              </div>
            </div>
            <span className="rounded-full bg-[#0D9488]/15 border border-[#0D9488]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#0F5143]">
              Hub &amp; Spoke
            </span>
          </div>

          {/* Hub-and-Spoke Interactive Visualization */}
          <div className="my-8 relative min-h-[260px] flex items-center justify-center">
            {/* Radiating Hub in Center */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="z-20 flex flex-col items-center justify-center size-32 rounded-full bg-gradient-to-br from-[#0D9488] to-[#93C572] text-white p-3 text-center shadow-[0_0_32px_rgba(13,148,136,0.4)] border-4 border-white"
            >
              <Layers className="size-6 text-[#98FF98]" />
              <span className="mt-1 font-display text-xs font-extrabold leading-tight">
                Shared Refill Case
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#98FF98] mt-0.5">
                Single Truth
              </span>
            </motion.div>

            {/* Surrounding Spoke Nodes */}
            <div className="absolute top-2 left-4 flex items-center gap-1.5 p-2 rounded-xl bg-white/95 border border-[#93C572]/50 shadow-sm text-xs font-bold text-[#2D2118] z-10">
              <UserRound className="size-3.5 text-[#0D9488]" /> Patient
            </div>
            <div className="absolute top-2 right-4 flex items-center gap-1.5 p-2 rounded-xl bg-white/95 border border-[#93C572]/50 shadow-sm text-xs font-bold text-[#2D2118] z-10">
              <Building2 className="size-3.5 text-[#8B6B4A]" /> Pharmacy
            </div>
            <div className="absolute bottom-2 left-4 flex items-center gap-1.5 p-2 rounded-xl bg-white/95 border border-[#93C572]/50 shadow-sm text-xs font-bold text-[#2D2118] z-10">
              <Users className="size-3.5 text-[#0D9488]" /> Practice Staff
            </div>
            <div className="absolute bottom-2 right-4 flex items-center gap-1.5 p-2 rounded-xl bg-white/95 border border-[#93C572]/50 shadow-sm text-xs font-bold text-[#2D2118] z-10">
              <Stethoscope className="size-3.5 text-[#0D9488]" /> Provider
            </div>

            {/* Animated Radiant Connecting Spoke Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" viewBox="0 0 320 240">
              {/* Spoke to Patient */}
              <motion.line
                x1="80" y1="40" x2="160" y2="120"
                stroke="#0D9488" strokeWidth="2.5" strokeDasharray="6,4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
              {/* Spoke to Pharmacy */}
              <motion.line
                x1="240" y1="40" x2="160" y2="120"
                stroke="#0D9488" strokeWidth="2.5" strokeDasharray="6,4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
              {/* Spoke to Staff */}
              <motion.line
                x1="80" y1="200" x2="160" y2="120"
                stroke="#0D9488" strokeWidth="2.5" strokeDasharray="6,4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
              {/* Spoke to Provider */}
              <motion.line
                x1="240" y1="200" x2="160" y2="120"
                stroke="#0D9488" strokeWidth="2.5" strokeDasharray="6,4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </svg>
          </div>

          <div className="space-y-2 text-xs font-semibold text-[#5E4837] border-t border-[#8B6B4A]/15 pt-4">
            <p className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#0D9488]" />
              Everyone interacts with one synchronized live state machine
            </p>
            <p className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#0D9488]" />
              Clear ownership, exact countdown SLA, and plain-language patient portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
