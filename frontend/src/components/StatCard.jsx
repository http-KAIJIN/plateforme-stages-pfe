import Card from './Card'

export default function StatCard({ title, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-2xl p-3 ${tones[tone]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  )
}
