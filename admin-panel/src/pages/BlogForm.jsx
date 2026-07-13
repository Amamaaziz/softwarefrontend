import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../components/common/Card.jsx';
import { FormField, Input, Textarea, Select } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';
import Spinner from '../components/common/Spinner.jsx';

const CATEGORIES = ['Company News', 'Engineering', 'Design', 'Product', 'Industry Insights'];

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(1, 'Select a category'),
  coverImage: z.string().min(1, 'A cover image is required'),
  content: z.string().min(1, 'Post content is required'),
  excerpt: z.string().min(1, 'Add a short excerpt').max(200, 'Keep it under 200 characters'),
  seoMeta: z.object({
    metaTitle: z.string().optional().or(z.literal('')),
    metaDescription: z.string().optional().or(z.literal('')),
  }),
  status: z.enum(['draft', 'published']),
});

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogApi.getOne(id),
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
      category: '',
      coverImage: '',
      content: '',
      excerpt: '',
      seoMeta: { metaTitle: '', metaDescription: '' },
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing?.data) reset(existing.data);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (isEdit ? blogApi.update(id, values) : blogApi.create(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(isEdit ? 'Post updated' : 'Post created');
      navigate('/blog');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save the post."),
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
        onClick={() => navigate('/blog')}
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-body hover:text-heading dark:text-body-dark dark:hover:text-heading-dark"
      >
        <ArrowLeft size={15} /> Back to Blog
      </button>
      <PageHeader title={isEdit ? 'Edit Post' : 'New Post'} subtitle="Shown on the public Blog / Insights page." />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardBody className="space-y-5">
            <FormField label="Title" htmlFor="title" error={errors.title?.message} required>
              <Input id="title" error={!!errors.title} {...register('title')} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Category" htmlFor="category" error={errors.category?.message} required>
                <Select id="category" error={!!errors.category} {...register('category')}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Status" htmlFor="status">
                <Select id="status" {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Cover image" error={errors.coverImage?.message} required>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
              />
            </FormField>

            <FormField
              label="Excerpt"
              htmlFor="excerpt"
              error={errors.excerpt?.message}
              hint="Short summary shown on listing cards."
              required
            >
              <Textarea id="excerpt" rows={2} error={!!errors.excerpt} {...register('excerpt')} />
            </FormField>
          </CardBody>
        </Card>

        <FormField label="Content" htmlFor="content" error={errors.content?.message} required>
          <Textarea id="content" rows={10} error={!!errors.content} {...register('content')} />
        </FormField>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">SEO (optional)</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <FormField label="Meta title" htmlFor="metaTitle">
              <Input id="metaTitle" {...register('seoMeta.metaTitle')} />
            </FormField>
            <FormField label="Meta description" htmlFor="metaDescription">
              <Textarea id="metaDescription" rows={2} {...register('seoMeta.metaDescription')} />
            </FormField>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/blog')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> {isEdit ? 'Save changes' : 'Create post'}
          </Button>
        </div>
      </form>
    </div>
  );
}