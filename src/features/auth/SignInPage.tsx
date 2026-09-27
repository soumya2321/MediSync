import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  KeyRound,
  Mail,
  ShieldCheck,
  Stethoscope,
  Store,
  UserCheck,
  Users,
} from 'lucide-react';
import { homeRouteFor } from '@shared/domain/permissions.ts';
import { signInSchema, type SignInInput } from '@shared/schemas/index.ts';
import { MFA_REQUIRED_ROLES, type Role } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Logo } from '@/components/ui/Layout';
import { ApiError, authService, friendlyMessage } from '@/services';
import { DEMO_MFA_CODE, DEMO_PASSWORD } from '@/mocks/data/fixtures';
import { BotanicalSprays, CadabraTabletPreview, LeafCornerSpray } from '@/components/ui/BotanicalMotifs';
import { FormAlert, PasswordInput, safeNext } from './auth-shared';

const BANNERS: { param: string; value: string; tone: 'info' | 'success' | 'warning'; text: string }[] = [
  { param: 'reason', value: 'idle', tone: 'info', text: 'You were signed out after 15 minutes of inactivity.' },
  { param: 'reason', value: 'removed', tone: 'warning', text: 'Your access was removed. Contact your admin.' },
  { param: 'verified', value: '1', tone: 'success', text: 'Email verified — you can sign in now.' },
  { param: 'reset', value: '1', tone: 'success', text: 'Password updated. Sign in with your new password.' },
];

interface PersonaItem {
  id: string;
  name: string;
  initials: string;
  role: Role;
  roleTitle: string;
  orgName: string;
  email: string;
  colorType: 'teal' | 'coral';
  mfaEnrolled: boolean;
}

interface PersonaGroup {
  id: string;
  title: string;
  badge: string;
  icon: typeof Stethoscope;
  colorType: 'teal' | 'coral';
  personas: PersonaItem[];
}

const PERSONA_GROUPS: PersonaGroup[] = [
  {
    id: 'practice-admin',
    title: 'Practice Admin',
    badge: '2 accounts',
    icon: Building2,
    colorType: 'teal',
    personas: [
      {
        id: 'u-soumya',
        name: 'Soumya Sahu',
        initials: 'SS',
        role: 'practice_admin',
        roleTitle: 'Practice admin',
        orgName: 'PeopleTree Family Medicine',
        email: 'sahukarsoumya6@gmail.com',
        colorType: 'teal',
        mfaEnrolled: true,
      },
      {
        id: 'u-admin',
        name: 'Riya Kapoor',
        initials: 'RK',
        role: 'practice_admin',
        roleTitle: 'Practice admin',
        orgName: 'PeopleTree Family Medicine',
        email: 'admin@lakeside.example.com',
        colorType: 'teal',
        mfaEnrolled: true,
      },
    ],
  },
  {
    id: 'provider',
    title: 'Provider',
    badge: '2 accounts',
    icon: Stethoscope,
    colorType: 'teal',
    personas: [
      {
        id: 'u-rao',
        name: 'Dr. Arjun Verma',
        initials: 'AV',
        role: 'provider',
        roleTitle: 'Provider',
        orgName: 'PeopleTree Family Medicine',
        email: 'dr.verma@lakeside.example.com',
        colorType: 'teal',
        mfaEnrolled: true,
      },
      {
        id: 'u-chen',
        name: 'Dr. Sneha Nair',
        initials: 'SN',
        role: 'provider',
        roleTitle: 'Provider',
        orgName: 'PeopleTree Family Medicine',
        email: 'dr.nair@lakeside.example.com',
        colorType: 'teal',
        mfaEnrolled: true,
      },
    ],
  },
  {
    id: 'practice-staff',
    title: 'Practice Staff',
    badge: '2 accounts',
    icon: Users,
    colorType: 'teal',
    personas: [
      {
        id: 'u-jordan',
        name: 'Aarav Patel',
        initials: 'AP',
        role: 'practice_staff',
        roleTitle: 'Practice staff',
        orgName: 'PeopleTree Family Medicine',
        email: 'staff@lakeside.example.com',
        colorType: 'teal',
        mfaEnrolled: false,
      },
      {
        id: 'u-sam',
        name: 'Meera Kulkarni',
        initials: 'MK',
        role: 'practice_staff',
        roleTitle: 'Practice staff',
        orgName: 'PeopleTree Family Medicine',
        email: 'ma@lakeside.example.com',
        colorType: 'teal',
        mfaEnrolled: false,
      },
    ],
  },
  {
    id: 'pharmacy-admin',
    title: 'Pharmacy Admin',
    badge: '1 account',
    icon: Store,
    colorType: 'coral',
    personas: [
      {
        id: 'u-lena',
        name: 'Rahul Patel',
        initials: 'RP',
        role: 'pharmacy_admin',
        roleTitle: 'Pharmacy admin',
        orgName: 'CityCare Pharmacy',
        email: 'admin@citycare.example.com',
        colorType: 'coral',
        mfaEnrolled: true,
      },
    ],
  },
  {
    id: 'pharmacy-staff',
    title: 'Pharmacy Staff',
    badge: '2 accounts',
    icon: UserCheck,
    colorType: 'coral',
    personas: [
      {
        id: 'u-omar',
        name: 'Ishaan Khanna',
        initials: 'IK',
        role: 'pharmacy_staff',
        roleTitle: 'Pharmacy staff',
        orgName: 'CityCare Pharmacy',
        email: 'tech@citycare.example.com',
        colorType: 'coral',
        mfaEnrolled: false,
      },
      {
        id: 'u-grace',
        name: 'Dr. Divya Prasad, PharmD',
        initials: 'DP',
        role: 'pharmacy_staff',
        roleTitle: 'Pharmacy staff',
        orgName: 'GreenLeaf Pharmacy',
        email: 'rph@greenleaf.example.com',
        colorType: 'coral',
        mfaEnrolled: false,
      },
    ],
  },
];

export default function SignInPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const next = safeNext(params.get('next'));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  // Already signed in (and past any required MFA) → go straight to dashboard/home.
  if (user && (!MFA_REQUIRED_ROLES.includes(user.role) || user.aal === 'aal2')) {
    return <Navigate to={next ?? homeRouteFor(user.role)} replace />;
  }

  const onSubmit = async (values: SignInInput) => {
    setFormError(null);
    try {
      const result = await authService.signIn(values.email, values.password);
      if (result.status === 'signed_in') {
        refresh();
        const me = authService.currentUser();
        navigate(next ?? (me ? homeRouteFor(me.role) : '/'), { replace: true });
        return;
      }
      const mode = result.status === 'mfa_enroll' ? 'enroll' : 'verify';
      const qs = new URLSearchParams();
      if (next) qs.set('next', next);
      qs.set('mode', mode);
      navigate(`/mfa?${qs.toString()}`, { replace: true });
    } catch (e) {
      setFormError(e instanceof ApiError && e.code === 'UNAUTHENTICATED' ? 'Invalid email or password.' : friendlyMessage(e));
    }
  };

  const handleSelectPersona = (persona: PersonaItem) => {
    setFormError(null);
    setSelectedEmail(persona.email);
    setValue('email', persona.email, { shouldValidate: true, shouldDirty: true });
    setValue('password', DEMO_PASSWORD, { shouldValidate: true, shouldDirty: true });
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const banners = BANNERS.filter((b) => params.get(b.param) === b.value);

  return (
    <div className="relative min-h-screen bg-[#F8FAF9] text-[#1E293B] selection:bg-[#1A9E96]/20 selection:text-[#0C5852] font-sans">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed -top-32 right-[-10%] size-[620px] rounded-full bg-[#1A9E96]/10 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none fixed top-[40%] -left-[10%] size-[500px] rounded-full bg-[#FF9A62]/10 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[10%] size-[540px] rounded-full bg-[#98FF98]/12 blur-[140px]" aria-hidden="true" />

      {/* Main Split-Screen Container */}
      <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.15fr] xl:grid-cols-[1fr_1.22fr]">
        {/* =========================================================================
            LEFT PANEL: Branding, messaging & Cadabra tablet reference storytelling
        ========================================================================== */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0B5C55] via-[#0E7068] to-[#1A9E96] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14 border-r border-[#1A9E96]/30">
          {/* Subtle Decorative Botanical Leaf Sprays in Background */}
          <BotanicalSprays className="absolute -bottom-16 -left-16 size-[460px] opacity-25" />
          <BotanicalSprays className="absolute -top-20 -right-20 size-[420px] rotate-180 opacity-20" />
          <LeafCornerSpray className="absolute top-28 right-8 size-[260px] opacity-25" />

          {/* Glowing Ambient Radial Overlays */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full bg-[#98FF98]/15 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-[360px] rounded-full bg-[#FF9A62]/15 blur-3xl" aria-hidden="true" />

          {/* Top Brand Logo / Wordmark */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="inline-block rounded-xl focus:outline-hidden focus:ring-2 focus:ring-white/40">
              <Logo dark={true} />
            </Link>
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold text-[#E6F7F5] backdrop-blur-md border border-white/15">
              <ShieldCheck className="size-3.5 text-[#98FF98]" /> HIPAA Compliant
            </span>
          </div>

          {/* Hero Messaging Section */}
          <div className="relative z-10 my-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Required Exact Headline */}
              <h2 className="mt-4 text-[34px] font-display font-extrabold leading-[1.12] tracking-tight text-white xl:text-[42px]">
                No more refill ping-pong.{' '}
                <span className="block text-[#98FF98] drop-shadow-[0_0_24px_rgba(152,255,152,0.35)]">
                  No more blind spots.
                </span>
              </h2>

              {/* Required Exact Supporting Subtext */}
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#E6F7F5] font-medium xl:text-[16.5px]">
                MediSync keeps every stakeholder connected until the medication reaches the patient.
              </p>
            </motion.div>

            {/* Cadabra.Studio Reference Tablet Medical Card Recreation */}
            <div className="mt-8">
              <CadabraTabletPreview />
            </div>
          </div>

          {/* Bottom Security & Platform Badges */}
          <div className="relative z-10 border-t border-white/15 pt-5 text-[12px] font-medium text-white/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-[#98FF98]" /> Single Source of Truth
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-[#98FF98]" /> SOC2 Type II Certified
                </span>
              </div>
              <span className="text-white/60">Tablet-Optimized · Live Sync</span>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT PANEL: Responsive Login Form & Prototype Role-Picker Cards
        ========================================================================== */}
        <main className="relative flex min-h-screen flex-col justify-between overflow-x-hidden px-4 py-6 sm:px-8 lg:px-12 xl:px-16">
          {/* Subtle Decorative Foliage on Right Screen */}
          <BotanicalSprays className="absolute -bottom-24 right-[-5%] size-[380px] opacity-15 hidden sm:block" />
          <LeafCornerSpray className="absolute top-2 right-4 size-[180px] opacity-20 hidden md:block" />

          {/* Mobile/Tablet Top Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link to="/" className="lg:hidden rounded-xl focus:outline-hidden">
              <Logo dark={false} />
            </Link>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-[12.5px] font-bold text-[#1A9E96] shadow-xs backdrop-blur-md transition-all hover:bg-white hover:border-[#1A9E96]/40 hover:shadow-sm"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to overview
            </Link>
          </div>

          {/* Central Workspace Container */}
          <div className="relative z-10 mx-auto my-auto w-full max-w-4xl py-6 sm:py-8">
            {/* Card-style Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-[500px] rounded-[28px] border border-white/90 bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(26,158,150,0.08)] backdrop-blur-md"
            >
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-[28px] font-display font-extrabold tracking-tight text-[#1E293B]">
                  Sign in
                </h1>
                <p className="mt-1.5 text-sm text-[#64748B] font-medium">
                  Enter your credentials or choose a prototype persona below to test.
                </p>
              </div>

              {/* Form Banners */}
              {banners.map((b) => (
                <div key={b.text} className="mb-4">
                  <FormAlert tone={b.tone}>{b.text}</FormAlert>
                </div>
              ))}
              {formError && (
                <div className="mb-4">
                  <FormAlert tone="error">{formError}</FormAlert>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="doctor@peopletree.example.com"
                  leading={<Mail className="size-4 text-[#1A9E96]" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <PasswordInput
                  label="Password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  error={errors.password?.message}
                  labelAction={
                    <Link
                      to="/forgot-password"
                      className="text-[12.5px] font-semibold text-[#1A9E96] underline-offset-2 hover:underline hover:text-[#0C5852]"
                    >
                      Forgot password?
                    </Link>
                  }
                  {...register('password')}
                />

                {/* Primary Continue Button (styled like reference CTA in teal) */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="glow"
                    className="w-full rounded-2xl py-3.5 bg-gradient-to-r from-[#1A9E96] via-[#14B8A6] to-[#0D9488] hover:from-[#15857F] hover:to-[#0C5852] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(26,158,150,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                    loading={isSubmitting}
                    aria-label="Sign in"
                    icon={<ArrowRight className="size-4 text-white" aria-hidden="true" />}
                  >
                    Continue
                  </Button>
                </div>
              </form>

              {/* New Org Signup Footer */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center text-[13px] font-medium text-[#64748B]">
                New organisation?{' '}
                <Link to="/sign-up" className="font-bold text-[#1A9E96] hover:underline">
                  Create an account
                </Link>
              </div>
            </motion.div>

            {/* =====================================================================
                "SELECT YOUR ACCOUNT" ROLE-PICKER SECTION
                Side-by-side responsive grid layout per user requirement
            ====================================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 rounded-[28px] border border-white/90 bg-white/95 p-5 sm:p-7 shadow-[0_16px_40px_rgba(26,158,150,0.06)] backdrop-blur-md"
            >
              {/* Role-Picker Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#1A9E96]">
                    Select your account
                  </h2>
                  <p className="text-[12px] text-[#64748B] font-medium">
                    Pick any persona below to auto-fill credentials and test workflow permissions
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-[#F0FAF9] px-3 py-1 text-[11.5px] font-bold text-[#1A9E96] border border-[#1A9E96]/20">
                  <KeyRound className="size-3.5 text-[#1A9E96]" aria-hidden="true" />
                  MFA Code: <span className="font-mono text-[#0C5852] font-extrabold">{DEMO_MFA_CODE}</span>
                </div>
              </div>

              {/* Side-by-Side Responsive Grid Container */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PERSONA_GROUPS.map((group) => {
                  const isCollapsed = collapsedGroups[group.id] ?? false;
                  const GroupIcon = group.icon;
                  const isTeal = group.colorType === 'teal';

                  return (
                    <div
                      key={group.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-[#FCFDFD] shadow-2xs transition-all hover:border-[#1A9E96]/35 hover:shadow-xs"
                    >
                      {/* Labeled Role Group Header (Collapsible / Sticky) */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors border-b border-slate-100/80 ${
                          isTeal ? 'bg-[#F0FAF9]/80 hover:bg-[#E8F7F5]' : 'bg-[#FFF7F4]/90 hover:bg-[#FFEFEA]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex size-6 items-center justify-center rounded-lg text-white shadow-2xs ${
                              isTeal ? 'bg-[#1A9E96]' : 'bg-[#FF7A59]'
                            }`}
                          >
                            <GroupIcon className="size-3.5" />
                          </span>
                          <span className="text-[13px] font-bold text-[#1E293B]">{group.title}</span>
                          <span className="text-[11px] font-semibold text-[#64748B]">({group.badge})</span>
                        </div>
                        <ChevronDown
                          className={`size-4 text-[#64748B] transition-transform duration-200 ${
                            isCollapsed ? '-rotate-90' : 'rotate-0'
                          }`}
                        />
                      </button>

                      {/* Personas in Group */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="divide-y divide-slate-100 p-1.5 flex-1"
                          >
                            {group.personas.map((persona) => {
                              const isSelected = selectedEmail === persona.email;
                              return (
                                <button
                                  key={persona.id}
                                  type="button"
                                  onClick={() => handleSelectPersona(persona)}
                                  className={`group flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left transition-all duration-200 hover:bg-white hover:shadow-xs ${
                                    isSelected
                                      ? 'bg-white ring-2 ring-[#1A9E96]/35 border border-[#1A9E96]/50 shadow-xs'
                                      : 'border border-transparent hover:border-slate-200'
                                  }`}
                                >
                                  {/* Circular Avatar with Colored Role Initials */}
                                  <div
                                    className={`relative flex size-8 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold text-white shadow-xs ${
                                      isTeal
                                        ? 'bg-gradient-to-br from-[#1A9E96] to-[#14B8A6]'
                                        : 'bg-gradient-to-br from-[#FF7A59] to-[#FFA07A]'
                                    }`}
                                  >
                                    {persona.initials}
                                    {isSelected && (
                                      <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-white text-[#1A9E96] shadow-2xs border border-[#1A9E96]/30">
                                        <Check className="size-2.5 stroke-[3]" />
                                      </span>
                                    )}
                                  </div>

                                  {/* Name & Role Details */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                      <span className="truncate text-[13px] font-bold text-[#1E293B] group-hover:text-[#1A9E96] transition-colors">
                                        {persona.name}
                                      </span>
                                      {persona.mfaEnrolled && (
                                        <span
                                          className="text-[9.5px] font-extrabold uppercase text-[#1A9E96] bg-[#E8F8F6] px-1 py-0.2 rounded-xs"
                                          title="MFA Enabled"
                                        >
                                          MFA
                                        </span>
                                      )}
                                    </div>
                                    <p className="truncate text-[11.5px] text-[#64748B] font-medium leading-tight mt-0.5">
                                      {persona.roleTitle} · {persona.orgName}
                                    </p>
                                  </div>

                                  {/* Action Indicator */}
                                  <div className="shrink-0 text-slate-300 group-hover:text-[#1A9E96] transition-colors">
                                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Bottom Disclaimers */}
          <footer className="relative z-10 py-3 text-center text-[12px] text-[#94A3B8] font-medium">
            Synthetic demo environment · PeopleTree Family Medicine & CityCare Network · Not for real PHI
          </footer>
        </main>
      </div>
    </div>
  );
}
