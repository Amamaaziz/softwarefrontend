import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import ToggleSwitch from '../../components/common/ToggleSwitch.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function ServicesList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list(),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => servicesApi.publish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated');
    },
    onError: () => toast.error("Couldn't update publish status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => servicesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this service."),
  });

  const columns = [
    { key: 'title', header: 'Title', sortable: true },
    {
      key: 'order',
      header: 'Order',
      sortable: true,
      render: (row) => row.order ?? 0,
    },
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
        title="Services"
        subtitle="Manage the services shown on the public website."
        action={
          <Link to="/services/new">
            <Button>
              <Plus size={16} /> New Service
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
          searchPlaceholder="Search services..."
          searchKeys={['title']}
          emptyState={
            <EmptyState
              icon={Briefcase}
              title="No services yet"
              message="Add your first service to show it on the public site."
              actionLabel="New Service"
              onAction={() => (window.location.href = '/services/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/services/${row._id}/edit`}>
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
        title={`Delete "${deleteTarget?.title}"?`}
        message="This will permanently remove the service from the site. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
