import { useQuery } from '@tanstack/react-query';
import { Inbox, Briefcase, FolderKanban, Newspaper, Sparkles, Plus, Trash2, Pencil, LogIn } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardApi, activityLogsApi } from '../../data/index.js';
import Card, { CardHeader, CardBody } from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatCard from './StatCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const ACTION_STYLE = {
  create: { icon: Plus, classes: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' },
  update: { icon: Pencil, classes: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
  delete: { icon: Trash2, classes: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400' },
  publish: { icon: Sparkles, classes: 'bg-cta/15 text-cta-hover dark:bg-cta/20 dark:text-cta-dark' },
  login: { icon: LogIn, classes: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400' },
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.stats,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['activity-logs', { limit: 6 }],
    queryFn: () => activityLogsApi.list({ limit: 6, sort: '-createdAt' }),
    enabled: user?.role === 'super_admin',
  });

  const chartData = stats?.leadsOverTime || [];

  return (
    <div>
      {/* Vibrant welcome banner */}
      <div className="animate-fade-up relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-cta/25 via-violet-400/10 to-blue-400/10 p-7 dark:from-cta/15 dark:via-violet-500/10 dark:to-blue-500/10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-cta/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-canvas/70 px-3 py-1 text-cta-hover backdrop-blur-sm dark:bg-canvas-dark/50 dark:text-cta-dark">
            <Sparkles size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-heading dark:text-heading-dark">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="mt-1.5 text-sm text-body dark:text-body-dark">Here's what's happening across your site today.</p>
        </div>
      </div>

      {statsLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Inbox}
              label="New Leads"
              value={stats?.leadsCount ?? 0}
              trend={stats?.leadsTrend}
              trendLabel="vs last month"
              delay={0}
              accent="teal"
            />
            <StatCard icon={Briefcase} label="Open Jobs" value={stats?.openJobsCount ?? 0} delay={80} accent="violet" />
            <StatCard
              icon={FolderKanban}
              label="Published Projects"
              value={stats?.publishedPortfolioCount ?? 0}
              delay={160}
              accent="amber"
            />
            <StatCard icon={Newspaper} label="Published Posts" value={stats?.publishedBlogCount ?? 0} delay={240} accent="blue" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card
              className="animate-fade-up lg:col-span-2 transition-shadow duration-300 hover:shadow-popover"
              style={{ animationDelay: '320ms' }}
            >
              <CardHeader className="bg-gradient-to-r from-cta/10 to-transparent">
                <h3 className="text-sm font-bold text-heading dark:text-heading-dark">📈 Leads — last 30 days</h3>
              </CardHeader>
              <CardBody>
                {chartData.length === 0 ? (
                  <EmptyState title="No lead data yet" message="Once contact and quote forms come in, trends show up here." />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D2C4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00D2C4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, borderColor: '#E2E8F0', fontSize: 12 }}
                        labelStyle={{ color: '#0F172A', fontWeight: 600 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#00B3A6"
                        strokeWidth={2.5}
                        fill="url(#leadsGradient)"
                        isAnimationActive
                        animationDuration={900}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>

            {user?.role === 'super_admin' && (
              <Card
                className="animate-fade-up transition-shadow duration-300 hover:shadow-popover"
                style={{ animationDelay: '400ms' }}
              >
                <CardHeader className="bg-gradient-to-r from-violet-400/10 to-transparent">
                  <h3 className="text-sm font-bold text-heading dark:text-heading-dark">⚡ Recent activity</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {activityLoading ? (
                    <div className="flex justify-center py-6">
                      <Spinner />
                    </div>
                  ) : !activity?.data?.length ? (
                    <EmptyState title="No activity yet" message="Admin actions will be logged here." />
                  ) : (
                    activity.data.map((log, index) => {
                      const style = ACTION_STYLE[log.action] || ACTION_STYLE.publish;
                      const ActionIcon = style.icon;
                      return (
                        <div
                          key={log._id}
                          className="flex gap-3 text-sm animate-fade-up"
                          style={{ animationDelay: `${460 + index * 70}ms` }}
                        >
                          <div
                            className={clsx(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                              style.classes
                            )}
                          >
                            <ActionIcon size={14} />
                          </div>
                          <div className="pt-0.5">
                            <p className="text-heading dark:text-heading-dark">{log.description}</p>
                            <p className="text-xs text-body/60 dark:text-body-dark/60">
                              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}