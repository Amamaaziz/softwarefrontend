import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { portfolioApi, servicesApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody } from '../components/common/Card.jsx';
import { FormField, Input, Select, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';

import TagInput from '../components/common/TagInput.jsx';
import Spinner from '../components/common/Spinner.jsx';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  client: z.string().min(1, 'Client name is required'),
  serviceId: z.string().optional().or(z.literal('')),
  coverImage: z.string().min(1, 'A cover image is required'),
  challenge: z.string().min(1, 'Describe the challenge'),
  solution: z.string().min(1, 'Describe the solution'),
  result: z.string().min(1, 'Describe the result'),
  technologies: z.array(z.string()),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isPublished: z.boolean(),
});

export default function PortfolioForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfolioApi.getOne(id),
    enabled: isEdit,
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'for-select'],
    queryFn: () => servicesApi.list(),
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
      client: '',
      serviceId: '',
      coverImage: '',
      challenge: '',
      solution: '',
      result: '',
      technologies: [],
      isFeatured: false,
      isNewArrival: false,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        ...existing.data,
        serviceId: existing.data.service?._id || existing.data.serviceId || '',
      });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit
        ? portfolioApi.update(id, { ...values, serviceId: values.serviceId || null })
        : portfolioApi.create({ ...values, serviceId: values.serviceId || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(isEdit ? 'Project updated' : 'Project created');
      navigate('/portfolio');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save the project."),
  });

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
        onClick={() => navigate('/portfolio')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Portfolio
      </button>
      <PageHeader title={isEdit ? 'Edit Project' : 'New Project'} subtitle="Shown on the public Portfolio / Case Studies page." />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Project title" htmlFor="title" error={errors.title?.message} required>
                <Input id="title" error={!!errors.title} {...register('title')} />
              </FormField>
              <FormField label="Client name" htmlFor="client" error={errors.client?.message} required>
                <Input id="client" error={!!errors.client} {...register('client')} />
              </FormField>
            </div>

            <FormField label="Related service" htmlFor="serviceId" hint="Optional">
              <Select id="serviceId" {...register('serviceId')}>
                <option value="">— None —</option>
                {servicesData?.data?.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Cover image" error={errors.coverImage?.message} required>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
              />
            </FormField>

            <FormField label="Technologies used">
              <Controller
                name="technologies"
                control={control}
                render={({ field }) => (
                  <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. React, Node.js..." />
                )}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-5">
            <FormField label="Challenge" htmlFor="challenge" error={errors.challenge?.message} required>
              <Textarea id="challenge" rows={4} error={!!errors.challenge} {...register('challenge')} />
            </FormField>
            <FormField label="Solution" htmlFor="solution" error={errors.solution?.message} required>
              <Textarea id="solution" rows={4} error={!!errors.solution} {...register('solution')} />
            </FormField>
            <FormField label="Result / outcomes" htmlFor="result" error={errors.result?.message} required>
              <Textarea id="result" rows={4} error={!!errors.result} {...register('result')} />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-wrap items-center gap-8">
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} label="Featured" />
              )}
            />
            <Controller
              name="isNewArrival"
              control={control}
              render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} label="New Arrival" />
              )}
            />
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
          <Button type="button" variant="secondary" onClick={() => navigate('/portfolio')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </div>
  );
}