import Loader from './Loader'

/**
 * A generic table component that any page (Students, Companies, Applications)
 * can reuse by passing in its own column definitions and data - instead of
 * writing a new <table> from scratch for every page.
 *
 * columns: [{ key: 'name', header: 'Name', render?: (row) => JSX }]
 * page: Spring's Page object shape - { content, number, totalPages, totalElements }
 */
export default function DataTable({ columns, page, loading, onPageChange, emptyMessage = 'No records found' }) {
  if (loading) return <Loader />

  const rows = page?.content ?? []

  return (
    <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-canvas border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-medium text-muted uppercase text-xs tracking-wide">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr key={row.id ?? idx} className="border-b border-border last:border-0 hover:bg-canvas/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-ink">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page && page.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
          <span className="text-muted">
            Page {page.number + 1} of {page.totalPages} &middot; {page.totalElements} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page.number - 1)}
              disabled={page.number === 0}
              className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page.number + 1)}
              disabled={page.number >= page.totalPages - 1}
              className="px-3 py-1.5 rounded-md border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-canvas transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
