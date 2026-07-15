export default function FormField({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

export function inputClasses(hasError) {
  return `w-full px-3 py-2 rounded-lg border ${
    hasError ? 'border-danger' : 'border-border'
  } bg-surface text-sm text-ink focus:border-navy transition-colors`
}
