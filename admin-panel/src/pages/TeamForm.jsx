import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody } from '../components/common/Card.jsx';
import { FormField, Input, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  photo: z.string().min(1, 'Photo is required'),
  bio: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean(),
  order: z.coerce.number().int().min(0),
  isPublished: z.boolean(),
});

export default function TeamForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.getOne(id),
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
    defaultValues: {
      name: '',
      role: '',
      photo: '',
      bio: '',
      message: '',
      isFeatured: false,
      order: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (existing?.data) reset(existing.data);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? teamApi.update(id, values) : teamApi.create(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success(isEdit ? 'Team member updated' : 'Team member created');
      navigate('/team');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save this team member."),
  });

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('/team')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Team
      </button>
      <PageHeader title={isEdit ? 'Edit Team Member' : 'New Team Member'} />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
                <Input id="name" error={!!errors.name} {...register('name')} />
              </FormField>
              <FormField label="Role" htmlFor="role" error={errors.role?.message} required>
                <Input id="role" placeholder="e.g. Head of Design" error={!!errors.role} {...register('role')} />
              </FormField>
            </div>

            <FormField label="Photo" error={errors.photo?.message} required>
              <Controller
                name="photo"
                control={control}
                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} label="Photo" />}
              />
            </FormField>

            <FormField label="Bio (optional)" htmlFor="bio">
              <Textarea id="bio" rows={3} {...register('bio')} placeholder="Short line shown near their card, if used." />
            </FormField>

            <FormField label="Featured quote (optional)" htmlFor="message">
              <Textarea
                id="message"
                rows={3}
                {...register('message')}
                placeholder="Shown only if this member is marked Featured (e.g. CEO message)."
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Display order" htmlFor="order" error={errors.order?.message}>
                <Input id="order" type="number" {...register('order')} />
              </FormField>

              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <div className="flex items-end pb-1.5">
                    <ToggleSwitch
                      checked={field.value}
                      onChange={field.onChange}
                      label={field.value ? 'Featured (spotlight card)' : 'Not featured'}
                    />
                  </div>
                )}
              />
            </div>

            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} label={field.value ? 'Published' : 'Draft'} />
              )}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/team')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Add team member'}
          </Button>
        </div>
      </form>
    </div>
  );
}