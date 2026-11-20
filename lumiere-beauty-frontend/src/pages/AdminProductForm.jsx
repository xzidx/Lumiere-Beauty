
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import axiosClient from '../api/axiosClient'

const empty = {
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    imageUrl: '',
    description: ''
}

export default function AdminProductForm() {
    const { id } = useParams()
    const editing = Boolean(id)
    const navigate = useNavigate()

    const { products, brands, categories, saveProduct } = useShop()

    const [form, setForm] = useState(empty)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Load existing product or set default category
    useEffect(() => {
        if (editing) {
            const found = products.find(p => String(p.id) === id)

            if (found) {
                const brand = brands.find(b => b.name === found.brand)
                const category = categories.find(c => c.name === found.category)

                setForm({
                    name: found.name || '',
                    brand: brand ? String(brand.id) : '',
                    category: category ? String(category.id) : '',
                    price: found.price ?? '',
                    stock: found.stock ?? found.stockQuantity ?? '',
                    status: found.status || 'Active',
                    imageUrl: found.imageUrl || '',
                    description: found.description || ''
                })
            }
        } else if (categories.length > 0) {
            const skincare = categories.find(c => c.name === 'Skincare')

            setForm(f => ({
                ...f,
                category: String(skincare?.id ?? categories[0].id)
            }))
        }
    }, [id, editing, products, brands, categories])

    const change = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const submit = async e => {
        e.preventDefault()
        setError('')

        if (!form.name.trim() || form.price === '' || form.stock === '') {
            setError('Please complete the product name, price and stock.')
            return
        }

        const product = {
            name: form.name.trim(),
            brand: form.brand ? { id: Number(form.brand) } : null,
            category: form.category ? { id: Number(form.category) } : null,
            price: Number(form.price),
            stockQuantity: Number(form.stock),
            status: form.status,
            imageUrl: form.imageUrl,
            description: form.description
        }

        try {
            setLoading(true)

            const response = editing
                ? await axiosClient.put(`/products/${id}`, product)
                : await axiosClient.post('/products', product)

            const saved = response.data

            saveProduct({
                ...saved,
                id: String(saved.id),
                brand: saved.brand?.name || '',
                category: saved.category?.name || '',
                stock: saved.stockQuantity ?? 0
            })

            navigate('/admin/products')
        } catch (err) {
            console.error('Save product error:', err)
            setError(
                err.response?.data?.message ||
                'Could not save product. Please check your backend.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted">
                <ArrowLeft size={15} /> Back to products
            </Link>

            <div className="mt-5">
                <p className="eyebrow text-rose">
                    {editing ? 'Catalogue update' : 'New catalogue item'}
                </p>

                <h1 className="mt-2 font-display text-4xl">
                    {editing ? 'Edit product' : 'Add product'}
                </h1>

                <p className="mt-2 text-sm text-muted">
                    Enter the product information below.
                </p>
            </div>

            <form onSubmit={submit} className="mt-8 max-w-3xl rounded-2xl border border-line bg-white p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">

                    <label className="text-xs font-semibold">
                        Product name *
                        <input
                            className="field mt-2"
                            name="name"
                            value={form.name}
                            onChange={change}
                            required
                            placeholder="e.g. Daily Hydrating Serum"
                        />
                    </label>

                    <label className="text-xs font-semibold">
                        Brand
                        <select className="field mt-2" name="brand" value={form.brand} onChange={change}>
                            <option value="">Select brand</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-xs font-semibold">
                        Category
                        <select className="field mt-2" name="category" value={form.category} onChange={change}>
                            <option value="">Select category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="text-xs font-semibold">
                        Price (USD) *
                        <input
                            className="field mt-2"
                            type="number"
                            min="0"
                            step="0.01"
                            name="price"
                            value={form.price}
                            onChange={change}
                            required
                            placeholder="0.00"
                        />
                    </label>

                    <label className="text-xs font-semibold">
                        Stock quantity *
                        <input
                            className="field mt-2"
                            type="number"
                            min="0"
                            name="stock"
                            value={form.stock}
                            onChange={change}
                            required
                            placeholder="0"
                        />
                    </label>

                    <label className="text-xs font-semibold">
                        Status
                        <select className="field mt-2" name="status" value={form.status} onChange={change}>
                            <option>Active</option>
                            <option>Draft</option>
                        </select>
                    </label>

                    <label className="text-xs font-semibold md:col-span-2">
                        Image URL
                        <input
                            className="field mt-2"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={change}
                            placeholder="https://example.com/product.jpg"
                        />
                    </label>

                    <label className="text-xs font-semibold md:col-span-2">
                        Description
                        <textarea
                            className="field mt-2 min-h-28"
                            name="description"
                            value={form.description}
                            onChange={change}
                            placeholder="Describe the product..."
                        />
                    </label>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-rose">{error}</p>
                )}

                <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-6">
                    <button className="btn-primary" disabled={loading}>
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save product'}
                    </button>

                    <Link to="/admin/products" className="btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </>
    )
}
