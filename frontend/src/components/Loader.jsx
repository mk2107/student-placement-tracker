export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <div className="h-5 w-5 rounded-full border-2 border-border border-t-navy animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
