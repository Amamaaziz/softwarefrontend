import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Linkedin, Mail, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody } from '../components/common/Card.jsx';
import { FormField, Input, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';

// Optional URL field: empty string is valid, but if something is typed it must look like a URL
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: 'Enter a valid URL starting with http:// or https://',
  });

// Optional email field: empty string is valid, but if something is typed it must be a valid email
const optionalEmail = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Enter a valid email address',
  });

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  photo: z.string().min(1, 'Photo is required'),
  bio: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean(),
  order: z.coerce.number().int().min(0),
  isPublished: z.boolean(),
  links: z
    .object({
      linkedin: optionalUrl,
      email: optionalEmail,
      github: optionalUrl,
    })
    .optional(),
});

const emptyLinks = { linkedin: '', email: '', github: '' };

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
      links: emptyLinks,
    },
  });

  useEffect(() => {
    if (existing?.data) {
      // Merge in case older records don't have a `links` object yet
      reset({
        ...existing.data,
        links: { ...emptyLinks, ...(existing.data.links || {}) },
      });
    }
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

        <Card>
          <CardBody className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">Links (optional)</h3>
              <p className="mt-0.5 text-xs text-body/70 dark:text-body-dark/70">
                Leave any of these blank — they won't show on the About page unless filled in.
              </p>
            </div>

            <FormField label="LinkedIn URL" htmlFor="links.linkedin" error={errors.links?.linkedin?.message}>
              <Input
                id="links.linkedin"
                icon={<Linkedin size={15} />}
                placeholder="https://linkedin.com/in/username"
                error={!!errors.links?.linkedin}
                {...register('links.linkedin')}
              />
            </FormField>

            <FormField label="Email" htmlFor="links.email" error={errors.links?.email?.message}>
              <Input
                id="links.email"
                icon={<Mail size={15} />}
                placeholder="name@company.com"
                error={!!errors.links?.email}
                {...register('links.email')}
              />
            </FormField>

            <FormField label="GitHub URL" htmlFor="links.github" error={errors.links?.github?.message}>
              <Input
                id="links.github"
                icon={<Github size={15} />}
                placeholder="https://github.com/username"
                error={!!errors.links?.github}
                {...register('links.github')}
              />
            </FormField>
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