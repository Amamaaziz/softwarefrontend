import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Button from '../components/common/Button.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import Badge from '../components/common/Badge.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function TeamList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['team'],
    queryFn: () => teamApi.list(),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => teamApi.publish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Team member updated');
    },
    onError: () => toast.error("Couldn't update publish status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => teamApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Team member deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this team member."),
  });

  const columns = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cta/10 text-xs font-semibold text-cta-hover dark:bg-cta/15 dark:text-cta-dark">
              {row.name?.[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-heading dark:text-heading-dark">{row.name}</p>
            <p className="text-xs text-body/70 dark:text-body-dark/70">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      sortable: true,
      render: (row) =>
        row.isFeatured ? (
          <Badge tone="warning">
            <Star size={11} className="mr-1 inline" /> Featured
          </Badge>
        ) : (
          <span className="text-xs text-body/50 dark:text-body-dark/50">—</span>
        ),
    },
    { key: 'order', header: 'Order', sortable: true },
    {
      key: 'isPublished',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <ToggleSwitch
          checked={row.isPublished}
          onChange={(val) => publishMutation.mutate({ id: row.id, isPublished: val })}
          label={row.isPublished ? 'Published' : 'Draft'}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Manage the people shown on the About page."
        action={
          <Link to="/team/new">
            <Button>
              <Plus size={16} /> New Team Member
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
          searchPlaceholder="Search team members..."
          searchKeys={['name', 'role']}
          emptyState={
            <EmptyState
              icon={Users}
              title="No team members yet"
              message="Add the people who show up on the About page."
              actionLabel="New Team Member"
              onAction={() => (window.location.href = '/team/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/team/${row.id}/edit`}>
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
        title={`Delete "${deleteTarget?.name}"?`}
        message="This will permanently remove this team member from the About page. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}