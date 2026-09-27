import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Building2, CheckCircle2, Mail, UserRound, Users } from 'lucide-react';
import { pilotRequestSchema } from '@shared/schemas/index.ts';
import { Input } from '@/components/ui/Field';

// The honeypot is judged at submit time (bots get the same success screen), so it never blocks validity.
const formSchema = pilotRequestSchema.extend({ website: z.string().optional() });
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function PilotForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', practice: '', website: '' },
  });

  const onSubmit = async (values: FormOutput) => {
    await sleep(800);
    if (values.website) {
      setSent(true); // honeypot tripped: pretend success, do nothing
      return;
    }
    // Demo: no network call. A real build would POST the request here.
    setSent(true);
  };

  return (
    <div className="cadabra-glass-card relative rounded-3xl p-5 border border-white/90 shadow-[0_24px_50px_rgba(139,107,74,0.1)] sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center" role="status">
            <div className="relative mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#93C572] text-white shadow-[0_0_24px_rgba(13,148,136,0.35)] border border-white/40">
              <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#93C572]/40" aria-hidden />
              <CheckCircle2 className="relative size-7 text-white" aria-hidden />
            </div>
            <h3 className="text-xl font-bold text-[#2D2118]">Thanks — we'll reach out within one business day</h3>
            <p className="mt-2 max-w-sm text-sm text-[#5E4837]">We'll set up a 30-day pilot and measure your baseline in week one.</p>
          </motion.div>
        ) : (
          <motion.form key="form" exit={{ opacity: 0, y: -8 }} onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Request a pilot" className="relative grid gap-4 sm:grid-cols-2">
            <Input
              label="Your name"
              autoComplete="name"
              shellClassName="[&_label]:text-[#2D2118] [&_label]:font-semibold"
              className="bg-white/95 border-[#8B6B4A]/25 text-[#2D2118] placeholder:text-[#8B6B4A]/70 focus:border-[#0D9488] focus:ring-[#93C572]/20 backdrop-blur-md shadow-sm"
              leading={<UserRound className="size-4 text-[#8B6B4A]" />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Work email"
              type="email"
              autoComplete="email"
              inputMode="email"
              shellClassName="[&_label]:text-[#2D2118] [&_label]:font-semibold"
              className="bg-white/95 border-[#8B6B4A]/25 text-[#2D2118] placeholder:text-[#8B6B4A]/70 focus:border-[#0D9488] focus:ring-[#93C572]/20 backdrop-blur-md shadow-sm"
              leading={<Mail className="size-4 text-[#8B6B4A]" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Practice"
              autoComplete="organization"
              shellClassName="[&_label]:text-[#2D2118] [&_label]:font-semibold"
              className="bg-white/95 border-[#8B6B4A]/25 text-[#2D2118] placeholder:text-[#8B6B4A]/70 focus:border-[#0D9488] focus:ring-[#93C572]/20 backdrop-blur-md shadow-sm"
              leading={<Building2 className="size-4 text-[#8B6B4A]" />}
              error={errors.practice?.message}
              {...register('practice')}
            />
            <Input
              label="Number of providers"
              type="number"
              inputMode="numeric"
              min={1}
              shellClassName="[&_label]:text-[#2D2118] [&_label]:font-semibold"
              className="bg-white/95 border-[#8B6B4A]/25 text-[#2D2118] placeholder:text-[#8B6B4A]/70 focus:border-[#0D9488] focus:ring-[#93C572]/20 backdrop-blur-md shadow-sm"
              leading={<Users className="size-4 text-[#8B6B4A]" />}
              error={errors.providers?.message}
              {...register('providers')}
            />
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0">
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12.5px] text-[#5E4837]">No spam. We only use this to contact you about a pilot.</p>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#93C572] px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(13,148,136,0.35)] transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              >
                Request a pilot
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
