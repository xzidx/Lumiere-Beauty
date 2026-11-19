import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Pencil,
  Save,
  X,
  Package,
  MapPin,
  LockKeyhole,
  LogOut,
  ChevronRight
} from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()

  // Get logged-in user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  // Update input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Save changes
  const handleSave = (e) => {
    e.preventDefault()

    const updatedUser = { ...user, ...formData }

    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || ''
    })
    setIsEditing(false)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-12">

      <div className="container-page">

        {/* Page Heading */}
        <div className="mb-10">
          <p className="eyebrow text-sage">My Account</p>
          <h1 className="mt-3 font-display text-4xl text-wine md:text-5xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-muted">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">

          {/* Left Profile Card */}
          <aside>

            <div className="rounded-2xl border border-line bg-white p-7 shadow-soft">

              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#ECEBDD] text-wine">
                <User size={42} strokeWidth={1.3} />
              </div>

              <div className="mt-5 text-center">
                <h2 className="font-display text-2xl text-wine">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {user.email}
                </p>

                <span className="mt-4 inline-block rounded-full bg-[#ECEBDD] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sage">
                  {user.role}
                </span>
              </div>

              <div className="my-6 border-t border-line" />

              <div className="space-y-4 text-sm">

                <div className="flex items-center gap-3 text-muted">
                  <CalendarDays size={18} className="text-sage" />
                  <span>Member since {user.createdAt || 'Recently'}</span>
                </div>

                <div className="flex items-center gap-3 text-muted">
                  <ShieldCheck size={18} className="text-sage" />
                  <span>Personal Account</span>
                </div>

              </div>

            </div>

            {/* Account Navigation */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">

              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-line px-5 py-4 text-sm font-medium text-wine transition hover:bg-[#FBF8F2]"
              >
                <span className="flex items-center gap-3">
                  <Package size={18} className="text-sage" />
                  My Orders
                </span>
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-line px-5 py-4 text-sm font-medium text-wine transition hover:bg-[#FBF8F2]"
              >
                <span className="flex items-center gap-3">
                  <MapPin size={18} className="text-sage" />
                  My Addresses
                </span>
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <span className="flex items-center gap-3">
                  <LogOut size={18} />
                  Logout
                </span>
                <ChevronRight size={17} />
              </button>

            </div>

          </aside>

          {/* Right Profile Information */}
          <main>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft md:p-9">

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">

                <div>
                  <h2 className="font-display text-2xl text-wine">
                    Personal Information
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Update your personal details.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center gap-2 rounded-lg"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}

              </div>

              <form onSubmit={handleSave} className="mt-7">

                <div className="grid gap-6 md:grid-cols-2">

                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-wine">
                      Full Name
                    </label>

                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />

                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-line bg-[#FBF8F2] py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-rose disabled:opacity-80"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-wine">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-line bg-[#FBF8F2] py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-rose disabled:opacity-80"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-wine">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-line bg-[#FBF8F2] py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-rose disabled:opacity-80"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-wine">
                      Account Role
                    </label>

                    <div className="relative">
                      <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />

                      <input
                        type="text"
                        value={user.role || ''}
                        disabled
                        className="w-full rounded-lg border border-line bg-[#FBF8F2] py-3 pl-11 pr-4 text-sm text-ink opacity-80"
                      />
                    </div>
                  </div>

                </div>

                {/* Buttons */}
                {isEditing && (
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">

                    <button
                      type="submit"
                      className="btn-primary flex items-center gap-2 rounded-lg"
                    >
                      <Save size={17} />
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-outline flex items-center gap-2 rounded-lg"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                  </div>
                )}

              </form>

            </div>

            {/* Security Card */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6 shadow-soft">

              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#ECEBDD] text-sage">
                  <LockKeyhole size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-wine">
                    Password & Security
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Keep your account secure.
                  </p>
                </div>
              </div>

              <ChevronRight size={20} className="text-sage" />

            </div>

          </main>

        </div>
      </div>
    </div>
  )
}