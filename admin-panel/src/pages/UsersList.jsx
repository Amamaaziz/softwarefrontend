import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../data/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  content_editor: 'Content Editor',
  hr_manager: 'HR Manager',
};

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
  });

  const activeMutation = useMutation({
    mutationFn: ({ id, isActive }) => usersApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User access updated');
    },
    onError: () => toast.error("Couldn't update user access."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User removed');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't remove this user."),
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cta/10 text-xs font-semibold text-cta-hover dark:bg-cta/15 dark:text-cta-dark">
            {row.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-heading dark:text-heading-dark">{row.name}</p>
            <p className="text-xs text-body/70 dark:text-body-dark/70">{row.email}</p>
          </div>
        </div>
      ),
    },
    
    {
      key: 'isActive',
      header: 'Access',
      sortable: true,
      render: (row) => (
        <ToggleSwitch
          checked={row.isActive}
          disabled={row._id === currentUser?._id}
          onChange={(val) => activeMutation.mutate({ id: row._id, isActive: val })}
          label={row.isActive ? 'Active' : 'Deactivated'}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Invite staff and manage their access to the admin panel."
        action={
          <Link to="/users/new">
            <Button>
              <Plus size={16} /> Invite User
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
          searchPlaceholder="Search users..."
          searchKeys={['name', 'email']}
          emptyState={
            <EmptyState
              icon={UsersRound}
              title="No staff accounts yet"
              message="Invite your team to start managing content."
              actionLabel="Invite User"
              onAction={() => (window.location.href = '/users/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/users/${row._id}/edit`}>
                <Button variant="ghost" size="icon" aria-label="Edit">
                  <Pencil size={15} />
                </Button>
              </Link>
              {row._id !== currentUser?._id && (
                <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteTarget(row)}>
                  <Trash2 size={15} className="text-red-500" />
                </Button>
              )}
            </>
          )}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Remove "${deleteTarget?.name}"?`}
        message="This permanently removes their access to the admin panel."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
