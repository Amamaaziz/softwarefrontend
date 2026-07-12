import { useQuery } from '@tanstack/react-query';
import { ScrollText } from 'lucide-react';
import { activityLogsApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

const ACTION_TONES = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  publish: 'cta',
  login: 'neutral',
};

export default function ActivityLogs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => activityLogsApi.list({ sort: '-createdAt' }),
  });

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (row) => row.user?.name || 'Unknown',
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (row) => <Badge tone={ACTION_TONES[row.action] || 'neutral'}>{row.action}</Badge>,
    },
    { key: 'module', header: 'Module', sortable: true },
    { key: 'description', header: 'Description' },
    {
      key: 'createdAt',
      header: 'When',
      sortable: true,
      render: (row) => format(new Date(row.createdAt), 'MMM d, yyyy · h:mm a'),
    },
  ];

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="A record of who changed what and when, for accountability." />

      <Card>
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          searchPlaceholder="Search activity..."
          searchKeys={['module', 'description']}
          emptyState={<EmptyState icon={ScrollText} title="No activity recorded yet" message="Admin actions across the site will appear here." />}
        />
      </Card>
    </div>
  );
}
