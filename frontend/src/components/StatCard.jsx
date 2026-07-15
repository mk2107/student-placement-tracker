export default function StatCard({ label, value, accent = 'navy', suffix = '' }) {
  const accentClasses = {
    navy: 'text-navy',
    gold: 'text-gold',
    success: 'text-success',
    danger: 'text-danger',
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentClasses[accent]}`}>
        {value}
        {suffix}
      </p>
    </div>
  )
}
