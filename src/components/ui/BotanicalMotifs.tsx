import { motion } from 'motion/react';
import { HeartPulse, Sparkles, TrendingUp } from 'lucide-react';

/**
 * Botanical leaf illustrations styled after Cadabra.Studio's signature medical UI aesthetic:
 * Soft pastel teal (#1A9E96, #C8E7E4), warm peach/coral (#FF9A62, #F8B4A6), and delicate mint white.
 */
export function BotanicalSprays({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-35"
      >
        <defs>
          <linearGradient id="leafTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A9E96" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#98FF98" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="leafCoralGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9A62" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFC8B0" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="leafMintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6F7F5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C8E7E4" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Central main stem */}
        <path
          d="M250 490C250 360 270 230 330 110"
          stroke="url(#leafTealGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Left side palm / willow leaves */}
        <path
          d="M255 420C210 395 170 410 130 450C165 400 205 385 255 405Z"
          fill="url(#leafTealGrad)"
        />
        <path
          d="M260 350C190 315 140 330 90 380C140 320 195 305 260 335Z"
          fill="url(#leafMintGrad)"
        />
        <path
          d="M270 275C195 230 150 240 100 290C155 225 210 215 272 260Z"
          fill="url(#leafCoralGrad)"
        />
        <path
          d="M285 205C215 150 175 160 120 200C180 145 235 135 288 190Z"
          fill="url(#leafTealGrad)"
        />

        {/* Right side palm / willow leaves */}
        <path
          d="M260 440C305 410 355 420 400 460C360 415 315 400 262 425Z"
          fill="url(#leafCoralGrad)"
        />
        <path
          d="M270 370C340 330 395 340 440 385C390 335 330 320 272 355Z"
          fill="url(#leafTealGrad)"
        />
        <path
          d="M285 295C365 245 410 250 460 290C400 235 340 230 286 280Z"
          fill="url(#leafMintGrad)"
        />
        <path
          d="M305 220C385 160 425 165 470 200C410 150 350 145 305 205Z"
          fill="url(#leafTealGrad)"
        />
        <path
          d="M330 110C350 60 375 30 400 10C380 40 360 75 330 110Z"
          fill="url(#leafCoralGrad)"
        />
      </svg>
    </div>
  );
}

/**
 * Top floating leaf stem motif for delicate corners and margins
 */
export function LeafCornerSpray({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
        <path
          d="M10 10C70 40 140 80 260 170"
          stroke="#1A9E96"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M50 30C55 10 75 5 95 15C85 25 75 35 50 30Z" fill="#1A9E96" />
        <path d="M90 55C110 30 135 35 150 50C130 60 115 65 90 55Z" fill="#FF9A62" />
        <path d="M140 85C165 60 190 70 205 85C185 95 170 100 140 85Z" fill="#1A9E96" />
        <path d="M190 120C220 95 245 105 260 125C235 135 215 135 190 120Z" fill="#98FF98" />
        <path d="M70 45C55 60 45 80 50 95C60 80 65 65 70 45Z" fill="#98FF98" />
        <path d="M115 75C100 95 90 115 95 130C105 110 110 95 115 75Z" fill="#FF9A62" />
        <path d="M165 105C150 125 140 150 148 165C155 145 160 128 165 105Z" fill="#1A9E96" />
      </svg>
    </div>
  );
}

/**
 * Tablet screen preview card matching the Cadabra.Studio medical app reference
 * Features "Examinations", "Health Curve" wave graph, and live coordination status.
 */
export function CadabraTabletPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[28px] bg-white/95 p-5 sm:p-6 shadow-[0_24px_60px_rgba(10,77,71,0.22)] border border-white/90 text-[#1E293B] backdrop-blur-xl"
    >
      {/* Tablet Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A9E96] to-[#14B8A6] text-white shadow-sm">
            <HeartPulse className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13.5px] font-bold text-[#1E293B]">Live Refill Coordination</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-[11.5px] text-[#64748B] font-medium">Tablet Hub · Multi-party sync</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 rounded-xl bg-[#F0FAF9] px-3 py-1.5 border border-[#1A9E96]/20">
          <Sparkles className="size-3.5 text-[#1A9E96]" />
          <span className="text-[12px] font-bold text-[#1A9E96]">Zero Blind Spots</span>
        </div>
      </div>

      {/* Examinations Card Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#F8FAF9] p-3 border border-[#E2EFEB] transition-all hover:bg-white hover:shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Resolution</span>
          <p className="mt-0.5 text-lg font-extrabold text-[#1E293B]">94.8%</p>
          <span className="text-[11px] font-semibold text-emerald-600">↑ 3.4x faster</span>
        </div>
        <div className="rounded-2xl bg-[#F8FAF9] p-3 border border-[#E2EFEB] transition-all hover:bg-white hover:shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Cycle Time</span>
          <p className="mt-0.5 text-lg font-extrabold text-[#1E293B]">3.2 hrs</p>
          <span className="text-[11px] font-semibold text-[#1A9E96]">vs. 48h phone wait</span>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#FFF6F2] p-3 border border-[#FDE5DC] transition-all hover:bg-white hover:shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A59]">Blockers Solved</span>
          <p className="mt-0.5 text-lg font-extrabold text-[#1E293B]">1,280+</p>
          <span className="text-[11px] font-semibold text-[#FF7A59]">Prior Auth & Lab sync</span>
        </div>
      </div>

      {/* Health Curve Wave Graph (Cadabra reference recreation) */}
      <div className="mt-4 rounded-2xl bg-gradient-to-b from-[#F3FBF9] to-white p-3.5 border border-[#E2EFEB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4 text-[#1A9E96]" />
            <span className="text-[12.5px] font-bold text-[#1E293B]">Refill Health Curve</span>
          </div>
          <span className="text-[11px] font-semibold text-[#64748B]">Continuous SLA Tracking</span>
        </div>

        {/* SVG Bezier Wave Graph */}
        <div className="relative h-16 w-full overflow-hidden">
          <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A9E96" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1A9E96" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Wave area */}
            <path
              d="M0 45 C50 15, 100 55, 150 30 C200 10, 250 48, 300 20 C350 5, 380 25, 400 15 L400 70 L0 70 Z"
              fill="url(#waveFill)"
            />
            {/* Wave line */}
            <path
              d="M0 45 C50 15, 100 55, 150 30 C200 10, 250 48, 300 20 C350 5, 380 25, 400 15"
              fill="none"
              stroke="#1A9E96"
              strokeWidth="2.75"
              strokeLinecap="round"
            />
            {/* Focal pulse node */}
            <circle cx="300" cy="20" r="4.5" fill="#1A9E96" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="150" cy="30" r="3.5" fill="#FF7A59" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Stakeholder connectivity pills */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-[#64748B] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#1A9E96]" />
            <span className="font-bold text-[#1E293B]">Practice</span> (Online)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#FF7A59]" />
            <span className="font-bold text-[#1E293B]">Pharmacy</span> (Synced)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-[#1E293B]">Patient</span> (SMS Updated)
          </div>
        </div>
      </div>
    </motion.div>
  );
}
