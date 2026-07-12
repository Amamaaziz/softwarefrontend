import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

export default function BlogList() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Post deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete this post."),
  });

  const columns = [
    {
      key: 'title',
      header: 'Post',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage && <img src={row.coverImage} alt="" className="h-9 w-9 rounded-md object-cover" />}
          <div className="max-w-xs">
            <p className="truncate font-medium text-heading dark:text-heading-dark">{row.title}</p>
            <p className="truncate text-xs text-body/70 dark:text-body-dark/70">{row.author?.name}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge tone={row.status === 'published' ? 'success' : 'warning'}>{row.status}</Badge>,
    },
    {
      key: 'publishedAt',
      header: 'Published',
      sortable: true,
      render: (row) => (row.publishedAt ? format(new Date(row.publishedAt), 'MMM d, yyyy') : '—'),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Blog / Insights"
        subtitle="Manage articles, tech news, and company updates."
        action={
          <Link to="/blog/new">
            <Button>
              <Plus size={16} /> New Post
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
          searchPlaceholder="Search posts..."
          searchKeys={['title', 'category']}
          emptyState={
            <EmptyState
              icon={Newspaper}
              title="No posts yet"
              message="Write your first article for the Blog / Insights page."
              actionLabel="New Post"
              onAction={() => (window.location.href = '/blog/new')}
            />
          }
          rowActions={(row) => (
            <>
              <Link to={`/blog/${row._id}/edit`}>
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
        message="This will permanently remove the post from the site. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
