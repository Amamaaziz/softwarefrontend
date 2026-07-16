import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Spinner from './Spinner.jsx';
import EmptyState from './EmptyState.jsx';
import { Input } from './FormField.jsx';

/**
 * Generic data table with client-visible search input, column sorting,
 * and pagination controls. Columns are declared as:
 * { key, header, sortable, render(row) }
 *
 * This single component backs the list view for every content module
 * (Services, Portfolio, Blog, Testimonials, Jobs, Leads, Users, Logs)
 * so the list/search/sort/paginate pattern is only implemented once.
 */
export default function DataTable({
  columns,
  data = [],
  isLoading,
  isError,
  errorMessage = 'Something went wrong loading this data. Try refreshing the page.',
  searchPlaceholder = 'Search...',
  searchKeys = [],
  pageSize = 10,
  emptyState,
  rowActions,
  onRowClick,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

 const safeData = Array.isArray(data) ? data : [];

const filtered = useMemo(() => {
  if (!search || searchKeys.length === 0) return safeData;

  const q = search.toLowerCase();

  return safeData.filter((row) =>
    searchKeys.some((key) =>
      String(row[key] ?? '').toLowerCase().includes(q)
    )
  );
}, [safeData, search, searchKeys]);

const sorted = useMemo(() => {
  if (!Array.isArray(filtered)) return [];

  if (!sortKey) return filtered;

  const copy = [...filtered];

  copy.sort((a, b) => {
    const av = a?.[sortKey];
    const bv = b?.[sortKey];

    if (av == null) return 1;
    if (bv == null) return -1;

    if (typeof av === 'string') {
      return sortDir === 'asc'
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    }

    return sortDir === 'asc' ? av - bv : bv - av;
  });

  return copy;
}, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  return (
    <div>
      {searchKeys.length > 0 && (
        <div className="border-b border-border p-4 dark:border-border-dark">
          <div className="relative max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body/50 dark:text-body-dark/50" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-body/70 dark:border-border-dark dark:text-body-dark/70">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-5 py-3 font-medium">
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-heading dark:hover:text-heading-dark"
                    >
                      {col.header}
                      <span className="flex flex-col -space-y-1">
                        <ChevronUp
                          size={11}
                          className={sortKey === col.key && sortDir === 'asc' ? 'text-cta' : 'opacity-30'}
                        />
                        <ChevronDown
                          size={11}
                          className={sortKey === col.key && sortDir === 'desc' ? 'text-cta' : 'opacity-30'}
                        />
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
              {rowActions && <th className="px-5 py-3 text-right font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-16 text-center">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && isError && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-12 text-center text-sm text-red-500">
                  {errorMessage}
                </td>
              </tr>
            )}

            {!isLoading && !isError && paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)}>
                  {emptyState || <EmptyState />}
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              paginated.map((row, idx) => (
                <tr
                  key={row._id || row.id || idx}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={clsx(
                    'border-b border-border/70 last:border-0 dark:border-border-dark/70',
                    onRowClick && 'cursor-pointer hover:bg-surface dark:hover:bg-canvas-dark/40'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 align-middle text-body dark:text-body-dark">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">{rowActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && sorted.length > 0 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3.5 text-xs text-body dark:border-border-dark dark:text-body-dark">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg p-1.5 hover:bg-surface disabled:opacity-40 dark:hover:bg-canvas-dark/40"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-1.5 hover:bg-surface disabled:opacity-40 dark:hover:bg-canvas-dark/40"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
