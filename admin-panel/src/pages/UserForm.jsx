import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody } from '../components/common/Card.jsx';
import { FormField, Input, Select } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import Spinner from '../components/common/Spinner.jsx';

const baseSchema = {
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(['super_admin', 'content_editor', 'hr_manager']),
  isActive: z.boolean(),
};

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const schema = z.object(baseSchema);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getOne(id),
    enabled: isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', role: 'content_editor', isActive: true },
  });

  useEffect(() => {
    if (existing?.data) reset(existing.data);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? usersApi.update(id, values) : usersApi.create(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isEdit ? 'User updated' : 'Invite sent — the user will receive an email to set their password.');
      navigate('/users');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save this user."),
  });

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={() => navigate('/users')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Users
      </button>
      <PageHeader
        title={isEdit ? 'Edit User' : 'Invite New User'}
        subtitle={isEdit ? "Update this staff member's role and access." : 'They will receive an email to set up their account.'}
      />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" error={!!errors.name} {...register('name')} />
            </FormField>
            <FormField label="Email address" htmlFor="email" error={errors.email?.message} required>
              <Input id="email" type="email" error={!!errors.email} {...register('email')} />
            </FormField>
            <FormField
              label="Role"
              htmlFor="role"
              hint="Super Admin: full access. Content Editor: Services/Portfolio/Blog/Testimonials. HR Manager: Careers/Applications."
              required
            >
              <Select id="role" {...register('role')}>
                <option value="content_editor">Content Editor</option>
                <option value="hr_manager">HR Manager</option>
                <option value="super_admin">Super Admin</option>
              </Select>
            </FormField>
            {isEdit && (
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch checked={field.value} onChange={field.onChange} label={field.value ? 'Access active' : 'Access deactivated'} />
                )}
              />
            )}
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Send invite'}
          </Button>
        </div>
      </form>
    </div>
  );
}
