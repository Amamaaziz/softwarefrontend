import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card, { CardBody, CardHeader } from '../components/common/Card.jsx';
import { FormField, Input, Textarea } from '../components/common/FormField.jsx';
import Button from '../components/common/Button.jsx';
import ImageUploader from '../components/common/ImageUploader.jsx';
import Spinner from '../components/common/Spinner.jsx';

const schema = z.object({
  logo: z.string().optional().or(z.literal('')),
  contactEmail: z.string().email('Enter a valid email address'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  officeAddress: z.string().min(1, 'Office address is required'),
  social: z.object({
    linkedin: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    facebook: z.string().optional().or(z.literal('')),
    instagram: z.string().optional().or(z.literal('')),
  }),
  seoDefaults: z.object({
    metaTitle: z.string().optional().or(z.literal('')),
    metaDescription: z.string().optional().or(z.literal('')),
  }),
});

export default function SiteSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
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
      logo: '',
      contactEmail: '',
      contactPhone: '',
      officeAddress: '',
      social: { linkedin: '', twitter: '', facebook: '', instagram: '' },
      seoDefaults: { metaTitle: '', metaDescription: '' },
    },
  });

  useEffect(() => {
    if (data?.data) reset(data.data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values) => settingsApi.update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Site settings saved');
    },
    onError: (err) => toast.error(err.response?.data?.message || "Couldn't save settings."),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Site Settings" subtitle="Global details used across both the public site and admin panel." />

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">Branding</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Logo">
              <Controller
                name="logo"
                control={control}
                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} label="Upload logo" />}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">Contact Information</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Contact email" htmlFor="contactEmail" error={errors.contactEmail?.message} required>
              <Input id="contactEmail" type="email" error={!!errors.contactEmail} {...register('contactEmail')} />
            </FormField>
            <FormField label="Contact phone" htmlFor="contactPhone" error={errors.contactPhone?.message} required>
              <Input id="contactPhone" error={!!errors.contactPhone} {...register('contactPhone')} />
            </FormField>
            <FormField label="Office address" htmlFor="officeAddress" error={errors.officeAddress?.message} required>
              <Textarea id="officeAddress" rows={2} error={!!errors.officeAddress} {...register('officeAddress')} />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">Social Links</h3>
          </CardHeader>
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <FormField label="LinkedIn" htmlFor="linkedin">
              <Input id="linkedin" placeholder="https://linkedin.com/company/..." {...register('social.linkedin')} />
            </FormField>
            <FormField label="Twitter / X" htmlFor="twitter">
              <Input id="twitter" placeholder="https://x.com/..." {...register('social.twitter')} />
            </FormField>
            <FormField label="Facebook" htmlFor="facebook">
              <Input id="facebook" placeholder="https://facebook.com/..." {...register('social.facebook')} />
            </FormField>
            <FormField label="Instagram" htmlFor="instagram">
              <Input id="instagram" placeholder="https://instagram.com/..." {...register('social.instagram')} />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-heading dark:text-heading-dark">SEO Defaults</h3>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Default meta title" htmlFor="metaTitle">
              <Input id="metaTitle" {...register('seoDefaults.metaTitle')} />
            </FormField>
            <FormField label="Default meta description" htmlFor="metaDescription">
              <Textarea id="metaDescription" rows={2} {...register('seoDefaults.metaDescription')} />
            </FormField>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting || mutation.isPending}>
            <Save size={16} /> Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
