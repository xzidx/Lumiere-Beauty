
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  User, Mail, Phone, ShieldCheck, CalendarDays, Pencil,
  Save, X, Package, MapPin, LockKeyhole, LogOut,
  ChevronRight, Plus, Trash2, Home, MapPinned
} from 'lucide-react'

const API = 'http://localhost:8080/api'
const emptyAddress = { recipientName: '', phone: '', address: '', city: '' }

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [savingAddress, setSavingAddress] = useState(false)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [addressForm, setAddressForm] = useState(emptyAddress)

  useEffect(() => {
    if (!user) navigate('/login')
    else setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || ''
    })
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) fetchAddresses()
  }, [user?.id])

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true)
      const { data } = await axios.get(`${API}/addresses/user/${user.id}`)
      setAddresses(data)
    } catch (error) {
      console.error(error)
      alert('Could not load addresses.')
    } finally {
      setAddressLoading(false)
    }
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleAddressChange = (e) =>
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.put(`${API}/users/${user.id}`, formData)
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Could not update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      ...emptyAddress,
      recipientName: user.fullName || '',
      phone: user.phone || ''
    })
    setShowAddressForm(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      recipientName: address.recipientName || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || ''
    })
    setShowAddressForm(true)
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    try {
      setSavingAddress(true)
      const url = editingAddressId
        ? `${API}/addresses/${editingAddressId}/user/${user.id}`
        : `${API}/addresses/user/${user.id}`

      if (editingAddressId) await axios.put(url, addressForm)
      else await axios.post(url, addressForm)

      setShowAddressForm(false)
      setEditingAddressId(null)
      setAddressForm(emptyAddress)
      await fetchAddresses()
      alert(editingAddressId ? 'Address updated successfully!' : 'Address added successfully!')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Could not save address.')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    try {
      await axios.delete(`${API}/addresses/${id}/user/${user.id}`)
      setAddresses(prev => prev.filter(a => a.id !== id))
      alert('Address deleted successfully!')
    } catch (error) {
      console.error(error)
      alert('Could not delete address.')
    }
  }

  const cancelAddress = () => {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setAddressForm(emptyAddress)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  const inputClass = "w-full rounded-lg border border-line bg-[#FBF8F2] px-4 py-3 text-sm outline-none focus:border-rose"

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-12">
      <div className="container-page">
        <div className="mb-10">
          <p className="eyebrow text-sage">My Account</p>
          <h1 className="mt-3 font-display text-4xl text-wine md:text-5xl">My Profile</h1>
          <p className="mt-3 text-sm text-muted">Manage your personal information and account settings.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside>
            <div className="rounded-2xl border border-line bg-white p-7 shadow-soft">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#ECEBDD] text-wine">
                <User size={42} strokeWidth={1.3} />
              </div>

              <div className="mt-5 text-center">
                <h2 className="font-display text-2xl text-wine">{user.fullName}</h2>
                <p className="mt-1 text-sm text-muted">{user.email}</p>
                <span className="mt-4 inline-block rounded-full bg-[#ECEBDD] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sage">
                  {user.role}
                </span>
              </div>

              <div className="my-6 border-t border-line" />
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted">
                  <CalendarDays size={18} className="text-sage" />
                  Member since {user.createdAt ? String(user.createdAt).split('T')[0] : 'Recently'}
                </div>
                <div className="flex items-center gap-3 text-muted">
                  <ShieldCheck size={18} className="text-sage" />
                  Personal Account
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              {[
                { label: 'My Orders', icon: Package, action: () => navigate('/orders') },
                { label: 'My Addresses', icon: MapPin, action: () => document.getElementById('my-addresses')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: 'Logout', icon: LogOut, action: handleLogout }
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} onClick={action} className={`flex w-full items-center justify-between border-b border-line px-5 py-4 text-sm font-medium transition hover:bg-[#FBF8F2] ${label === 'Logout' ? 'text-red-500' : 'text-wine'}`}>
                  <span className="flex items-center gap-3"><Icon size={18} className={label === 'Logout' ? '' : 'text-sage'} />{label}</span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </aside>

          <main>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft md:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                <div>
                  <h2 className="font-display text-2xl text-wine">Personal Information</h2>
                  <p className="mt-2 text-sm text-muted">Update your personal details.</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-outline flex items-center gap-2 rounded-lg">
                    <Pencil size={16} /> Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="mt-7">
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: 'Full Name', name: 'fullName', icon: User, type: 'text' },
                    { label: 'Email Address', name: 'email', icon: Mail, type: 'email' },
                    { label: 'Phone Number', name: 'phone', icon: Phone, type: 'tel' },
                    { label: 'Account Role', name: 'role', icon: ShieldCheck, type: 'text', value: user.role, disabled: true }
                  ].map(({ label, name, icon: Icon, type, value, disabled }) => (
                    <div key={name}>
                      <label className="mb-2 block text-sm font-semibold text-wine">{label}</label>
                      <div className="relative">
                        <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" />
                        <input
                          type={type}
                          name={name}
                          value={value ?? formData[name]}
                          onChange={handleChange}
                          disabled={disabled || !isEditing}
                          required={name !== 'phone'}
                          className="w-full rounded-lg border border-line bg-[#FBF8F2] py-3 pl-11 pr-4 text-sm text-ink outline-none focus:border-rose disabled:opacity-80"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 rounded-lg disabled:opacity-50">
                      <Save size={17} /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => {
                      setFormData({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' })
                      setIsEditing(false)
                    }} disabled={loading} className="btn-outline flex items-center gap-2 rounded-lg">
                      <X size={17} /> Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div id="my-addresses" className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-soft md:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                <div>
                  <h2 className="font-display text-2xl text-wine">My Addresses</h2>
                  <p className="mt-2 text-sm text-muted">Manage your delivery addresses.</p>
                </div>
                <button onClick={handleAddAddress} className="btn-primary flex items-center gap-2 rounded-lg">
                  <Plus size={17} /> Add Address
                </button>
              </div>

              {addressLoading ? (
                <p className="py-12 text-center text-sm text-muted">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="py-12 text-center">
                  <MapPinned size={42} className="mx-auto text-sage" />
                  <h3 className="mt-4 font-display text-xl text-wine">No addresses yet</h3>
                  <p className="mt-2 text-sm text-muted">Add your first delivery address.</p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {addresses.map(address => (
                    <div key={address.id} className="rounded-xl border border-line bg-[#FBF8F2] p-5">
                      <div className="flex items-center justify-between text-wine">
                        <h3 className="flex items-center gap-2 font-semibold"><Home size={18} className="text-sage" />Delivery Address</h3>
                        <span className="rounded-full bg-[#ECEBDD] px-3 py-1 text-xs text-sage">Saved</span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-muted">
                        <p className="font-semibold text-wine">{address.recipientName}</p>
                        <p className="flex items-center gap-2"><Phone size={15} />{address.phone}</p>
                        <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />{address.address}</p>
                        <p className="pl-6">{address.city}</p>
                      </div>
                      <div className="mt-5 flex gap-3 border-t border-line pt-4">
                        <button onClick={() => handleEditAddress(address)} className="flex items-center gap-2 text-sm font-medium text-wine hover:text-rose"><Pencil size={15} />Edit</button>
                        <button onClick={() => handleDeleteAddress(address.id)} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700"><Trash2 size={15} />Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showAddressForm && (
              <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-soft md:p-9">
                <div className="flex items-center justify-between border-b border-line pb-6">
                  <div>
                    <h2 className="font-display text-2xl text-wine">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h2>
                    <p className="mt-2 text-sm text-muted">Enter your delivery information.</p>
                  </div>
                  <button onClick={cancelAddress} className="text-muted hover:text-wine"><X size={22} /></button>
                </div>

                <form onSubmit={handleSaveAddress} className="mt-7">
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      { label: 'Recipient Name', name: 'recipientName', placeholder: 'Enter recipient name' },
                      { label: 'Phone Number', name: 'phone', placeholder: 'Enter phone number' },
                      { label: 'Street Address', name: 'address', placeholder: 'House number, street, sangkat...', area: true },
                      { label: 'City / Province', name: 'city', placeholder: 'e.g. Phnom Penh' }
                    ].map(({ label, name, placeholder, area }) => (
                      <div key={name} className={area || name === 'city' ? 'md:col-span-2' : ''}>
                        <label className="mb-2 block text-sm font-semibold text-wine">{label}</label>
                        {area ? (
                          <textarea name={name} value={addressForm[name]} onChange={handleAddressChange} placeholder={placeholder} rows={3} required className={inputClass} />
                        ) : (
                          <input name={name} value={addressForm[name]} onChange={handleAddressChange} placeholder={placeholder} maxLength={name === 'phone' ? 20 : 100} required className={inputClass} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                    <button type="submit" disabled={savingAddress} className="btn-primary flex items-center gap-2 rounded-lg disabled:opacity-50">
                      <Save size={17} /> {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button type="button" onClick={cancelAddress} disabled={savingAddress} className="btn-outline flex items-center gap-2 rounded-lg">
                      <X size={17} /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#ECEBDD] text-sage">
                  <LockKeyhole size={23} />
                </div>
                <div>
                  <h3 className="font-semibold text-wine">Password & Security</h3>
                  <p className="mt-1 text-xs text-muted">Keep your account secure.</p>
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
