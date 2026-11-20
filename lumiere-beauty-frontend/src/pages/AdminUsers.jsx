
import { useEffect, useMemo, useState } from 'react'
import { UserPlus, Search, UserRound } from 'lucide-react'
import axiosClient from '../api/axiosClient'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [query, setQuery] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    })

    // Get all users from Spring Boot
    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axiosClient.get('/users')

            setUsers(response.data)
        } catch (error) {
            console.error(error)
            setError('Could not load users. Please check your backend.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Search users
    const filtered = useMemo(
        () => users.filter(user =>
            `${user.fullName} ${user.email} ${user.role}`
                .toLowerCase()
                .includes(query.toLowerCase())
        ),
        [users, query]
    )

    // Add a real user
    const addUser = async (event) => {
        event.preventDefault()

        try {
            setMessage('')
            setError('')

            await axiosClient.post('/users', {
                fullName: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role
            })

            setForm({
                name: '',
                email: '',
                password: '',
                role: 'CUSTOMER'
            })

            setShowForm(false)
            setMessage('User account created successfully!')

            // Reload users from database
            await fetchUsers()

        } catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                'Could not create user. Please check the information.'
            )
        }
    }

    const isAdmin = (role) => role?.toUpperCase() === 'ADMIN'

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="eyebrow text-sage">Store access</p>
                    <h1 className="mt-2 font-display text-4xl text-wine">
                        User management
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        View registered users and create new accounts.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setShowForm(value => !value)
                        setMessage('')
                        setError('')
                    }}
                    className="btn-primary"
                >
                    <UserPlus size={16} /> Add user
                </button>
            </div>

            {/* Statistics */}
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-white p-5">
                    <p className="text-xs text-muted">Total accounts</p>
                    <p className="mt-2 font-display text-3xl text-wine">
                        {users.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                    <p className="text-xs text-muted">Administrators</p>
                    <p className="mt-2 font-display text-3xl text-wine">
                        {users.filter(user => isAdmin(user.role)).length}
                    </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                    <p className="text-xs text-muted">Customers</p>
                    <p className="mt-2 font-display text-3xl text-wine">
                        {users.filter(user => !isAdmin(user.role)).length}
                    </p>
                </div>
            </div>

            {/* Add User Form */}
            {showForm && (
                <form
                    onSubmit={addUser}
                    className="mt-6 rounded-2xl border border-line bg-white p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-2xl text-wine">
                                Add an account
                            </h2>
                            <p className="mt-1 text-xs text-muted">
                                Create a real customer or administrator account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-sm text-muted"
                        >
                            Close
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="text-xs font-semibold text-ink">
                            Full name
                            <input
                                required
                                className="field mt-2 text-sm"
                                value={form.name}
                                onChange={e =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                placeholder="e.g. Alex Morgan"
                            />
                        </label>

                        <label className="text-xs font-semibold text-ink">
                            Email address
                            <input
                                required
                                type="email"
                                className="field mt-2 text-sm"
                                value={form.email}
                                onChange={e =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                placeholder="name@example.com"
                            />
                        </label>

                        <label className="text-xs font-semibold text-ink">
                            Password
                            <input
                                required
                                type="password"
                                minLength={6}
                                className="field mt-2 text-sm"
                                value={form.password}
                                onChange={e =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                placeholder="Enter password"
                            />
                        </label>

                        <label className="text-xs font-semibold text-ink">
                            Role
                            <select
                                className="field mt-2 text-sm"
                                value={form.role}
                                onChange={e =>
                                    setForm({ ...form, role: e.target.value })
                                }
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button type="submit" className="btn-primary">
                            Save account
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {message && (
                <p className="mt-4 rounded-xl bg-cream p-4 text-sm text-sage">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* Search */}
            <div className="mt-7">
                <label className="relative block w-full max-w-xl">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                        className="field !h-12 !min-h-12 !rounded-xl !pl-11 !pr-4 text-sm leading-normal"
                        placeholder="Search name, email or role"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* User List */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
                <div className="hidden grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)] items-center gap-4 bg-cream px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted md:grid">
                    <span>User</span>
                    <span>Email</span>
                    <span>Role</span>
                </div>

                {loading ? (
                    <p className="p-10 text-center text-sm text-muted">
                        Loading users...
                    </p>
                ) : (
                    <>
                        {filtered.map(user => (
                            <div
                                key={user.id}
                                className="grid gap-4 border-t border-line p-4 md:grid-cols-[minmax(180px,1.4fr)_minmax(190px,1.5fr)_minmax(125px,1fr)] md:items-center md:gap-4 md:px-5 md:py-5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rose">
                                        <UserRound size={18} />
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-ink">
                                            {user.fullName}
                                        </p>
                                        <p className="text-[11px] text-muted">
                                            Account #{user.id}
                                        </p>
                                    </div>
                                </div>

                                <span className="break-all text-xs text-muted">
                                    {user.email}
                                </span>

                                <span className="text-xs font-semibold text-wine">
                                    {isAdmin(user.role) ? 'Admin' : 'Customer'}
                                </span>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <p className="p-10 text-center text-sm text-muted">
                                No matching accounts.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
