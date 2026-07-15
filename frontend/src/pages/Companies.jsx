import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import CompanyForm from './CompanyForm'
import axiosClient from '../api/axiosClient'
import { useToast } from '../context/ToastContext'

export default function Companies() {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [modalMode, setModalMode] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const { showToast } = useToast()

  const fetchCompanies = useCallback(() => {
    setLoading(true)
    axiosClient
      .get('/companies', { params: { keyword: keyword || undefined, page: pageNumber, size: 8 } })
      .then((res) => setPage(res.data.data))
      .finally(() => setLoading(false))
  }, [keyword, pageNumber])

  useEffect(() => { fetchCompanies() }, [fetchCompanies])

  const handleAdd = async (formData) => {
    await axiosClient.post('/companies', formData)
    showToast('Company added successfully')
    setModalMode(null)
    fetchCompanies()
  }

  const handleEdit = async (formData) => {
    await axiosClient.put(`/companies/${selectedCompany.id}`, formData)
    showToast('Company updated successfully')
    setModalMode(null)
    fetchCompanies()
  }

  const handleDelete = async (company) => {
    if (!window.confirm(`Delete ${company.companyName}? This also removes related applications.`)) return
    try {
      await axiosClient.delete(`/companies/${company.id}`)
      showToast('Company deleted successfully')
      fetchCompanies()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Failed to delete company', 'error')
    }
  }

  const columns = [
    { key: 'companyName', header: 'Company' },
    { key: 'location', header: 'Location' },
    { key: 'ctc', header: 'CTC (LPA)', render: (row) => <span className="font-mono">{row.ctc}</span> },
    { key: 'eligibilityCgpa', header: 'Min. CGPA', render: (row) => <span className="font-mono">{row.eligibilityCgpa}</span> },
    { key: 'lastDateToApply', header: 'Last Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-3 text-sm">
          <button onClick={() => { setSelectedCompany(row); setModalMode('edit') }} className="text-navy hover:underline">Edit</button>
          <button onClick={() => handleDelete(row)} className="text-danger hover:underline">Delete</button>
        </div>
      ),
    },
  ]

  return (
    <Layout title="Companies">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <input
          className="px-3 py-2 rounded-lg border border-border text-sm w-64"
          placeholder="Search company or location..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPageNumber(0) }}
        />
        <button
          onClick={() => setModalMode('add')}
          className="ml-auto px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors"
        >
          + Add Company
        </button>
      </div>

      <DataTable columns={columns} page={page} loading={loading} onPageChange={setPageNumber} emptyMessage="No companies found" />

      <Modal title="Add Company" isOpen={modalMode === 'add'} onClose={() => setModalMode(null)}>
        <CompanyForm onSubmit={handleAdd} onCancel={() => setModalMode(null)} submitLabel="Add Company" />
      </Modal>

      <Modal title="Edit Company" isOpen={modalMode === 'edit'} onClose={() => setModalMode(null)}>
        {selectedCompany && (
          <CompanyForm initialData={selectedCompany} onSubmit={handleEdit} onCancel={() => setModalMode(null)} submitLabel="Save Changes" />
        )}
      </Modal>
    </Layout>
  )
}
