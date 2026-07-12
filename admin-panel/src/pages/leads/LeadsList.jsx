import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Inbox, MessageSquare, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Badge from '../../components/common/Badge.jsx';
import { FormField, Select } from '../../components/common/FormField.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

const STATUS_TONES = {
  new: 'info',
  contacted: 'warning',
  converted: 'success',
  closed: 'neutral',
};

function initialsOf(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function Modal({ open, onClose, title, subtitle, avatar, children }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
        <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-gradient-to-r from-cta/10 via-transparent to-transparent px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            {avatar && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cta/15 text-sm font-bold text-cta-hover dark:bg-cta/20 dark:text-cta-dark">
                {avatar}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-heading dark:text-heading-dark">{title}</h2>
              {subtitle && <p className="mt-0.5 truncate text-xs text-body/60 dark:text-body-dark/60">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-body/60 transition-colors hover:bg-black/5 hover:text-heading dark:text-body-dark/60 dark:hover:bg-white/10 dark:hover:text-heading-dark"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

/** Clickable contact row (mailto: / tel:) that avoids literal anchor markup. */
function ContactRow({ icon: Icon, value, hrefPrefix }) {
  if (!value) return null;
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => {
        window.location.href = hrefPrefix + value;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') window.location.href = hrefPrefix + value;
      }}
      className="flex cursor-pointer items-center gap-2.5 text-heading transition-colors hover:text-cta-hover dark:text-heading-dark dark:hover:text-cta-dark"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
        <Icon size={14} />
      </span>
      {value}
    </div>
  );
}

export default function LeadsList() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsApi.list(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => leadsApi.update(id, { status }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelected((s) => (s ? { ...s, status: res.data.status } : s));
      toast.success('Lead status updated');
    },
    onError: () => toast.error("Couldn't update lead status."),
  });

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (row) => <span className="capitalize">{row.source}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge tone={STATUS_TONES[row.status] || 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortable: true,
      render: (row) => format(new Date(row.createdAt), 'MMM d, yyyy'),
    },
  ];

  return (
    <div>
      <PageHeader title="Contact" subtitle="Submissions from the public Contact and Get a Quote forms." />

      <Card>
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          searchPlaceholder="Search leads..."
          searchKeys={['name', 'email']}
          onRowClick={(row) => setSelected(row)}
          emptyState={<EmptyState icon={Inbox} title="No leads yet" message="Contact and quote submissions will show up here." />}
        />
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected?.email}
        avatar={initialsOf(selected?.name)}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge tone={STATUS_TONES[selected.status] || 'neutral'} className="capitalize">
                {selected.status}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-body/60 dark:text-body-dark/60">
                <Calendar size={13} />
                {format(new Date(selected.createdAt), 'MMMM d, yyyy')}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white dark:border-blue-500/20 dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900">
              <div className="h-1 w-full bg-blue-500" />
              <div className="p-4">
                <p className="mb-3.5 text-xs font-bold uppercase tracking-wide text-body/60 dark:text-body-dark/60">
                  Contact information
                </p>
                <div className="space-y-3 text-sm">
                  <ContactRow icon={Mail} value={selected.email} hrefPrefix="mailto:" />
                  <ContactRow icon={Phone} value={selected.phone} hrefPrefix="tel:" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white dark:border-amber-500/20 dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900">
              <div className="h-1 w-full bg-amber-500" />
              <div className="p-4">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-body/60 dark:text-body-dark/60">
                  <MessageSquare size={13} /> Message
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-heading dark:text-heading-dark">
                  {selected.message}
                </p>
              </div>
            </div>

            <FormField label="Lead status" htmlFor="lead-status">
              <Select
                id="lead-status"
                value={selected.status}
                onChange={(e) => statusMutation.mutate({ id: selected._id, status: e.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </Select>
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}