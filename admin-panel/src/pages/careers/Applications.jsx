import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Download,
  Mail,
  Phone,
  Inbox,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  User,
  Cake,
  Clock,
  X,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationsApi } from '../../data/index.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { FormField, Select, Input, Textarea } from '../../components/common/FormField.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { format } from 'date-fns';

const STATUS_TONES = {
  new: 'info',
  shortlisted: 'cta',
  interview: 'warning',
  hired: 'success',
  rejected: 'danger',
};

function safeDate(value, fallback = null) {
  if (!value) return fallback;
  try {
    return format(new Date(value), 'MMMM d, yyyy');
  } catch {
    return fallback;
  }
}

function toDateInputValue(value) {
  if (!value) return '';
  try {
    return format(new Date(value), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

function initialsOf(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

/** Centered, professional modal dialog — used instead of a side drawer. */
function Modal({ open, onClose, title, subtitle, avatar, children, footer, maxWidth = 'max-w-xl' }) {
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
      <div
        className={`relative flex max-h-[85vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10`}
      >
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
        {footer && <div className="border-t border-black/5 bg-black/[0.015] px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">{footer}</div>}
      </div>
    </div>
  );
}

/** One labeled value in the details grid (read-only view mode). */
function DetailField({ icon: Icon, label, value, tint = 'cta' }) {
  const isEmpty = value === null || value === undefined || value === '';
  const TINTS = {
    cta: 'bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  };
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TINTS[tint] || TINTS.cta}`}>
          <Icon size={13} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-body/50 dark:text-body-dark/50">{label}</p>
        {isEmpty ? (
          <p className="mt-0.5 text-sm italic text-body/40 dark:text-body-dark/40">Not provided</p>
        ) : (
          <p className="mt-0.5 break-words text-sm font-medium text-heading dark:text-heading-dark">{value}</p>
        )}
      </div>
    </div>
  );
}

/** Boxed group — used for the read-only view mode. */
function DetailSection({ title, accent = 'cta', children }) {
  const BAR = {
    cta: 'bg-cta',
    violet: 'bg-violet-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.02]">
      <div className={`h-1 w-full ${BAR[accent] || BAR.cta}`} />
      <div className="p-4">
        <p className="mb-3.5 text-xs font-bold uppercase tracking-wide text-body/60 dark:text-body-dark/60">{title}</p>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

/** Plain section heading with a divider — matches the Edit Job Posting page structure (no nested boxes). */
function FormSectionHeading({ children }) {
  return (
    <p className="mb-4 border-b border-black/5 pb-2 text-sm font-semibold text-heading dark:border-white/10 dark:text-heading-dark">
      {children}
    </p>
  );
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  experience: '',
  remote: '',
  about: '',
};

export default function Applications() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'edit'
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['job-applications'],
    queryFn: () => applicationsApi.list(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => applicationsApi.update(id, { status }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      setSelected((s) => (s ? { ...s, status: res.data.status } : s));
      toast.success('Application status updated');
    },
    onError: () => toast.error("Couldn't update status."),
  });

  const detailsMutation = useMutation({
    mutationFn: ({ id, values }) => applicationsApi.update(id, values),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      setSelected(res.data);
      setDrawerMode('view');
      toast.success('Application details updated');
    },
    onError: () => toast.error("Couldn't save changes."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => applicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application deleted');
      setConfirmDelete(null);
      setSelected(null);
    },
    onError: () => {
      toast.error("Couldn't delete application.");
      setConfirmDelete(null);
    },
  });

  function openView(row) {
    setDrawerMode('view');
    setSelected(row);
  }

  function openEdit(row) {
    setForm({
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      gender: row.gender || '',
      dateOfBirth: toDateInputValue(row.dateOfBirth),
      email: row.email || '',
      phone: row.phone || '',
      address: row.address || '',
      education: row.education || '',
      experience: row.experience || '',
      remote: row.remote === true ? 'yes' : row.remote === false ? 'no' : row.remote || '',
      about: row.about || row.message || '',
    });
    setDrawerMode('edit');
    setSelected(row);
  }

  function handleFormChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSaveDetails() {
    if (!selected) return;
    detailsMutation.mutate({
      id: selected._id,
      values: {
        ...form,
        remote: form.remote === 'yes' ? true : form.remote === 'no' ? false : form.remote,
      },
    });
  }

  const columns = [
    { key: 'applicantName', header: 'Applicant', sortable: true },
    { key: 'job', header: 'Applied for', render: (row) => row.job?.title || '—' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge tone={STATUS_TONES[row.status] || 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Applied',
      sortable: true,
      render: (row) => format(new Date(row.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="View details"
            onClick={() => openView(row)}
            className="rounded-lg p-1.5 text-body/70 transition-colors hover:bg-black/5 hover:text-heading dark:text-body-dark/70 dark:hover:bg-white/10 dark:hover:text-heading-dark"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            title="Edit application"
            onClick={() => openEdit(row)}
            className="rounded-lg p-1.5 text-body/70 transition-colors hover:bg-black/5 hover:text-heading dark:text-body-dark/70 dark:hover:bg-white/10 dark:hover:text-heading-dark"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            title="Delete application"
            onClick={() => setConfirmDelete(row)}
            className="rounded-lg p-1.5 text-danger/80 transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Job Applications" subtitle="Review applicants for each open position." />

      <Card>
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          searchPlaceholder="Search applicants..."
          searchKeys={['applicantName', 'email']}
          onRowClick={(row) => openView(row)}
          emptyState={<EmptyState icon={Inbox} title="No applications yet" message="Applications will appear here as candidates apply." />}
        />
      </Card>

      {/* View / Edit — centered modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={drawerMode === 'edit' ? 'Edit Application' : selected?.applicantName}
        subtitle={drawerMode === 'edit' ? selected?.applicantName : selected?.email}
        avatar={initialsOf(selected?.applicantName)}
        maxWidth={drawerMode === 'edit' ? 'max-w-2xl' : 'max-w-xl'}
        footer={
          selected &&
          (drawerMode === 'edit' ? (
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setDrawerMode('view')}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveDetails} disabled={detailsMutation.isPending}>
                <Save size={15} /> {detailsMutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {selected.resumeUrl && (
                <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <Download size={15} /> Download resume
                  </Button>
                </a>
              )}
              <Button variant="danger" onClick={() => setConfirmDelete(selected)}>
                <Trash2 size={15} /> Delete
              </Button>
            </div>
          ))
        }
      >
        {selected && (
          <div className={drawerMode === 'edit' ? 'space-y-7' : 'space-y-5'}>
            {drawerMode === 'view' && (
              <div className="flex items-start justify-between gap-4 overflow-hidden rounded-xl border border-cta/20 bg-gradient-to-r from-cta/10 via-cta/5 to-transparent p-4 dark:border-cta/20">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-cta-hover/80 dark:text-cta-dark/80">
                    Applied for
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-heading dark:text-heading-dark">
                    {selected.job?.title || 'Not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-cta-hover/80 dark:text-cta-dark/80">
                    Status
                  </p>
                  <div className="mt-1 w-40">
                    <Select
                      id="app-status"
                      value={selected.status}
                      onChange={(e) => statusMutation.mutate({ id: selected._id, status: e.target.value })}
                    >
                      <option value="new">New</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {drawerMode === 'edit' ? (
              /* ===== EDIT MODE — plain, spacious sections, matches the Edit Job Posting page ===== */
              <>
                <div>
                  <FormSectionHeading>Applied for &amp; status</FormSectionHeading>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField label="Applied for" htmlFor="job-title">
                      <Input id="job-title" value={selected.job?.title || ''} disabled />
                    </FormField>
                    <FormField label="Status" htmlFor="edit-status">
                      <Select
                        id="edit-status"
                        value={selected.status}
                        onChange={(e) => statusMutation.mutate({ id: selected._id, status: e.target.value })}
                      >
                        <option value="new">New</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div>
                  <FormSectionHeading>Personal information</FormSectionHeading>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField label="First name" htmlFor="firstName">
                      <Input id="firstName" value={form.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} />
                    </FormField>
                    <FormField label="Second name" htmlFor="lastName">
                      <Input id="lastName" value={form.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} />
                    </FormField>
                    <FormField label="Gender" htmlFor="gender">
                      <Select id="gender" value={form.gender} onChange={(e) => handleFormChange('gender', e.target.value)}>
                        <option value="">Select…</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormField>
                    <FormField label="Date of birth" htmlFor="dob">
                      <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => handleFormChange('dateOfBirth', e.target.value)} />
                    </FormField>
                  </div>
                </div>

                <div>
                  <FormSectionHeading>Contact information</FormSectionHeading>
                  <div className="grid grid-cols-2 gap-5">
                    <FormField label="Email" htmlFor="email">
                      <Input id="email" type="email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} />
                    </FormField>
                    <FormField label="Phone number" htmlFor="phone">
                      <Input id="phone" value={form.phone} onChange={(e) => handleFormChange('phone', e.target.value)} />
                    </FormField>
                  </div>
                  <div className="mt-5">
                    <FormField label="Address" htmlFor="address">
                      <Input id="address" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} />
                    </FormField>
                  </div>
                </div>

                <div>
                  <FormSectionHeading>Background &amp; role fit</FormSectionHeading>
                  <FormField label="Education" htmlFor="education">
                    <Input id="education" value={form.education} onChange={(e) => handleFormChange('education', e.target.value)} />
                  </FormField>
                  <div className="mt-5 grid grid-cols-2 gap-5">
                    <FormField label="Experience" htmlFor="experience">
                      <Input id="experience" value={form.experience} onChange={(e) => handleFormChange('experience', e.target.value)} />
                    </FormField>
                    <FormField label="Open to remote?" htmlFor="remote">
                      <Select id="remote" value={form.remote} onChange={(e) => handleFormChange('remote', e.target.value)}>
                        <option value="">Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Select>
                    </FormField>
                  </div>
                </div>

                <div>
                  <FormSectionHeading>About the candidate</FormSectionHeading>
                  <FormField label="Tell about yourself" htmlFor="about">
                    <Textarea id="about" rows={4} value={form.about} onChange={(e) => handleFormChange('about', e.target.value)} />
                  </FormField>
                </div>
              </>
            ) : (
              /* ===== VIEW MODE — read only, boxed summary cards ===== */
              <>
                <DetailSection title="Personal information" accent="cta">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField icon={User} label="First name" value={selected.firstName} tint="cta" />
                    <DetailField icon={User} label="Second name" value={selected.lastName} tint="cta" />
                    <DetailField icon={User} label="Gender" value={selected.gender} tint="cta" />
                    <DetailField icon={Cake} label="Date of birth" value={safeDate(selected.dateOfBirth)} tint="cta" />
                  </div>
                </DetailSection>

                <DetailSection title="Contact information" accent="blue">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField icon={Mail} label="Email" value={selected.email} tint="blue" />
                    <DetailField icon={Phone} label="Phone number" value={selected.phone} tint="blue" />
                  </div>
                  <DetailField icon={MapPin} label="Address" value={selected.address} tint="blue" />
                </DetailSection>

                <DetailSection title="Background & role fit" accent="violet">
                  <DetailField icon={GraduationCap} label="Education" value={selected.education} tint="violet" />
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField icon={Briefcase} label="Experience" value={selected.experience} tint="violet" />
                    <DetailField
                      icon={Globe}
                      label="Open to remote?"
                      value={selected.remote === true ? 'Yes' : selected.remote === false ? 'No' : selected.remote}
                      tint="violet"
                    />
                  </div>
                </DetailSection>

                <DetailSection title="About the candidate" accent="amber">
                  {selected.about || selected.message ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-heading dark:text-heading-dark">
                      {selected.about || selected.message}
                    </p>
                  ) : (
                    <p className="text-sm italic text-body/40 dark:text-body-dark/40">Not provided</p>
                  )}
                </DetailSection>

                <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs text-body/60 dark:border-white/10 dark:text-body-dark/60">
                  <span className="flex items-center gap-1.5">
                    <FileText size={13} />
                    {selected.resumeUrl ? 'Resume on file' : 'No resume uploaded'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    Applied {safeDate(selected.createdAt, '—')}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete application?"
        maxWidth="max-w-sm"
        footer={
          confirmDelete && (
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => deleteMutation.mutate(confirmDelete._id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={15} /> {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          )
        }
      >
        {confirmDelete && (
          <p className="text-sm text-body dark:text-body-dark">
            This will permanently remove <strong>{confirmDelete.applicantName}</strong>'s application for{' '}
            <strong>{confirmDelete.job?.title || 'this role'}</strong>. This action can't be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}