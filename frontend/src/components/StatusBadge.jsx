const styles = {
  submitted: 'bg-blue-50 text-blue-700',
  reviewed: 'bg-amber-50 text-amber-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  withdrawn: 'bg-slate-100 text-slate-600',
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-slate-100 text-slate-600',
  closed: 'bg-red-50 text-red-700',
  proposed: 'bg-blue-50 text-blue-700',
  approved: 'bg-indigo-50 text-indigo-700',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status || 'N/A'}
    </span>
  )
}
