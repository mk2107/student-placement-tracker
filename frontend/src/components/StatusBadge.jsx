const STATUS_STYLES = {
  APPLIED: 'bg-info-bg text-info',
  SHORTLISTED: 'bg-warning-bg text-warning',
  INTERVIEW_SCHEDULED: 'bg-gold-light/20 text-gold',
  SELECTED: 'bg-success-bg text-success',
  REJECTED: 'bg-danger-bg text-danger',
}

const STATUS_LABELS = {
  APPLIED: 'Applied',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-canvas text-muted'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
