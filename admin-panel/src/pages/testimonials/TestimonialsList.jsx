import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, MessageSquareQuote, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonialsApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import ToggleSwitch from '../../components/common/ToggleSwitch.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= rating ? 'fill-cta text-cta' : 'text-border dark:text-border-dark'} />
      ))}
    </div>
  );
}

export default function TestimonialsList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsApi.list(),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => testimonialsApi.publish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated');
    },
    onError: () => toast.error("Couldn't update publish status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => testimonialsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this testimonial."),
  });

  const columns = [
    {
      key: 'clientName',
      header: 'Client',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cta/10 text-xs font-semibold text-cta-hover dark:bg-cta/15 dark:text-cta-dark">
              {row.clientName?.[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-heading dark:text-heading-dark">{row.clientName}</p>
            <p className="text-xs text-body/70 dark:text-body-dark/70">{row.company}</p>
          </div>
        </div>
      ),
    },
    { key: 'message', header: 'Message', render: (row) => <p className="max-w-sm truncate">{row.message}</p> },
    { key: 'rating', header: 'Rating', sortable: true, render: (row) => <Stars rating={row.rating} /> },
    {
      key: 'isPublished',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <ToggleSwitch
          checked={row.isPublished}
          onChange={(val) => publishMutation.mutate({ id: row._id, isPublished: val })}
          label={row.isPublished ? 'Published' : 'Draft'}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle="Manage client reviews shown across the site."
        action={
          <Link to="/testimonials/new">
            <Button>
              <Plus size={16} /> New Testimonial
            </Button>
          </Link>
        }
      />

      <Card>
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          searchPlaceholder="Search testimonials..."
          searchKeys={['clientName', 'company', 'message']}
          emptyState={
            <EmptyState
              icon={MessageSquareQuote}
              title="No testimonials yet"
              message="Add client reviews to build trust on the public site."
              actionLabel="New Testimonial"
              onAction={() => (window.location.href = '/testimonials/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/testimonials/${row._id}/edit`}>
                <Button variant="ghost" size="icon" aria-label="Edit">
                  <Pencil size={15} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(row)}>
                <Trash2 size={15} className="text-red-500" />
              </Button>
            </>
          )}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete testimonial from "${deleteTarget?.clientName}"?`}
        message="This will permanently remove the testimonial from the site. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
