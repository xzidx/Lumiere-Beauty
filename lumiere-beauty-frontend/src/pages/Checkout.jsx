
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { orderApi, paymentApi } from '../services/api'

export default function Checkout() {
  const { cart, clearCart } = useShop()
  const location = useLocation()

  // Get logged-in user safely
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }

  const user = getUser()

  // Form state
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
  })

  // Checkout states
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  // Calculate total price
  const total = cart.reduce(
    (sum, product) => sum + Number(product.price) * product.quantity,
    0
  )

  // Handle form changes
  const setField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }))
  }

  // Must login before checkout
  if (!user?.id && !result) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      // 1. Validate user
      if (!user?.id) {
        throw new Error('Please login before placing an order.')
      }

      // 2. Validate cart
      if (!cart.length) {
        throw new Error('Your cart is empty.')
      }

      // 3. Validate total
      if (total <= 0) {
        throw new Error('Invalid order amount.')
      }

      // 4. Validate delivery information
      if (
        !form.fullName.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.address.trim() ||
        !form.city.trim()
      ) {
        throw new Error('Please complete all delivery information.')
      }

      // IMPORTANT:
      // Replace this with the real address ID
      // from your address database.
      const addressId = 1

      // 5. Prepare order data
      const orderRequest = {
        userId: user.id,
        addressId: addressId,
        totalAmount: Number(total.toFixed(2)),
        paymentMethod: paymentMethod,

        items: cart.map((product) => ({
          productId: product.id,
          productName: product.name,
          quantity: product.quantity,
          price: Number(product.price),
        })),

        shipping: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
      }

      // Debug request
      console.log('Order Request:', orderRequest)

      // 6. Create order
      const order = await orderApi.create(orderRequest)

      console.log('Order Created:', order)

      // Check order response
      if (!order?.id) {
        throw new Error(
          'Order was created, but the response does not contain an order ID.'
        )
      }

      // 7. Retrieve payment information
      let payment = null

      try {
        payment = await paymentApi.getByOrder(order.id)

        console.log('Payment Information:', payment)
      } catch (paymentError) {
        console.error(
          'Could not retrieve payment:',
          paymentError.response?.data || paymentError.message
        )
      }

      // 8. Save result
      setResult({
        order,
        payment,
      })

      // 9. Clear shopping cart
      clearCart()

    } catch (err) {
      console.error('Checkout Error:', err)

      // Get detailed Spring Boot error
      const responseData = err.response?.data

      if (responseData) {
        console.error('Backend Response:', responseData)

        if (typeof responseData === 'string') {
          setError(responseData)
        } else {
          setError(
            responseData.message ||
            responseData.error ||
            responseData.detail ||
            JSON.stringify(responseData)
          )
        }
      } else {
        setError(
          err.message || 'Something went wrong. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  // Successful order page
  if (result) {
    return (
      <main className="container-page py-24 text-center">

        <p className="eyebrow text-rose">
          Thank you
        </p>

        <h1 className="mt-3 font-display text-4xl">
          Order placed
        </h1>

        <p className="mt-4 text-muted">
          Order number: {result.order.orderNumber || result.order.id}
        </p>

        <p className="mt-2 text-sm text-muted">
          Order status: {result.order.status || 'PENDING'}
        </p>

        {result.payment && (
          <p className="mt-2 text-sm text-muted">
            Payment: {result.payment.paymentMethod}
            {' · '}
            {result.payment.paymentStatus}
            {' · $'}
            {Number(result.payment.amount).toFixed(2)}
          </p>
        )}

        <Link
          to="/shop"
          className="btn-primary mt-8"
        >
          Continue shopping
        </Link>

      </main>
    )
  }

  // Empty cart
  if (!cart.length) {
    return (
      <main className="container-page py-24 text-center">

        <h1 className="font-display text-3xl">
          Your bag is empty
        </h1>

        <Link
          to="/shop"
          className="btn-primary mt-6"
        >
          Shop now
        </Link>

      </main>
    )
  }

  // Checkout page
  return (
    <main className="container-page max-w-3xl py-12">

      <p className="eyebrow text-rose">
        Almost yours
      </p>

      <h1 className="mt-3 font-display text-4xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]"
      >

        {/* Contact and delivery */}
        <div className="space-y-4">

          <h2 className="font-semibold">
            Contact & delivery
          </h2>

          <input
            required
            className="field"
            placeholder="Full name"
            value={form.fullName}
            onChange={setField('fullName')}
          />

          <input
            required
            type="email"
            className="field"
            placeholder="Email address"
            value={form.email}
            onChange={setField('email')}
          />

          <input
            required
            type="tel"
            className="field"
            placeholder="Phone number"
            value={form.phone}
            onChange={setField('phone')}
          />

          <input
            required
            className="field"
            placeholder="Delivery address"
            value={form.address}
            onChange={setField('address')}
          />

          <input
            required
            className="field"
            placeholder="City"
            value={form.city}
            onChange={setField('city')}
          />

          {/* Payment method */}
          <label className="block text-sm font-medium">

            Payment method

            <select
              className="field mt-2"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >

              <option value="CASH">
                Cash on delivery
              </option>

              <option value="BANK_TRANSFER">
                Bank transfer
              </option>

            </select>

          </label>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading
              ? 'Placing order...'
              : 'Place order'}
          </button>

        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl bg-cream p-5">

          <h2 className="font-display text-xl">
            Summary
          </h2>

          {cart.map((product) => (

            <div
              key={product.id}
              className="mt-3 flex justify-between gap-3 text-xs"
            >

              <span>
                {product.name} × {product.quantity}
              </span>

              <span>
                $
                {(
                  Number(product.price) *
                  product.quantity
                ).toFixed(2)}
              </span>

            </div>

          ))}

          <div className="mt-5 flex justify-between border-t border-line pt-4 font-semibold">

            <span>
              Total
            </span>

            <span>
              ${total.toFixed(2)}
            </span>

          </div>

        </aside>

      </form>

    </main>
  )
}
