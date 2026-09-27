import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, CheckCircle2, ExternalLink, Mail, MailCheck, Pill, Stethoscope, UserRound } from 'lucide-react';
import { passwordIssues, signUpSchema } from '@shared/schemas/index.ts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { authService, friendlyMessage } from '@/services';
import { cn } from '@/lib/format';
import { AuthLayout } from './AuthLayout';
import { FormAlert, Honeypot, PasswordChecklist, PasswordInput, ResultPanel } from './auth-shared';

// The honeypot is checked server-side (silent neutral reply), so the form itself never blocks on it.
const formSchema = signUpSchema.innerType().extend({ website: z.string().optional() });
const schema = formSchema.superRefine((v, ctx) => {
  const issues = passwordIssues(v.password, { email: v.email, name: v.fullName });
  if (issues.length) ctx.addIssue({ code: 'custom', path: ['password'], message: issues[0] });
});
type FormValues = z.infer<typeof formSchema>;

const ORG_TYPES = [
  { value: 'practice', label: 'Physician practice', text: 'Review and approve refill requests.', icon: Stethoscope },
  { value: 'pharmacy', label: 'Pharmacy', text: 'Send requests and confirm receipt.', icon: Pill },
] as const;

export default function SignUpPage() {
  const [done, setDone] = useState<{ message: string; demoVerifyEmail?: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { orgName: '', orgType: 'practice', fullName: '', email: '', password: '', website: '' },
  });
  const [password, email, fullName, orgType] = watch(['password', 'email', 'fullName', 'orgType']);

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    try {
      setDone(await authService.signUp(values));
    } catch (e) {
      setFormError(friendlyMessage(e));
    }
  };

  return (
    <AuthLayout
      eyebrow="Start free"
      title={
        <>
          <span className="font-light">Create your</span> <span className="font-bold">organisation</span>
        </>
      }
      description={done ? undefined : 'Set up your practice or pharmacy. You can invite your team afterwards.'}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-[#0D9488] underline-offset-2 hover:underline hover:text-[#0F5143]">
            Sign in
          </Link>
        </>
      }
    >
      {done ? (
        <ResultPanel icon={<MailCheck className="size-7 text-[#0D9488]" aria-hidden />} title="Check your inbox">
          <p>{done.message}</p>
          {done.demoVerifyEmail && (
            <div className="mt-5 rounded-2xl border border-dashed border-[#0D9488]/40 bg-[#0D9488]/10 p-4 text-left">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0D9488]">Demo shortcut</p>
              <p className="mt-1 text-[13px] text-[#5E4837]">No real email is sent in the demo. Open the verification link directly:</p>
              <Link to={`/verify-email?email=${encodeURIComponent(done.demoVerifyEmail)}`} className="mt-3 block">
                <Button variant="glow" className="w-full" iconRight={<ExternalLink className="size-4" aria-hidden />}>
                  Demo: open verification link
                </Button>
              </Link>
            </div>
          )}
        </ResultPanel>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-4">
          {formError && <FormAlert tone="error">{formError}</FormAlert>}
          <Input label="Organisation name" autoComplete="organization" leading={<Building2 className="size-4" />} error={errors.orgName?.message} {...register('orgName')} />

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-bold text-[#2D2118]">Organisation type</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ORG_TYPES.map((t) => {
                const checked = orgType === t.value;
                return (
                  <label
                    key={t.value}
                    className={cn(
                      'relative flex cursor-pointer items-start gap-2.5 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-px has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#0D9488]/30',
                      checked ? 'border-[#0D9488] bg-[#0D9488]/10 shadow-xs' : 'border-[#8B6B4A]/20 bg-white/70 hover:border-[#0D9488]/40',
                    )}
                  >
                    <input type="radio" value={t.value} className="sr-only" {...register('orgType')} />
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors', checked ? 'bg-[#0D9488] text-white shadow-xs' : 'bg-white text-[#8B6B4A] border border-[#8B6B4A]/20')}>
                      <t.icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-bold text-[#2D2118]">{t.label}</span>
                      <span className="block text-[12px] leading-snug text-[#5E4837]">{t.text}</span>
                    </span>
                    {checked && <CheckCircle2 className="absolute right-2 top-2 size-4 text-[#0D9488]" aria-hidden />}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Input label="Full name" autoComplete="name" leading={<UserRound className="size-4" />} error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Work email" type="email" autoComplete="email" inputMode="email" leading={<Mail className="size-4" />} error={errors.email?.message} {...register('email')} />
          <PasswordInput label="Password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          <PasswordChecklist id="signup-pw-rules" password={password} email={email} name={fullName} />
          <Honeypot {...register('website')} />
          <Button type="submit" variant="glow" size="lg" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
          <p className="text-center text-[12px] text-[#8B6B4A]">We'll send a link to verify your email before you can sign in.</p>
        </form>
      )}
    </AuthLayout>
  );
}
