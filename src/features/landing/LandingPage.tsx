import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  Bot,
  Building2,
  CalendarClock,
  ChevronRight,
  Fingerprint,
  Inbox,
  Layers,
  PackageCheck,
  RefreshCcw,
  ScanText,
  Search,
  ShieldAlert,
  Stethoscope,
  Workflow,
} from 'lucide-react';
import { Logo } from '@/components/ui/Layout';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/format';
import { HeroMock } from './HeroMock';
import { fadeUp, RevealGroup, SectionHeading, stagger, Eyebrow } from './landing-ui';
import { PilotForm } from './PilotForm';
import { RoiCalculator } from './RoiCalculator';
import { RefillJourneyDiagram } from './RefillJourneyDiagram';
import { SharedCaseDiagram } from './SharedCaseDiagram';
import { ProcessLifecycleDiagram } from './ProcessLifecycleDiagram';

const NAV = [
  ['Problem', '#problem'],
  ['Solution', '#solution'],
  ['Users', '#users'],
  ['Workflow', '#how-it-works'],
  ['Intelligence', '#intelligence'],
  ['GTM', '#gtm'],
  ['Metrics', '#metrics'],
  ['ROI', '#roi'],
  ['Pricing', '#pricing'],
] as const;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F0E6] text-[#2D2118] selection:bg-[#93C572]/40 selection:text-[#1E4D2B]">
      {/* Cadabra Medical ambient lighting & soft organic botanical glows */}
      <div className="pointer-events-none fixed -top-36 right-[-8%] size-[640px] rounded-full bg-[#98FF98]/25 blur-[130px]" aria-hidden />
      <div className="pointer-events-none fixed top-[30%] -left-[10%] size-[580px] rounded-full bg-[#93C572]/20 blur-[130px]" aria-hidden />
      <div className="pointer-events-none fixed top-[60%] right-[-5%] size-[620px] rounded-full bg-[#D8A7B1]/30 blur-[140px]" aria-hidden />
      <div className="pointer-events-none fixed bottom-[-10%] left-[10%] size-[600px] rounded-full bg-[#98FF98]/20 blur-[140px]" aria-hidden />

      {/* Decorative leaf motifs inspired by Cadabra Medical Design */}
      <svg className="pointer-events-none fixed top-24 right-4 h-96 w-96 text-[#93C572]/15 -rotate-12 select-none" viewBox="0 0 200 200" fill="currentColor" aria-hidden>
        <path d="M40,160 Q70,40 160,40 Q130,160 40,160 Z" />
        <path d="M40,160 Q100,100 160,40" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
      </svg>
      <svg className="pointer-events-none fixed bottom-32 -left-12 h-[420px] w-[420px] text-[#D8A7B1]/20 rotate-45 select-none" viewBox="0 0 200 200" fill="currentColor" aria-hidden>
        <path d="M30,170 Q60,30 170,30 Q140,170 30,170 Z" />
      </svg>

      {/* Header — transparent initially, transitions to glass blur on scroll */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-[#8B6B4A]/15 bg-[#F5F0E6]/90 backdrop-blur-2xl shadow-[0_4px_24px_rgba(139,107,74,0.06)]'
            : 'border-b border-transparent bg-transparent shadow-none',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="MediSync home" className="flex items-center gap-2">
            <Logo dark={false} />
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Sections">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="text-xs font-semibold uppercase tracking-wider text-[#5E4837] transition hover:text-[#0D9488]">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link to="/patient-status" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] bg-[#93C572]/15 px-3 py-1.5 rounded-full border border-[#93C572]/40 hover:bg-[#93C572]/25 transition">
              <Search className="size-3.5" />
              Patient Status
            </Link>
            <Link to="/sign-in" className="hidden sm:block">
              <button className="h-9 px-4 rounded-xl text-xs font-bold text-[#2D2118] bg-white/80 border border-[#8B6B4A]/25 shadow-sm hover:bg-white transition">
                Sign in
              </button>
            </Link>
            <Link to="/sign-in">
              <button className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] shadow-[0_4px_16px_rgba(13,148,136,0.3)] hover:brightness-105 transition flex items-center gap-1.5">
                View Demo
                <ArrowRight className="size-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* =========================================================================
            HERO SECTION (Apple-style Zoom-out Animation & Animated Workflow Line)
           ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <motion.div
            initial={{ scale: 1.15, opacity: 0.8 }}
            animate={{ scale: 1.0, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-7xl px-4 sm:px-6"
          >
            {/* Refill Journey Diagram (Continuous Pulsing Flow & Animated Connectors) */}
            <div className="mb-12">
              <RefillJourneyDiagram />
            </div>

            {/* Hero Main Grid */}
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
              <motion.div initial="hidden" animate="show" variants={stagger(0.1, 0.05)}>
                <motion.div variants={fadeUp}>
                  <Eyebrow>MediSync · Refill Coordination Platform</Eyebrow>
                </motion.div>
                <motion.h1 variants={fadeUp} className="mt-4 text-[44px] leading-[1.04] tracking-tight sm:text-[64px] font-extrabold text-[#2D2118]">
                  Closing the
                  <br />
                  <span className="bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] bg-clip-text text-transparent">
                    Prescription Refill Gap
                  </span>
                </motion.h1>
                <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#5E4837]">
                  When provider intervention is required, prescription refills often stall across pharmacies, providers, practice staff, insurance systems, and patients. MediSync creates{' '}
                  <strong className="font-bold text-[#0D9488]">one shared workflow</strong> that identifies blockers, assigns ownership, coordinates actions, and keeps everyone informed until the refill is resolved.
                </motion.p>
                <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link to="/sign-in">
                    <button className="h-12 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] shadow-[0_8px_24px_rgba(13,148,136,0.35)] hover:brightness-105 active:scale-[0.99] transition flex items-center gap-2">
                      View Demo
                      <ArrowRight className="size-4" />
                    </button>
                  </Link>
                  <a href="#how-it-works">
                    <button className="h-12 px-6 rounded-2xl text-sm font-bold text-[#2D2118] bg-white/90 border border-white/80 shadow-[0_4px_16px_rgba(139,107,74,0.08)] hover:bg-white transition flex items-center gap-2">
                      Explore Workflow
                      <Workflow className="size-4 text-[#0D9488]" />
                    </button>
                  </a>
                  <a href="#pilot" className="text-sm font-semibold text-[#8B6B4A] hover:text-[#0D9488] px-2 py-1 transition">
                    Request a Pilot →
                  </a>
                </motion.div>
                <motion.div variants={fadeUp} className="mt-8 flex items-start gap-3 text-xs sm:text-sm text-[#8B6B4A]">
                  <ArrowDownRight className="mt-0.5 size-4 text-[#0D9488] shrink-0" aria-hidden />
                  <p className="max-w-md font-medium leading-relaxed">
                    Designed for <strong className="text-[#2D2118]">physician groups &amp; pharmacy networks</strong> to eliminate medication abandonment and refill ping-pong.
                  </p>
                </motion.div>
              </motion.div>

              {/* Cadabra Hero Mock Tablet Component */}
              <HeroMock />
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            THE PROBLEM: Why Refills Get Stuck (6 Premium Cards)
           ========================================================================= */}
        <section id="problem" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="problem-h">
          <SectionHeading
            id="problem-h"
            eyebrow="The Problem"
            light="Why Refills"
            bold="Get Stuck"
            lede="When a refill request requires provider authorization, it enters an uncoordinated labyrinth across five disparate silos."
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                num: '01',
                title: 'No Refills Remaining',
                desc: 'Expired prescription or zero authorized refills remaining. The pharmacy cannot dispense without physician reauthorization.',
                icon: RefreshCcw,
                accent: 'border-[#93C572]/40 text-[#1E4D2B] bg-[#93C572]/15',
              },
              {
                num: '02',
                title: 'Provider Approval Required',
                desc: 'Dosage adjustments, therapeutic substitution, or medical director sign-off required prior to releasing the maintenance therapy.',
                icon: Stethoscope,
                accent: 'border-[#0D9488]/40 text-[#0F5143] bg-[#0D9488]/15',
              },
              {
                num: '03',
                title: 'Patient Visit Needed',
                desc: 'Annual wellness exam overdue, chronic care checkup needed, or monitoring appointment required before continuing medications.',
                icon: CalendarClock,
                accent: 'border-[#D8A7B1]/50 text-[#6B2E38] bg-[#D8A7B1]/20',
              },
              {
                num: '04',
                title: 'Missing Information',
                desc: 'Illegible faxes, missing prescriber NPI, unclear SIG instructions, missing quantity, or omitted diagnosis codes stalling fulfillment.',
                icon: ScanText,
                accent: 'border-[#8B6B4A]/35 text-[#543825] bg-[#8B6B4A]/15',
              },
              {
                num: '05',
                title: 'Clinical Review Required',
                desc: 'Overdue surveillance bloodwork (e.g. HbA1c, eGFR, liver enzymes) or drug-drug interaction alerts requiring provider judgment.',
                icon: AlertCircle,
                accent: 'border-[#D8A7B1]/50 text-[#6B2E38] bg-[#D8A7B1]/20',
              },
              {
                num: '06',
                title: 'Insurance Blockers',
                desc: 'Prior authorization required, formulary tier exclusion, or step therapy protocol requirements standing between patient and medication.',
                icon: ShieldAlert,
                accent: 'border-[#93C572]/40 text-[#1E4D2B] bg-[#93C572]/15',
              },
            ].map((card) => (
              <motion.div
                key={card.num}
                variants={fadeUp}
                className="cadabra-glass-card cadabra-glass-card-hover p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.07)] relative group"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex size-12 items-center justify-center rounded-2xl border shadow-sm ${card.accent}`}>
                    <card.icon className="size-6" />
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8B6B4A]">{card.num}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#2D2118] group-hover:text-[#0D9488] transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5E4837]">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </RevealGroup>

          {/* Bottom Insight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 cadabra-glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#D8A7B1]/60 bg-gradient-to-r from-white/90 via-[#F5F0E6]/90 to-white/90 shadow-[0_20px_48px_rgba(139,107,74,0.08)] flex flex-col sm:flex-row items-center gap-5"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#D8A7B1]/25 border border-[#D8A7B1]/50 text-[#6B2E38]">
              <AlertCircle className="size-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B2E38]">
                Critical Healthcare Insight
              </p>
              <blockquote className="mt-1 text-base sm:text-lg font-semibold text-[#2D2118] leading-snug">
                &ldquo;No single participant has complete visibility. Patients only know one thing: they still don't have their medication.&rdquo;
              </blockquote>
            </div>
          </motion.div>

          {/* Illustrative Baseline Stats with Number Reveal */}
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
            <motion.div variants={fadeUp} className="cadabra-glass-card p-6 rounded-3xl border border-white/90 shadow-[0_12px_32px_rgba(139,107,74,0.06)] text-center sm:text-left">
              <p className="font-display text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] bg-clip-text text-transparent">
                3–5 days
              </p>
              <p className="mt-2 text-sm font-medium text-[#5E4837]">a typical stall when a provider is needed</p>
            </motion.div>
            <motion.div variants={fadeUp} className="cadabra-glass-card p-6 rounded-3xl border border-white/90 shadow-[0_12px_32px_rgba(139,107,74,0.06)] text-center sm:text-left">
              <p className="font-display text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] bg-clip-text text-transparent">
                <AnimatedCounter value={6} suffix="+" /> hand-offs
              </p>
              <p className="mt-2 text-sm font-medium text-[#5E4837]">between four parties for one refill</p>
            </motion.div>
            <motion.div variants={fadeUp} className="cadabra-glass-card p-6 rounded-3xl border border-white/90 shadow-[0_12px_32px_rgba(139,107,74,0.06)] text-center sm:text-left">
              <p className="font-display text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] bg-clip-text text-transparent">
                <AnimatedCounter value={0} />
              </p>
              <p className="mt-2 text-sm font-medium text-[#5E4837]">shared view of who acts next</p>
            </motion.div>
          </RevealGroup>
        </section>

        {/* =========================================================================
            WHAT PROBLEM ARE WE SOLVING? (Hackathon Core Question)
           ========================================================================= */}
        <section id="solution" className="relative border-y border-[#8B6B4A]/15 bg-white/40 py-24 backdrop-blur-sm" aria-labelledby="sol-h">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              id="sol-h"
              eyebrow="Hackathon Challenge Question"
              light="What Problem"
              bold="Are We Solving?"
              lede="The real bottleneck is not missing software. Pharmacies, providers, EHRs, and insurers already have systems."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="cadabra-glass-card p-7 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.08)]">
                  <h3 className="text-xl font-bold text-[#2D2118]">
                    The Core Dilemma
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#5E4837]">
                    The actual problem is that <strong className="text-[#0D9488] font-bold">nobody owns the refill journey across organizations</strong>. Refill tasks get passed through faxes and portals without a singular orchestrator, leading to constant drop-offs.
                  </p>
                </div>

                <div className="cadabra-glass-card p-7 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.08)]">
                  <h3 className="text-xl font-bold text-[#2D2118]">
                    MediSync Introduces a Shared Refill Case
                  </h3>
                  <p className="mt-2 text-sm text-[#5E4837]">
                    Instead of disjointed communications, MediSync unifies the entire lifecycle into a single active case:
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      'One source of truth across EHR, pharmacy, and clinic',
                      'One assigned owner at every minute of the workflow',
                      'One next action with automated SLA countdown',
                      'One timeline visible to all clinical and administrative staff',
                      'Complete visibility for the patient through plain-language tracking',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-[#2D2118]">
                        <span className="size-2 rounded-full bg-[#0D9488] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="rounded-3xl bg-gradient-to-br from-[#0F5143] via-[#115E59] to-[#0D9488] p-8 sm:p-10 text-white shadow-[0_24px_60px_rgba(13,148,136,0.3)] border border-[#98FF98]/30">
                  <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#98FF98] border border-white/20">
                    The Concrete Result
                  </span>
                  <h3 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold text-white">
                    No More Refill Ping-Pong.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/90 font-medium">
                    When every stakeholder shares the same state machine, requests stop bouncing. Refills are either approved, scheduled for a visit, or redirected with complete accountability.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4 border border-white/15">
                      <p className="text-2xl font-extrabold text-[#98FF98]">
                        <AnimatedCounter value={100} suffix="%" />
                      </p>
                      <p className="text-xs text-white/80 mt-1 font-medium">Accountable Ownership</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 border border-white/15">
                      <p className="text-2xl font-extrabold text-[#98FF98]">
                        <AnimatedCounter value={0} />
                      </p>
                      <p className="text-xs text-white/80 mt-1 font-medium">Lost Fax Inquiries</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Shared Case Diagram (Traditional Disconnected vs MediSync Hub-and-Spoke Single Source of Truth) */}
            <div className="mt-14">
              <SharedCaseDiagram />
            </div>
          </div>
        </section>

        {/* =========================================================================
            WHO IS THE PRIMARY CUSTOMER? (Hackathon Question)
           ========================================================================= */}
        <section id="users" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="users-h">
          <SectionHeading
            id="users-h"
            eyebrow="Who Is The Primary Customer?"
            light="Who Uses"
            bold="MediSync?"
            lede="Designed specifically for the multi-disciplinary healthcare teams handling daily prescription volume."
          />

          {/* Kite / Diamond Formation Layout */}
          <div className="relative mx-auto mt-14 max-w-5xl py-4">
            {/* SVG Diamond Connection Lines (Desktop / Tablet) */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full stroke-[#1A9E96]/30 hidden md:block"
              viewBox="0 0 800 640"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Outer Diamond Rhombus Perimeter */}
              <polygon
                points="400,80 710,320 400,560 90,320"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="opacity-70"
              />
              {/* Internal Cross Lines to Center */}
              <line x1="400" y1="80" x2="400" y2="560" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />
              <line x1="90" y1="320" x2="710" y2="320" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />
            </svg>

            {/* Top Node: Practice Admin (Primary Customer) */}
            <div className="relative z-10 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-[340px] sm:max-w-[380px] cadabra-glass-card cadabra-glass-card-hover p-6 rounded-3xl border-2 border-[#0D9488]/40 shadow-[0_20px_48px_rgba(13,148,136,0.12)] bg-white/95"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border shadow-sm border-[#0D9488]/40 bg-[#0D9488]/10 text-[#0F5143]">
                    <Building2 className="size-6" />
                  </span>
                  <span className="rounded-full bg-[#0D9488]/15 border border-[#0D9488]/30 px-3 py-1 text-xs font-bold text-[#0D9488]">
                    Primary Customer
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#2D2118]">Practice Admin</h3>
                <ul className="mt-3.5 space-y-2 text-sm font-semibold text-[#5E4837]">
                  {['Operations visibility', 'Team management', 'SLA monitoring'].map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#0D9488]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Middle Row: Provider (Left), Central Diamond Hub, Pharmacy Admin (Right) */}
            <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* Left: Provider (Clinical Reviewer) */}
              <div className="flex justify-center md:justify-end">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full max-w-[340px] sm:max-w-[380px] cadabra-glass-card cadabra-glass-card-hover p-6 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.07)] bg-white/95"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl border shadow-sm border-[#93C572]/50 bg-[#93C572]/20 text-[#1E4D2B]">
                      <Stethoscope className="size-6" />
                    </span>
                    <span className="rounded-full bg-[#93C572]/20 border border-[#93C572]/40 px-3 py-1 text-xs font-bold text-[#1E4D2B]">
                      Clinical Reviewer
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#2D2118]">Provider</h3>
                  <ul className="mt-3.5 space-y-2 text-sm font-semibold text-[#5E4837]">
                    {['Clinical review', 'Approvals & step-up MFA', 'Visit requirements'].map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#93C572]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Center Diamond Connector Hub */}
              <div className="hidden md:flex flex-col items-center justify-center px-2">
                <div className="relative flex size-20 items-center justify-center rotate-45 rounded-3xl bg-gradient-to-br from-[#1A9E96] via-[#0D9488] to-[#0F5143] text-white shadow-[0_12px_32px_rgba(26,158,150,0.35)] border-2 border-white/90 transition-transform duration-300 hover:scale-105">
                  <div className="-rotate-45 flex flex-col items-center text-center">
                    <Workflow className="size-6 text-[#98FF98]" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-white mt-0.5">HUB</span>
                  </div>
                </div>
              </div>

              {/* Right: Pharmacy Admin (Secondary Customer) */}
              <div className="flex justify-center md:justify-start">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full max-w-[340px] sm:max-w-[380px] cadabra-glass-card cadabra-glass-card-hover p-6 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.07)] bg-white/95"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl border shadow-sm border-[#8B6B4A]/40 bg-[#8B6B4A]/15 text-[#543825]">
                      <PackageCheck className="size-6" />
                    </span>
                    <span className="rounded-full bg-[#8B6B4A]/15 border border-[#8B6B4A]/30 px-3 py-1 text-xs font-bold text-[#8B6B4A]">
                      Secondary Customer
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#2D2118]">Pharmacy Admin</h3>
                  <ul className="mt-3.5 space-y-2 text-sm font-semibold text-[#5E4837]">
                    {['Refill oversight', 'Pharmacy performance', 'Prescription tracking'].map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#8B6B4A]" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Bottom Node: Pharmacy Staff (Care Partner) */}
            <div className="relative z-10 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-[340px] sm:max-w-[380px] cadabra-glass-card cadabra-glass-card-hover p-6 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.07)] bg-white/95"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border shadow-sm border-[#D8A7B1]/60 bg-[#D8A7B1]/25 text-[#632935]">
                    <Inbox className="size-6" />
                  </span>
                  <span className="rounded-full bg-[#D8A7B1]/25 border border-[#D8A7B1]/40 px-3 py-1 text-xs font-bold text-[#632935]">
                    Care Partner
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#2D2118]">Pharmacy Staff</h3>
                <ul className="mt-3.5 space-y-2 text-sm font-semibold text-[#5E4837]">
                  {['Request submission', 'Status updates', 'Patient communication'].map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#D8A7B1]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Highlight Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 cadabra-glass-card p-6 sm:p-7 rounded-3xl border border-[#93C572]/50 bg-gradient-to-r from-[#93C572]/15 via-white/80 to-[#98FF98]/20 shadow-[0_16px_36px_rgba(139,107,74,0.08)] grid gap-4 sm:grid-cols-2"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#0D9488] text-white">
                <Building2 className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">Primary Customer</p>
                <p className="text-base font-extrabold text-[#2D2118]">Physician Groups &amp; Practice Teams</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#8B6B4A] text-white">
                <PackageCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B6B4A]">Secondary Customer</p>
                <p className="text-base font-extrabold text-[#2D2118]">Pharmacies &amp; Retail Dispensaries</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            HOW THE SYSTEM WORKS (Horizontal Process Diagram)
           ========================================================================= */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="how-h">
          <SectionHeading
            id="how-h"
            eyebrow="How MediSync Works"
            light="How MediSync"
            bold="Works"
            lede="An end-to-end horizontal process lifecycle ensuring no prescription refill is left in an unowned or stalled state."
          />

          <div className="mt-12">
            <ProcessLifecycleDiagram />
          </div>
        </section>

        {/* =========================================================================
            SYSTEM INTELLIGENCE (Hackathon State Machine)
           ========================================================================= */}
        <section id="intelligence" className="relative border-y border-[#8B6B4A]/15 bg-white/40 py-24 backdrop-blur-sm" aria-labelledby="intel-h">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              id="intel-h"
              eyebrow="System Intelligence"
              light="How The System"
              bold="Thinks"
              lede="A deterministic cognitive state machine continuously answering critical workflow questions at every step."
            />

            {/* Horizontal State Machine */}
            <div className="mt-12 overflow-x-auto pb-6 [scrollbar-width:none]">
              <div className="flex items-center gap-3 min-w-[980px]">
                {[
                  { q: "What's happening now?", d: 'Request ingested from pharmacy fax' },
                  { q: "What's missing?", d: 'Missing recent A1c diagnostic test' },
                  { q: "What's blocking progress?", d: 'Rule R7: Requires clinical lab review' },
                  { q: 'Who can resolve it?', d: 'Assigned: Primary Care Provider' },
                  { q: 'What should happen next?', d: 'Provider signs 30-day bridge + orders lab' },
                  { q: 'Did it happen?', d: 'Provider approved with step-up MFA' },
                  { q: "What's the new state?", d: 'Transmitted to pharmacy; awaiting fill' },
                ].map((node, i, arr) => (
                  <div key={i} className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="cadabra-glass-card p-5 rounded-3xl border border-white/90 shadow-[0_12px_28px_rgba(139,107,74,0.06)] w-[210px] shrink-0"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                        Node 0{i + 1}
                      </span>
                      <h4 className="mt-2 text-[14.5px] font-bold text-[#2D2118] leading-tight">
                        {node.q}
                      </h4>
                      <p className="mt-2 text-xs leading-snug text-[#5E4837] font-medium">
                        {node.d}
                      </p>
                    </motion.div>
                    {i < arr.length - 1 && (
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <ArrowRight className="size-4 text-[#0D9488] animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Triad Intelligence Architecture */}
            <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
              {[
                { icon: Layers, t: 'Rules decide', d: 'A deterministic state machine owns every transition. Predictable, 100% testable, and every single event records the exact Rule ID that caused it.' },
                { icon: Bot, t: 'AI assists', d: 'Reads messy faxes, extracts dosages, parses unstructured text, summarizes cases with source citations, and drafts patient status updates.' },
                { icon: Fingerprint, t: 'Humans approve', d: 'Providers execute every medication authorization with multi-factor authentication. Staff verify AI routing before dispatch.' },
              ].map((c) => (
                <motion.div key={c.t} variants={fadeUp} className="cadabra-glass-card p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_14px_36px_rgba(139,107,74,0.07)]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#93C572] text-white shadow-sm">
                    <c.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-[#2D2118]">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5E4837]">{c.d}</p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* =========================================================================
            GO TO MARKET (Hackathon Commercialization Funnel)
           ========================================================================= */}
        <section id="gtm" className="relative border-y border-[#8B6B4A]/15 bg-white/40 py-24 backdrop-blur-sm" aria-labelledby="gtm-h">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              id="gtm-h"
              eyebrow="Go To Market Strategy"
              light="How We Reach"
              bold="The Market"
              lede="A structured multi-tiered funnel targeting high-volume physician practices and ambulatory care centers."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                { stage: 'Awareness', action: 'Educational content & clinical delay studies', step: '01' },
                { stage: 'Prospect', action: 'Target physician groups & health networks', step: '02' },
                { stage: 'MOFU', action: 'Live interactive demos & ROI simulations', step: '03' },
                { stage: 'BOFU', action: '30-day baseline pilot programs', step: '04' },
                { stage: 'Close', action: 'Rapid practice onboarding in < 7 days', step: '05' },
                { stage: 'Customer Success', action: 'Outcome tracking & weekly SLA reports', step: '06' },
              ].map((funnel) => (
                <motion.div
                  key={funnel.stage}
                  variants={fadeUp}
                  className="cadabra-glass-card cadabra-glass-card-hover p-5 rounded-3xl border border-white/90 shadow-[0_12px_28px_rgba(139,107,74,0.06)] flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0D9488]">Stage {funnel.step}</span>
                    <h3 className="mt-2 text-lg font-bold text-[#2D2118]">{funnel.stage}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5E4837] font-medium">
                      {funnel.action}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-[#0D9488]">
                    <ChevronRight className="size-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SUCCESS METRICS (Animated Circular KPI Gauges)
           ========================================================================= */}
        <section id="metrics" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="metrics-h">
          <SectionHeading
            id="metrics-h"
            eyebrow="Success Metrics"
            light="Measurable"
            bold="Value"
            lede="Tangible clinical and operational benchmarks validated through automated case metrics."
          />

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                val: 48,
                suffix: 'h+',
                goal: 'Target < 48h Resolution',
                desc: 'Down from the 3–5 day average turnaround on complex prescriptions requiring provider judgment.',
              },
              {
                val: 30,
                suffix: '%',
                goal: 'Reduction in Refill Delays',
                desc: 'Proactive blocker identification catches missing labs and overdue visits on day zero.',
              },
              {
                val: 50,
                suffix: '%',
                goal: 'Fewer Manual Follow-Ups',
                desc: 'Eliminates repetitive inquiry calls and duplicate faxes between pharmacy and clinic.',
              },
              {
                val: 100,
                suffix: '%',
                goal: 'Case Visibility',
                desc: 'Every single hand-off, timestamp, and decision is recorded in an immutable, searchable log.',
              },
            ].map((kpi) => (
              <motion.div
                key={kpi.goal}
                variants={fadeUp}
                className="cadabra-glass-card cadabra-glass-card-hover p-7 rounded-3xl border border-white/90 shadow-[0_16px_40px_rgba(139,107,74,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F5F0E6] to-white border-2 border-white shadow-md mx-auto sm:mx-0">
                    <AnimatedCounter
                      value={kpi.val}
                      suffix={kpi.suffix}
                      className="text-2xl font-extrabold text-[#0D9488]"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#2D2118] text-center sm:text-left">
                    {kpi.goal}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5E4837] text-center sm:text-left">
                    {kpi.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </section>

        {/* =========================================================================
            RETURN ON INVESTMENT (Calculator)
           ========================================================================= */}
        <section id="roi" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="roi-h">
          <SectionHeading
            id="roi-h"
            eyebrow="Return On Investment"
            light="The Cost of"
            bold="Stuck Refills"
            lede="Plug in your practice's volume. Illustrative estimate — we validate it against your clinic's own baseline during the 30-day pilot."
          />
          <div className="mt-12">
            <RoiCalculator />
          </div>
        </section>

        {/* =========================================================================
            PRICING
           ========================================================================= */}
        <section id="pricing" className="relative border-y border-[#8B6B4A]/15 bg-white/40 py-24 backdrop-blur-sm" aria-labelledby="pricing-h">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading id="pricing-h" eyebrow="Pricing" light="Simple," bold="Per Provider" align="center" lede="Transparent and predictable pricing designed to scale with your healthcare organization." />
            <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
              {[
                { price: <AnimatedCounter value={149} prefix="$" />, unit: 'per provider / month', desc: 'Billed annually. Unlimited staff seats, patient portal queries, and refill cases.', popular: true },
                { price: 'Free', unit: 'for pharmacies', desc: 'Pharmacies join free to submit, view status, and transmit dispense confirmations.', popular: false },
                { price: <AnimatedCounter value={30} suffix=" days" />, unit: 'pilot program', desc: 'We measure your baseline turnaround first, then prove measurable improvement.', popular: false },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`cadabra-glass-card cadabra-glass-card-hover p-8 rounded-3xl text-center relative border transition-all duration-300 ${
                    item.popular
                      ? 'border-2 border-[#0D9488] shadow-[0_20px_50px_rgba(13,148,136,0.18)] scale-105 z-10'
                      : 'border-white/90 shadow-[0_14px_36px_rgba(139,107,74,0.06)]'
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0D9488] to-[#93C572] px-4 py-1 text-[11px] font-extrabold text-white shadow-sm uppercase tracking-wider">
                      Most popular
                    </span>
                  )}
                  <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#2D2118]">
                    {item.price}
                  </p>
                  <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-[#0D9488]">{item.unit}</p>
                  <p className="mt-4 text-xs sm:text-sm text-[#5E4837] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* =========================================================================
            REQUEST A PILOT
           ========================================================================= */}
        <section id="pilot" className="relative py-24" aria-labelledby="pilot-h">
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              id="pilot-h"
              eyebrow="Request a Pilot"
              light="Request a"
              bold="Pilot"
              lede="Kick-off on day 0, staff and pharmacy links live on day 1, operational in week 1. We deliver weekly value and SLA reports from then on."
            />
            <PilotForm />
          </div>
        </section>

        {/* =========================================================================
            FINAL CTA SECTION
           ========================================================================= */}
        <section className="relative overflow-hidden py-24 bg-gradient-to-br from-[#0F5143] via-[#115E59] to-[#0D9488] text-white">
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#98FF98] border border-white/20">
              Transform Refill Care Today
            </span>
            <h2 className="mt-6 font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop Refill Delays Before Patients Run Out of Medication
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-medium">
              MediSync transforms fragmented refill workflows into a coordinated, transparent, and measurable system.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="#pilot">
                <button className="h-12 px-8 rounded-2xl text-sm font-bold text-[#0F5143] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-[#F5F0E6] transition flex items-center gap-2">
                  Request Demo
                  <ArrowRight className="size-4" />
                </button>
              </a>
              <Link to="/sign-in">
                <button className="h-12 px-8 rounded-2xl text-sm font-bold text-white bg-white/20 border border-white/30 hover:bg-white/30 transition flex items-center gap-2">
                  View Case Workflow
                  <Workflow className="size-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#8B6B4A]/15 bg-[#F5F0E6] py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo dark={false} />
            <p className="mt-2 text-sm text-[#8B6B4A]">
              One shared case. One owner. One next step. The patient always knows.
            </p>
          </div>
          <div className="text-xs text-[#8B6B4A] sm:text-right">
            <p>Synthetic demo data only. Built for Hackathon showcase.</p>
            <div className="mt-2.5 flex flex-wrap gap-4 sm:justify-end font-semibold text-[#5E4837]">
              <Link to="/patient-status" className="hover:text-[#0D9488] transition-colors">
                Patient Status Tracker
              </Link>
              <Link to="/sign-in" className="hover:text-[#0D9488] transition-colors">
                Sign in
              </Link>
              <a href="#security" className="hover:text-[#0D9488] transition-colors">
                Security
              </a>
              <a href="#pilot" className="hover:text-[#0D9488] transition-colors">
                Request Pilot
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
