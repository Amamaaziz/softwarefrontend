import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FormField, Input } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Incorrect email or password.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 dark:bg-surface-dark">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cta/25 blur-3xl animate-blob dark:bg-cta/15" />
        <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-cta-hover/20 blur-3xl animate-blob-delay dark:bg-cta-dark/10" />
        <div
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cta/10 blur-3xl animate-blob dark:bg-cta/5"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #94A3B822 1px, transparent 1px), linear-gradient(to bottom, #94A3B822 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cta font-display text-xl font-bold text-slate-900 shadow-lg shadow-cta/30 animate-scale-in">
            SH
            <Sparkles size={14} className="absolute -right-1.5 -top-1.5 text-cta-hover animate-pulse-soft" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-heading dark:text-heading-dark">Admin Panel</h1>
          <p className="mt-1 text-sm text-body dark:text-body-dark">Sign in to manage your site's content</p>
        </div>

        

        <div
          className="rounded-xl border border-border bg-canvas/90 p-6 shadow-popover backdrop-blur-sm animate-fade-up dark:border-border-dark dark:bg-surface-dark/90"
          style={{ animationDelay: '150ms' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="animate-fade-up" style={{ animationDelay: '220ms' }}>
              <FormField label="Email address" htmlFor="email" error={errors.email?.message} required>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  error={!!errors.email}
                  className="transition-shadow duration-200 focus:shadow-[0_0_0_4px_rgba(0,210,196,0.12)]"
                  {...register('email')}
                />
              </FormField>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '280ms' }}>
              <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    error={!!errors.password}
                    className="pr-10 transition-shadow duration-200 focus:shadow-[0_0_0_4px_rgba(0,210,196,0.12)]"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-body/60 transition-transform duration-150 hover:scale-110 hover:text-heading dark:text-body-dark/60 dark:hover:text-heading-dark"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="flex justify-end animate-fade-up" style={{ animationDelay: '320ms' }}>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-cta-hover transition-colors hover:underline dark:text-cta-dark"
              >
                Forgot password?
              </Link>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '360ms' }}>
              <Button
                type="submit"
                className="group w-full transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cta/30 active:translate-y-0"
                isLoading={isSubmitting}
              >
                <LogIn size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                Sign in
              </Button>
            </div>
          </form>

          {/* No backend, no real account — this is the demo login. */}
          <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-xs leading-relaxed text-body dark:border-border-dark dark:text-body-dark">
            <p className="font-semibold text-heading dark:text-heading-dark">Demo account</p>
            <p className="mt-1 font-mono">admin@demo.com / demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}