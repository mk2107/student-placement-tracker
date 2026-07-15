import { useState } from 'react'
import FormField, { inputClasses } from '../components/FormField'

const BRANCH_OPTIONS = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE']

const emptyForm = { name: '', rollNumber: '', email: '', branch: 'CSE', cgpa: '', skills: '', phoneNumber: '' }

export default function StudentForm({ initialData, onSubmit, onCancel, submitLabel = 'Save Student' }) {
  const [form, setForm] = useState(initialData ?? emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  // Client-side validation gives instant feedback; the backend re-validates
  // the same rules independently, since a client can always be bypassed.
  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.rollNumber.trim()) next.rollNumber = 'Roll number is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.branch) next.branch = 'Branch is required'
    if (form.cgpa === '' || Number(form.cgpa) < 0 || Number(form.cgpa) > 10) next.cgpa = 'CGPA must be between 0 and 10'
    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) next.phoneNumber = 'Phone must be exactly 10 digits'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({ ...form, cgpa: Number(form.cgpa) })
    } catch (err) {
      // Field-level errors coming back from backend validation (400) get mapped onto the form.
      const backendErrors = err.response?.data?.data
      if (backendErrors && typeof backendErrors === 'object') {
        setErrors(backendErrors)
      } else {
        setErrors({ _general: err.response?.data?.message ?? 'Something went wrong' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors._general && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-danger-bg text-danger text-sm">{errors._general}</div>
      )}

      <FormField label="Full Name" error={errors.name}>
        <input className={inputClasses(errors.name)} value={form.name} onChange={handleChange('name')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Roll Number" error={errors.rollNumber}>
          <input className={inputClasses(errors.rollNumber)} value={form.rollNumber} onChange={handleChange('rollNumber')} />
        </FormField>
        <FormField label="Branch" error={errors.branch}>
          <select className={inputClasses(errors.branch)} value={form.branch} onChange={handleChange('branch')}>
            {BRANCH_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Email" error={errors.email}>
        <input type="email" className={inputClasses(errors.email)} value={form.email} onChange={handleChange('email')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="CGPA" error={errors.cgpa}>
          <input type="number" step="0.01" min="0" max="10" className={inputClasses(errors.cgpa)} value={form.cgpa} onChange={handleChange('cgpa')} />
        </FormField>
        <FormField label="Phone Number" error={errors.phoneNumber}>
          <input className={inputClasses(errors.phoneNumber)} value={form.phoneNumber} onChange={handleChange('phoneNumber')} placeholder="10 digits" />
        </FormField>
      </div>

      <FormField label="Skills (comma-separated)" error={errors.skills}>
        <textarea className={inputClasses(errors.skills)} rows={2} value={form.skills} onChange={handleChange('skills')} />
      </FormField>

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
