import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layers, Briefcase, Newspaper, FolderKanban, Sparkles, Inbox, ArrowUpRight } from 'lucide-react';
import { servicesApi, jobsApi, blogApi, portfolioApi, leadsApi } from '../data/index.js';
import Card, { CardHeader, CardBody } from '../components/common/Card.jsx';
import Spinner from '../components/common/Spinner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StatCard from './StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pull straight from the same stores each list page uses, so the counts
  // here always match Services / Portfolio / Blog / Job Postings exactly.
  const { data: servicesRes, isLoading: servicesLoading } = useQuery({
    queryKey: ['services-list'],
    queryFn: servicesApi.list,
  });
  const { data: jobsRes, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs-list'],
    queryFn: jobsApi.list,
  });
  const { data: blogRes, isLoading: blogLoading } = useQuery({
    queryKey: ['blog-list'],
    queryFn: blogApi.list,
  });
  const { data: portfolioRes, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-list'],
    queryFn: portfolioApi.list,
  });
  const { data: leadsRes, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads-list'],
    queryFn: leadsApi.list,
  });

  const isLoading = servicesLoading || jobsLoading || blogLoading || portfolioLoading || leadsLoading;

  const totalServicesCount = servicesRes?.total ?? 0;
  const totalJobsCount = jobsRes?.total ?? 0;
  const totalBlogsCount = blogRes?.total ?? 0;
  const totalProjectsCount = portfolioRes?.total ?? 0;

  const latestQueries = [...(leadsRes?.data ?? [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const goToLeads = () => navigate('/leads');

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

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={Layers}
              label="Total No of Services"
              value={totalServicesCount}
              delay={0}
              accent="teal"
            />
            <StatCard
              icon={Briefcase}
              label="Total No of Jobs"
              value={totalJobsCount}
              delay={80}
              accent="violet"
            />
            <StatCard
              icon={Newspaper}
              label="Total No of Blogs"
              value={totalBlogsCount}
              delay={160}
              accent="blue"
            />
            <StatCard
              icon={FolderKanban}
              label="Total No of Projects"
              value={totalProjectsCount}
              delay={240}
              accent="amber"
            />
          </div>

          {/* Latest Queries */}
          <div className="mt-6">
            <Card
              className="animate-fade-up cursor-pointer transition-shadow duration-300 hover:shadow-popover"
              style={{ animationDelay: '320ms' }}
            >
              <CardHeader
                className="bg-gradient-to-r from-cta/10 to-transparent"
                onClick={goToLeads}
              >
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-sm font-bold text-heading dark:text-heading-dark">📥 Latest Queries</h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-cta-hover dark:text-cta-dark">
                    View all <ArrowUpRight size={14} />
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                {latestQueries.length === 0 ? (
                  <EmptyState title="No queries yet" message="New contact and quote submissions will appear here." />
                ) : (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {latestQueries.map((query, i) => (
                      <li
                        key={query._id ?? i}
                        onClick={goToLeads}
                        className="animate-fade-up flex items-center justify-between gap-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        style={{ animationDelay: `${400 + i * 60}ms` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta-hover dark:bg-cta/15 dark:text-cta-dark">
                            <Inbox size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-heading dark:text-heading-dark">
                              {query.name || 'Unknown'}
                            </p>
                            <p className="truncate text-xs text-body dark:text-body-dark">
                              {query.message || query.source || 'General inquiry'}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 text-xs text-body dark:text-body-dark">
                          <span>
                            {query.createdAt
                              ? new Date(query.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </span>
                          <ArrowUpRight size={14} className="opacity-50" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
