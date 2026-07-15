import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import Loader from '../components/Loader'
import axiosClient from '../api/axiosClient'

const PIPELINE_STAGES = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview' },
  { key: 'SELECTED', label: 'Selected' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout title="Dashboard"><Loader /></Layout>
  if (!stats) return <Layout title="Dashboard"><p className="text-muted">Could not load dashboard data.</p></Layout>

  const chartData = Object.entries(stats.applicationsByStatus).map(([status, count]) => ({
    status: status.replace('_', ' '),
    count,
  }))

  return (
    <Layout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Students" value={stats.totalStudents} />
        <StatCard label="Total Companies" value={stats.totalCompanies} />
        <StatCard label="Total Applications" value={stats.totalApplications} />
        <StatCard label="Selected Students" value={stats.selectedStudents} accent="success" />
        <StatCard label="Placement %" value={stats.placementPercentage} suffix="%" accent="gold" />
      </div>

      {/* Signature element: the placement pipeline - a real sequence, so numbering/order carries meaning here */}
      <div className="bg-surface border border-border rounded-xl shadow-card p-6 mb-8">
        <h2 className="font-display text-base font-semibold text-ink mb-5">Placement Pipeline</h2>
        <div className="flex items-stretch gap-2 overflow-x-auto">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={stage.key} className="flex items-stretch flex-1 min-w-[130px]">
              <div className="flex-1 rounded-lg border border-border bg-canvas px-4 py-4 text-center">
                <p className="text-xs uppercase tracking-wide text-muted font-medium">{stage.label}</p>
                <p className="font-display text-2xl font-semibold text-navy mt-1">
                  {stats.applicationsByStatus[stage.key] ?? 0}
                </p>
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="flex items-center px-1 text-gold text-lg">&rarr;</div>
              )}
            </div>
          ))}
          <div className="flex items-stretch flex-1 min-w-[130px]">
            <div className="flex-1 rounded-lg border border-danger/20 bg-danger-bg px-4 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-danger/80 font-medium">Rejected</p>
              <p className="font-display text-2xl font-semibold text-danger mt-1">
                {stats.applicationsByStatus.REJECTED ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface border border-border rounded-xl shadow-card p-6">
        <h2 className="font-display text-base font-semibold text-ink mb-5">Applications by Status</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EC" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1F2A44" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}
