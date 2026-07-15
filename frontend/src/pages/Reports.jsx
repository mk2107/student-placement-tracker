import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import axiosClient from '../api/axiosClient'

export default function Reports() {
  const [branchStats, setBranchStats] = useState(null)
  const [companyStats, setCompanyStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosClient.get('/reports/branch-wise'),
      axiosClient.get('/reports/company-wise'),
    ])
      .then(([branchRes, companyRes]) => {
        setBranchStats(branchRes.data.data)
        setCompanyStats(companyRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout title="Reports"><Loader /></Layout>

  return (
    <Layout title="Reports">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise placement statistics */}
        <div className="bg-surface border border-border rounded-xl shadow-card p-6">
          <h2 className="font-display text-base font-semibold text-ink mb-5">Branch-wise Placement</h2>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted">
                  <th className="py-2">Branch</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Selected</th>
                  <th className="py-2">Placement %</th>
                </tr>
              </thead>
              <tbody>
                {branchStats.map((row) => (
                  <tr key={row.branch} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium">{row.branch}</td>
                    <td className="py-2 font-mono">{row.totalStudents}</td>
                    <td className="py-2 font-mono">{row.selectedStudents}</td>
                    <td className="py-2 font-mono">{row.placementPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EC" vertical={false} />
              <XAxis dataKey="branch" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="placementPercentage" name="Placement %" fill="#B8862E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Company-wise selected students */}
        <div className="bg-surface border border-border rounded-xl shadow-card p-6">
          <h2 className="font-display text-base font-semibold text-ink mb-5">Company-wise Selected Students</h2>
          {companyStats.length === 0 ? (
            <p className="text-muted text-sm">No students have been selected yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted">
                      <th className="py-2">Company</th>
                      <th className="py-2">Selected Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyStats.map((row) => (
                      <tr key={row.companyName} className="border-b border-border last:border-0">
                        <td className="py-2 font-medium">{row.companyName}</td>
                        <td className="py-2 font-mono">{row.selectedCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={companyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EC" vertical={false} />
                  <XAxis dataKey="companyName" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip />
                  <Bar dataKey="selectedCount" name="Selected" fill="#2F7A54" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
