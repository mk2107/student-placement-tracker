import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StudentForm from './StudentForm'
import axiosClient from '../api/axiosClient'
import { useToast } from '../context/ToastContext'

export default function Students() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [branch, setBranch] = useState('')
  const [minCgpa, setMinCgpa] = useState('')
  const [branches, setBranches] = useState([])

  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | 'view' | null
  const [selectedStudent, setSelectedStudent] = useState(null)

  const { showToast } = useToast()

  const fetchStudents = useCallback(() => {
    setLoading(true)
    axiosClient
      .get('/students', { params: { keyword: keyword || undefined, branch: branch || undefined, minCgpa: minCgpa || undefined, page: pageNumber, size: 8 } })
      .then((res) => setPage(res.data.data))
      .finally(() => setLoading(false))
  }, [keyword, branch, minCgpa, pageNumber])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    axiosClient.get('/students/branches').then((res) => setBranches(res.data.data))
  }, [])

  // Any time a filter changes, reset back to page 0 - otherwise you could be
  // stuck on "page 4" of a filtered list that now only has 1 page.
  const updateFilter = (setter) => (value) => {
    setter(value)
    setPageNumber(0)
  }

  const handleAdd = async (formData) => {
    await axiosClient.post('/students', formData)
    showToast('Student added successfully')
    setModalMode(null)
    fetchStudents()
  }

  const handleEdit = async (formData) => {
    await axiosClient.put(`/students/${selectedStudent.id}`, formData)
    showToast('Student updated successfully')
    setModalMode(null)
    fetchStudents()
  }

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This also removes their applications.`)) return
    try {
      await axiosClient.delete(`/students/${student.id}`)
      showToast('Student deleted successfully')
      fetchStudents()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Failed to delete student', 'error')
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'rollNumber', header: 'Roll No.' },
    { key: 'branch', header: 'Branch' },
    { key: 'cgpa', header: 'CGPA', render: (row) => <span className="font-mono">{row.cgpa}</span> },
    { key: 'email', header: 'Email' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-3 text-sm">
          <button onClick={() => { setSelectedStudent(row); setModalMode('view') }} className="text-info hover:underline">View</button>
          <button onClick={() => { setSelectedStudent(row); setModalMode('edit') }} className="text-navy hover:underline">Edit</button>
          <button onClick={() => handleDelete(row)} className="text-danger hover:underline">Delete</button>
        </div>
      ),
    },
  ]

  return (
    <Layout title="Students">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <input
          className="px-3 py-2 rounded-lg border border-border text-sm w-56"
          placeholder="Search name, roll no, email..."
          value={keyword}
          onChange={(e) => updateFilter(setKeyword)(e.target.value)}
        />
        <select className="px-3 py-2 rounded-lg border border-border text-sm" value={branch} onChange={(e) => updateFilter(setBranch)(e.target.value)}>
          <option value="">All branches</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <input
          type="number"
          step="0.1"
          className="px-3 py-2 rounded-lg border border-border text-sm w-32"
          placeholder="Min CGPA"
          value={minCgpa}
          onChange={(e) => updateFilter(setMinCgpa)(e.target.value)}
        />
        <button
          onClick={() => setModalMode('add')}
          className="ml-auto px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
        >
          + Add Student
        </button>
      </div>

      <DataTable columns={columns} page={page} loading={loading} onPageChange={setPageNumber} emptyMessage="No students match your filters" />

      <Modal title="Add Student" isOpen={modalMode === 'add'} onClose={() => setModalMode(null)}>
        <StudentForm onSubmit={handleAdd} onCancel={() => setModalMode(null)} submitLabel="Add Student" />
      </Modal>

      <Modal title="Edit Student" isOpen={modalMode === 'edit'} onClose={() => setModalMode(null)}>
        {selectedStudent && (
          <StudentForm initialData={selectedStudent} onSubmit={handleEdit} onCancel={() => setModalMode(null)} submitLabel="Save Changes" />
        )}
      </Modal>

      <Modal title="Student Details" isOpen={modalMode === 'view'} onClose={() => setModalMode(null)}>
        {selectedStudent && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted text-xs uppercase mb-1">Name</dt><dd className="font-medium">{selectedStudent.name}</dd></div>
            <div><dt className="text-muted text-xs uppercase mb-1">Roll Number</dt><dd className="font-medium">{selectedStudent.rollNumber}</dd></div>
            <div><dt className="text-muted text-xs uppercase mb-1">Branch</dt><dd className="font-medium">{selectedStudent.branch}</dd></div>
            <div><dt className="text-muted text-xs uppercase mb-1">CGPA</dt><dd className="font-medium font-mono">{selectedStudent.cgpa}</dd></div>
            <div><dt className="text-muted text-xs uppercase mb-1">Email</dt><dd className="font-medium">{selectedStudent.email}</dd></div>
            <div><dt className="text-muted text-xs uppercase mb-1">Phone</dt><dd className="font-medium">{selectedStudent.phoneNumber || '—'}</dd></div>
            <div className="col-span-2"><dt className="text-muted text-xs uppercase mb-1">Skills</dt><dd className="font-medium">{selectedStudent.skills || '—'}</dd></div>
          </dl>
        )}
      </Modal>
    </Layout>
  )
}
