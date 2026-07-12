import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function JobsList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => jobsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job posting deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this job posting."),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => jobsApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job status updated');
    },
    onError: () => toast.error("Couldn't update job status."),
  });

  const columns = [
    { key: 'title', header: 'Title', sortable: true },
    { key: 'department', header: 'Department', sortable: true },
    { key: 'location', header: 'Location', sortable: true },
    { key: 'type', header: 'Type', render: (row) => <span className="capitalize">{row.type?.replace('-', ' ')}</span> },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <button
          onClick={() =>
            toggleStatusMutation.mutate({ id: row._id, status: row.status === 'open' ? 'closed' : 'open' })
          }
        >
          <Badge tone={row.status === 'open' ? 'success' : 'neutral'}>{row.status}</Badge>
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Job Postings"
        subtitle="Manage open positions shown on the public Careers page."
        action={
          <Link to="/careers/jobs/new">
            <Button>
              <Plus size={16} /> New Job Posting
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
          searchPlaceholder="Search job postings..."
          searchKeys={['title', 'department', 'location']}
          emptyState={
            <EmptyState
              icon={Briefcase}
              title="No job postings yet"
              message="Post your first opening to start receiving applications."
              actionLabel="New Job Posting"
              onAction={() => (window.location.href = '/careers/jobs/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/careers/jobs/${row._id}/edit`}>
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
        message="This will permanently remove the job posting. Existing applications are preserved for historical record."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
