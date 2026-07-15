import { useState } from 'react'
import FormField, { inputClasses } from '../components/FormField'

const emptyForm = { companyName: '', ctc: '', location: '', eligibilityCgpa: '', lastDateToApply: '' }

export default function CompanyForm({ initialData, onSubmit, onCancel, submitLabel = 'Save Company' }) {
  const [form, setForm] = useState(initialData ?? emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const next = {}
    if (!form.companyName.trim()) next.companyName = 'Company name is required'
    if (!form.ctc || Number(form.ctc) <= 0) next.ctc = 'CTC must be greater than 0'
    if (!form.location.trim()) next.location = 'Location is required'
    if (form.eligibilityCgpa === '' || Number(form.eligibilityCgpa) < 0 || Number(form.eligibilityCgpa) > 10)
      next.eligibilityCgpa = 'Eligibility CGPA must be between 0 and 10'
    if (!form.lastDateToApply) next.lastDateToApply = 'Last date to apply is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({ ...form, ctc: Number(form.ctc), eligibilityCgpa: Number(form.eligibilityCgpa) })
    } catch (err) {
      const backendErrors = err.response?.data?.data
      if (backendErrors && typeof backendErrors === 'object') setErrors(backendErrors)
      else setErrors({ _general: err.response?.data?.message ?? 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors._general && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-danger-bg text-danger text-sm">{errors._general}</div>
      )}

      <FormField label="Company Name" error={errors.companyName}>
        <input className={inputClasses(errors.companyName)} value={form.companyName} onChange={handleChange('companyName')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="CTC (LPA)" error={errors.ctc}>
          <input type="number" step="0.01" className={inputClasses(errors.ctc)} value={form.ctc} onChange={handleChange('ctc')} />
        </FormField>
        <FormField label="Location" error={errors.location}>
          <input className={inputClasses(errors.location)} value={form.location} onChange={handleChange('location')} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Eligibility CGPA" error={errors.eligibilityCgpa}>
          <input type="number" step="0.01" min="0" max="10" className={inputClasses(errors.eligibilityCgpa)} value={form.eligibilityCgpa} onChange={handleChange('eligibilityCgpa')} />
        </FormField>
        <FormField label="Last Date to Apply" error={errors.lastDateToApply}>
          <input type="date" className={inputClasses(errors.lastDateToApply)} value={form.lastDateToApply} onChange={handleChange('lastDateToApply')} />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-canvas transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-60">
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
