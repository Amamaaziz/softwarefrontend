import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FolderKanban, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../data/index.js';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import DataTable from '../components/common/DataTable.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import ToggleSwitch from '../components/common/ToggleSwitch.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function PortfolioList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioApi.list(),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => portfolioApi.publish(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project updated');
    },
    onError: () => toast.error("Couldn't update publish status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => portfolioApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this project."),
  });

  const columns = [
    {
      key: 'title',
      header: 'Project',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage && (
            <img src={row.coverImage} alt="" className="h-9 w-9 rounded-md object-cover" />
          )}
          <div>
            <p className="font-medium text-heading dark:text-heading-dark">{row.title}</p>
            <p className="text-xs text-body/70 dark:text-body-dark/70">{row.client}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      render: (row) =>
        row.isFeatured ? (
          <Badge tone="cta">
            <Star size={11} className="mr-1" /> Featured
          </Badge>
        ) : (
          <span className="text-body/50 dark:text-body-dark/50">—</span>
        ),
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
        title="Portfolio"
        subtitle="Manage case studies shown on the public Portfolio page."
        action={
          <Link to="/portfolio/new">
            <Button>
              <Plus size={16} /> New Project
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
          searchPlaceholder="Search projects..."
          searchKeys={['title', 'client']}
          emptyState={
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              message="Add your first case study to showcase your work."
              actionLabel="New Project"
              onAction={() => (window.location.href = '/portfolio/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/portfolio/${row._id}/edit`}>
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
        message="This will permanently remove the project from the site. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
