import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { FormField, Input } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // Frontend-only project — no backend to actually send an email.
    // Simulate a short delay, then show the confirmation state.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-canvas p-6 shadow-card dark:border-border-dark dark:bg-surface-dark dark:shadow-card-dark">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark">
                <MailCheck size={22} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-heading dark:text-heading-dark">Check your inbox</h2>
              <p className="mt-1.5 text-sm text-body dark:text-body-dark">
                If an account exists for that email, a reset link is on its way.
              </p>
              <Link
                to="/login"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cta-hover hover:underline dark:text-cta-dark"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-heading dark:text-heading-dark">Reset your password</h1>
              <p className="mt-1 mb-5 text-sm text-body dark:text-body-dark">
                Enter your account email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormField label="Email address" htmlFor="email" error={errors.email?.message} required>
                  <Input id="email" type="email" placeholder="you@company.com" error={!!errors.email} {...register('email')} />
                </FormField>
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Send reset link
                </Button>
              </form>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
