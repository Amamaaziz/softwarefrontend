import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FormField, Input } from '../../components/common/FormField.jsx';
import Button from '../../components/common/Button.jsx';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // Frontend-only project — no backend to actually update a password.
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success('Password updated. Please sign in.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-canvas p-6 shadow-card dark:border-border-dark dark:bg-surface-dark dark:shadow-card-dark">
          <h1 className="text-lg font-semibold text-heading dark:text-heading-dark">Set a new password</h1>
          <p className="mt-1 mb-5 text-sm text-body dark:text-body-dark">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="New password" htmlFor="password" error={errors.password?.message} required>
              <Input id="password" type="password" error={!!errors.password} {...register('password')} />
            </FormField>
            <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
              <Input id="confirmPassword" type="password" error={!!errors.confirmPassword} {...register('confirmPassword')} />
            </FormField>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Update password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
