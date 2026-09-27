import { motion } from 'motion/react';
import {
  Inbox,
  AlertTriangle,
  UserCheck,
  Bot,
  Stethoscope,
  CheckCircle2,
  BellRing,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

interface DecisionNode {
  step: string;
  title: string;
  category: 'System' | 'Rules Engine' | 'AI Assist' | 'Human Authority' | 'Closed Loop';
  desc: string;
  icon: typeof Inbox;
  badgeColor: string;
  iconColor: string;
}

const FLOW_NODES: DecisionNode[] = [
  {
    step: 'Node 01',
    title: 'Request Received',
    category: 'System',
    desc: 'Digital eRx, pharmacy portal, phone intake, or scanned PDF fax ingested into secure HIPAA pipeline.',
    icon: Inbox,
    badgeColor: 'bg-[#8B6B4A]/10 text-[#543825] border-[#8B6B4A]/25',
    iconColor: 'bg-[#8B6B4A]/15 text-[#543825] border-[#8B6B4A]/30',
  },
  {
    step: 'Node 02',
    title: 'Detect Blocker',
    category: 'Rules Engine',
    desc: 'Rules R1–R10 evaluate: zero refills, expired prescription, visit overdue (>12 months), or missing HbA1c/eGFR.',
    icon: AlertTriangle,
    badgeColor: 'bg-[#D8A7B1]/25 text-[#632935] border-[#D8A7B1]/50',
    iconColor: 'bg-[#D8A7B1]/20 text-[#632935] border-[#D8A7B1]/40',
  },
  {
    step: 'Node 03',
    title: 'Identify Owner',
    category: 'System',
    desc: 'Assigns single responsible clinician or triage coordinator with active SLA countdown timer.',
    icon: UserCheck,
    badgeColor: 'bg-[#0D9488]/15 text-[#0F5143] border-[#0D9488]/30',
    iconColor: 'bg-[#0D9488]/15 text-[#0F5143] border-[#0D9488]/30',
  },
  {
    step: 'Node 04',
    title: 'Suggest Action',
    category: 'AI Assist',
    desc: 'AI synthesizes relevant medical history, highlights missing diagnostics, and recommends specific bridging protocols.',
    icon: Bot,
    badgeColor: 'bg-[#98FF98]/30 text-[#0F5143] border-[#93C572]/50',
    iconColor: 'bg-[#98FF98]/30 text-[#0F5143] border-[#93C572]/50',
  },
  {
    step: 'Node 05',
    title: 'Human Review',
    category: 'Human Authority',
    desc: 'Licensed physician evaluates recommendations, orders required bridge or lab, and authorizes with step-up MFA.',
    icon: Stethoscope,
    badgeColor: 'bg-[#93C572]/20 text-[#1E4D2B] border-[#93C572]/50',
    iconColor: 'bg-[#93C572]/20 text-[#1E4D2B] border-[#93C572]/50',
  },
  {
    step: 'Node 06',
    title: 'Resolution',
    category: 'Closed Loop',
    desc: 'Electronic order transmitted to retail pharmacy; loop remains monitored until dispense confirmation is received.',
    icon: CheckCircle2,
    badgeColor: 'bg-[#0D9488]/15 text-[#0F5143] border-[#0D9488]/30',
    iconColor: 'bg-[#0D9488]/15 text-[#0F5143] border-[#0D9488]/30',
  },
  {
    step: 'Node 07',
    title: 'Patient Updated',
    category: 'Closed Loop',
    desc: 'Automated SMS notification dispatched in plain language; live web tracker updated with no exposed medication names.',
    icon: BellRing,
    badgeColor: 'bg-[#98FF98]/35 text-[#0F5143] border-[#93C572]/60',
    iconColor: 'bg-[#98FF98]/35 text-[#0F5143] border-[#93C572]/60',
  },
];

export function AiDecisionFlow() {
  return (
    <div className="cadabra-glass-card p-6 sm:p-8 rounded-3xl border border-white/95 shadow-[0_20px_50px_rgba(139,107,74,0.08)] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-24 top-1/4 size-80 rounded-full bg-[#93C572]/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-1/4 size-80 rounded-full bg-[#98FF98]/25 blur-[100px]" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#0D9488]/10 border border-[#0D9488]/25 text-[#0D9488]">
          <Sparkles className="size-3 animate-spin" style={{ animationDuration: '4s' }} />
          Deterministic Intelligence Architecture
        </span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#2D2118]">
          AI Decision Flow
        </h3>
        <p className="mt-2 text-sm text-[#5E4837]">
          Every refill case progresses through 7 deterministic phases with human clinician oversight at every clinical boundary.
        </p>
      </div>

      {/* Sequential Flow Nodes */}
      <div className="relative max-w-3xl mx-auto">
        {/* Animated Vertical Line in background */}
        <div className="absolute left-[31px] sm:left-[35px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#0D9488]/40 via-[#93C572]/50 to-[#0D9488]/40 -z-0" />

        <div className="space-y-4 relative z-10">
          {FLOW_NODES.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.step}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 sm:gap-6 p-4 sm:p-5 rounded-3xl bg-white/85 border border-white/95 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 group"
              >
                {/* Step Circle & Icon */}
                <div className="relative shrink-0">
                  <div className={`flex size-14 sm:size-16 items-center justify-center rounded-2xl border shadow-sm ${node.iconColor}`}>
                    <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {i < FLOW_NODES.length - 1 && (
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex size-5 items-center justify-center rounded-full bg-white border border-[#8B6B4A]/20 text-[#0D9488] shadow-xs">
                      <ArrowDown className="size-3" />
                    </div>
                  )}
                </div>

                {/* Node Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0D9488]">
                      {node.step}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${node.badgeColor}`}>
                      {node.category}
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-lg font-bold text-[#2D2118] group-hover:text-[#0D9488] transition-colors">
                    {node.title}
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#5E4837] leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
