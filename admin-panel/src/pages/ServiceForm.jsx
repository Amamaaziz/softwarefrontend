import { useEffect } from 'react';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../components/common/Card.jsx';
import { FormField, Input, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';
import Spinner from '../components/common/Spinner.jsx';

const subServiceSchema = z.object({
  title: z.string().min(1, 'Sub-service title is required'),
  description: z.string().min(1, 'Sub-service description is required'),
});

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required').max(200, 'Keep it under 200 characters'),
  description: z.string().min(1, 'Full description is required'),
  subServices: z.array(subServiceSchema),
  images: z.array(z.string()),
  order: z.coerce.number().int().min(0),
  isPublished: z.boolean(),
});

export default function ServiceForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getOne(id),
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
      title: '',
      shortDescription: '',
      description: '',
      subServices: [],
      images: [],
      order: 0,
      isPublished: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'subServices' });

  useEffect(() => {
    if (existing?.data) {
      reset(existing.data);
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? servicesApi.update(id, values) : servicesApi.create(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(isEdit ? 'Service updated' : 'Service created');
      navigate('/services');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Couldn't save the service.");
    },
  });

  const onSubmit = (values) => mutation.mutate(values);

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate('/services')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Services
      </button>
      <PageHeader title={isEdit ? 'Edit Service' : 'New Service'} subtitle="Shown on the public Services page." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <FormField label="Title" htmlFor="title" error={errors.title?.message} required>
              <Input id="title" placeholder="e.g. Web Development" error={!!errors.title} {...register('title')} />
            </FormField>

            <FormField
              label="Short description"
              htmlFor="shortDescription"
              error={errors.shortDescription?.message}
              hint="Used on listing and home page cards."
              required
            >
              <Textarea
                id="shortDescription"
                rows={2}
                error={!!errors.shortDescription}
                {...register('shortDescription')}
              />
            </FormField>

            <FormField label="Full description" htmlFor="description" error={errors.description?.message} required>
              <Textarea id="description" rows={6} error={!!errors.description} {...register('description')} />
            </FormField>

            <FormField label="Gallery images">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} multiple label="Add image" />
                )}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">Sub-services</h3>
            <Button type="button" size="sm" variant="secondary" onClick={() => append({ title: '', description: '' })}>
              <Plus size={14} /> Add sub-service
            </Button>
          </CardHeader>
          <CardBody className="space-y-4">
            {fields.length === 0 && (
              <p className="text-sm text-body/70 dark:text-body-dark/70">
                Optional — add specific offerings under this service.
              </p>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border p-4 dark:border-border-dark">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-body/60 dark:text-body-dark/60">
                    Sub-service {index + 1}
                  </span>
                  <button type="button" onClick={() => remove(index)} aria-label="Remove sub-service">
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  <FormField
                    label="Title"
                    error={errors.subServices?.[index]?.title?.message}
                    required
                  >
                    <Input {...register(`subServices.${index}.title`)} />
                  </FormField>
                  <FormField
                    label="Description"
                    error={errors.subServices?.[index]?.description?.message}
                    required
                  >
                    <Textarea rows={2} {...register(`subServices.${index}.description`)} />
                  </FormField>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-4">
            <FormField label="Display order" htmlFor="order" hint="Lower numbers appear first." error={errors.order?.message}>
              <Input id="order" type="number" className="w-28" {...register('order')} />
            </FormField>
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
          <Button type="button" variant="secondary" onClick={() => navigate('/services')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Create service'}
          </Button>
        </div>
      </form>
    </div>
  );
}