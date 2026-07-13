import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody } from '../components/common/Card.jsx';
import { FormField, Input, Select, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import TagInput from '../components/common/TagInput.jsx';
import Spinner from '../components/common/Spinner.jsx';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'remote', 'contract']),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.array(z.string()).min(1, 'Add at least one requirement'),
  responsibilities: z.array(z.string()).min(1, 'Add at least one responsibility'),
  status: z.enum(['open', 'closed']),
});

export default function JobForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getOne(id),
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
      department: '',
      location: '',
      type: 'full-time',
      experienceLevel: '',
      description: '',
      requirements: [],
      responsibilities: [],
      status: 'open',
    },
  });

  useEffect(() => {
    if (existing?.data) reset(existing.data);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? jobsApi.update(id, values) : jobsApi.create(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success(isEdit ? 'Job posting updated' : 'Job posting created');
      navigate('/careers/jobs');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save the job posting."),
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
        onClick={() => navigate('/careers/jobs')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Job Postings
      </button>
      <PageHeader title={isEdit ? 'Edit Job Posting' : 'New Job Posting'} subtitle="Shown on the public Careers page." />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Job title" htmlFor="title" error={errors.title?.message} required>
                <Input id="title" error={!!errors.title} {...register('title')} />
              </FormField>
              <FormField label="Department" htmlFor="department" error={errors.department?.message} required>
                <Input id="department" error={!!errors.department} {...register('department')} />
              </FormField>
              <FormField label="Location" htmlFor="location" error={errors.location?.message} required>
                <Input id="location" placeholder="e.g. Remote, Lahore, PK" error={!!errors.location} {...register('location')} />
              </FormField>
              <FormField label="Employment type" htmlFor="type">
                <Select id="type" {...register('type')}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                </Select>
              </FormField>
              <FormField label="Experience level" htmlFor="experienceLevel" error={errors.experienceLevel?.message} required>
                <Input id="experienceLevel" placeholder="e.g. Mid, Senior" error={!!errors.experienceLevel} {...register('experienceLevel')} />
              </FormField>
              <FormField label="Status" htmlFor="status">
                <Select id="status" {...register('status')}>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Job description" htmlFor="description" error={errors.description?.message} required>
              <Textarea id="description" rows={7} error={!!errors.description} {...register('description')} />
            </FormField>

            <FormField label="Requirements" error={errors.requirements?.message} required hint="Press Enter after each item.">
              <Controller
                name="requirements"
                control={control}
                render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. 3+ years with React" />}
              />
            </FormField>

            <FormField
              label="Responsibilities"
              error={errors.responsibilities?.message}
              required
              hint="Press Enter after each item."
            >
              <Controller
                name="responsibilities"
                control={control}
                render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Own the frontend architecture" />}
              />
            </FormField>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/careers/jobs')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Post job'}
          </Button>
        </div>
      </form>
    </div>
  );
}