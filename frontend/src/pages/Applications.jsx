import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import axiosClient from '../api/axiosClient'
import { useToast } from '../context/ToastContext'

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED']

export default function Applications() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')

  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [newApp, setNewApp] = useState({ studentId: '', companyId: '' })
  const [formError, setFormError] = useState('')
  const { showToast } = useToast()

  const fetchApplications = useCallback(() => {
    setLoading(true)
    axiosClient
      .get('/applications', { params: { status: statusFilter || undefined, page: pageNumber, size: 8 } })
      .then((res) => setPage(res.data.data))
      .finally(() => setLoading(false))
  }, [statusFilter, pageNumber])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  // Fetch a large page of students/companies once, to populate the "New Application" dropdowns.
  useEffect(() => {
    axiosClient.get('/students', { params: { size: 500 } }).then((res) => setStudents(res.data.data.content))
    axiosClient.get('/companies', { params: { size: 500 } }).then((res) => setCompanies(res.data.data.content))
  }, [])

  const handleStatusChange = async (application, newStatus) => {
    try {
      await axiosClient.patch(`/applications/${application.id}/status`, { status: newStatus })
      showToast('Status updated successfully')
      fetchApplications()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Failed to update status', 'error')
    }
  }

  const handleDelete = async (application) => {
    if (!window.confirm(`Delete this application (${application.studentName} → ${application.companyName})?`)) return
    try {
      await axiosClient.delete(`/applications/${application.id}`)
      showToast('Application deleted successfully')
      fetchApplications()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Failed to delete application', 'error')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!newApp.studentId || !newApp.companyId) {
      setFormError('Please select both a student and a company')
      return
    }
    try {
      await axiosClient.post('/applications', newApp)
      showToast('Application submitted successfully')
      setModalOpen(false)
      setNewApp({ studentId: '', companyId: '' })
      fetchApplications()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Failed to submit application')
    }
  }

  const columns = [
    { key: 'studentName', header: 'Student', render: (row) => `${row.studentName} (${row.studentRollNumber})` },
    { key: 'companyName', header: 'Company' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="text-xs border border-border rounded-md px-2 py-1 bg-surface"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      ),
    },
    { key: 'appliedDate', header: 'Applied On', render: (row) => new Date(row.appliedDate).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button onClick={() => handleDelete(row)} className="text-danger hover:underline text-sm">Delete</button>
      ),
    },
  ]

  return (
    <Layout title="Applications">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <select
          className="px-3 py-2 rounded-lg border border-border text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPageNumber(0) }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button
          onClick={() => setModalOpen(true)}
          className="ml-auto px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
        >
          + New Application
        </button>
      </div>

      <DataTable columns={columns} page={page} loading={loading} onPageChange={setPageNumber} emptyMessage="No applications found" />

      <Modal title="New Application" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreate}>
          {formError && <div className="mb-4 px-3 py-2 rounded-lg bg-danger-bg text-danger text-sm">{formError}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5">Student</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border text-sm"
              value={newApp.studentId}
              onChange={(e) => setNewApp({ ...newApp, studentId: e.target.value })}
            >
              <option value="">Select a student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-ink mb-1.5">Company</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border text-sm"
              value={newApp.companyId}
              onChange={(e) => setNewApp({ ...newApp, companyId: e.target.value })}
            >
              <option value="">Select a company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-canvas transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
