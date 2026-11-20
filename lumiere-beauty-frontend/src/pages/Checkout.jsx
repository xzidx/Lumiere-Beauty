import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { orderApi, paymentApi } from '../services/api'

export default function Checkout() {
  const { cart, clearCart } = useShop()
  const location = useLocation()

  // Read the logged-in user fresh on every render (no fallback to user 1)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
  })
  const [result, setResult] = useState(null) // { order, payment }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  const total = cart.reduce((s, p) => s + p.price * p.quantity, 0)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // Must be logged in to order
  if (!user?.id && !result)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // TEMPORARY: replace with a real address id once an address API exists
      const addressId = 1

      // 1. Create the order for the logged-in user, including the products.
      const order = await orderApi.create({
        userId: user.id,
        addressId,
        totalAmount: Number(total.toFixed(2)),
        paymentMethod,
        items: cart.map((p) => ({
          productId: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        shipping: { ...form },
      })

      // 2. Read the payment back to show its status
      let payment = null
      try {
        payment = await paymentApi.getByOrder(order.id)
      } catch {
        /* the order is saved even if this read fails */
      }

      setResult({ order, payment })
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (result)
    return (
      <main className="container-page py-24 text-center">
        <p className="eyebrow text-rose">Thank you</p>
        <h1 className="mt-3 font-display text-4xl">Order placed</h1>
        <p className="mt-4 text-muted">Order number: {result.order.orderNumber}</p>
        {result.payment && (
          <p className="mt-2 text-sm text-muted">
            Payment: {result.payment.paymentMethod} · {result.payment.paymentStatus} · $
            {Number(result.payment.amount).toFixed(2)}
          </p>
        )}
        <Link to="/shop" className="btn-primary mt-8">Continue shopping</Link>
      </main>
    )

  if (!cart.length)
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <Link to="/shop" className="btn-primary mt-6">Shop now</Link>
      </main>
    )

  return (
    <main className="container-page max-w-3xl py-12">
      <p className="eyebrow text-rose">Almost yours</p>
      <h1 className="mt-3 font-display text-4xl">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <h2 className="font-semibold">Contact & delivery</h2>
          <input required className="field" placeholder="Full name"
            value={form.fullName} onChange={setField('fullName')} />
          <input required type="email" className="field" placeholder="Email address"
            value={form.email} onChange={setField('email')} />
          <input required className="field" placeholder="Phone number"
            value={form.phone} onChange={setField('phone')} />
          <input required className="field" placeholder="Delivery address"
            value={form.address} onChange={setField('address')} />
          <input required className="field" placeholder="City"
            value={form.city} onChange={setField('city')} />
          <label className="block text-sm font-medium">
            Payment method
            <select
              className="field mt-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">Cash on delivery</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
            </select>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </div>
        <aside className="h-fit rounded-2xl bg-cream p-5">
          <h2 className="font-display text-xl">Summary</h2>
          {cart.map((p) => (
            <div key={p.id} className="mt-3 flex justify-between gap-3 text-xs">
              <span>{p.name} × {p.quantity}</span>
              <span>${(p.price * p.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-5 flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </form>
    </main>
  )
}