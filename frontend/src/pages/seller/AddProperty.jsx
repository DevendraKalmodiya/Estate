import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    purpose: 'sale',
    price: '',
    city: '',
    locality: '',
    bedrooms: '',
    bathrooms: '',
    built_up_area: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        bedrooms: formData.bedrooms ? Number.parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? Number.parseInt(formData.bathrooms, 10) : null,
        built_up_area: formData.built_up_area ? Number.parseFloat(formData.built_up_area) : null,
      }

      await api.post('/properties', payload)
      window.alert('Property saved as draft successfully!')
      navigate('/')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to add property. Ensure you have seller privileges.',
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClassName =
    'w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-primary'
  const labelClassName = 'mb-1 block text-sm font-medium text-slate-700'

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Add New Property Listing</h1>
      {error && (
        <div role="alert" className="mb-6 rounded-lg bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClassName}>Property Title</label>
            <input
              id="title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className={inputClassName}
              placeholder="e.g., Luxury 3 BHK in Andheri West"
            />
          </div>

          <div>
            <label htmlFor="property_type" className={labelClassName}>Property Type</label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="apartment">Apartment</option>
              <option value="house">Independent House</option>
              <option value="plot">Plot / Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="purpose" className={labelClassName}>Purpose</label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className={labelClassName}>Price (₹)</label>
            <input
              id="price"
              type="number"
              name="price"
              required
              min="0"
              step="any"
              value={formData.price}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="built_up_area" className={labelClassName}>Built-up Area (sq.ft)</label>
            <input
              id="built_up_area"
              type="number"
              name="built_up_area"
              min="0"
              step="any"
              value={formData.built_up_area}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="city" className={labelClassName}>City</label>
            <input
              id="city"
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="locality" className={labelClassName}>Locality</label>
            <input
              id="locality"
              type="text"
              name="locality"
              required
              value={formData.locality}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className={labelClassName}>Bedrooms</label>
            <input
              id="bedrooms"
              type="number"
              name="bedrooms"
              min="0"
              value={formData.bedrooms}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className={labelClassName}>Bathrooms</label>
            <input
              id="bathrooms"
              type="number"
              name="bathrooms"
              min="0"
              value={formData.bathrooms}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClassName}>Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={inputClassName}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Save Property Listing'}
        </button>
      </form>
    </section>
  )
}
