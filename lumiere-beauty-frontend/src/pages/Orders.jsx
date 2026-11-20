import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { authApi, orderApi, paymentApi } from '../services/api'

export default function Orders() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState({}) // { orderId: payment }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionExpired, setSessionExpired] = useState(false)

  // No fallback to user 1 anymore. If nobody is logged in, userId is undefined.
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const userId = user?.id

  useEffect(() => {
    if (!userId) return // not logged in, the redirect below handles it

    orderApi.getByUser(userId)
      .then(async (list) => {
        // Safety net only: never show orders that belong to someone else.
        // Real protection is on the backend. Orders without userId are kept
        // so this does not hide everything if the field has another name.
        const mine = list.filter(
          (o) => o.userId === undefined || String(o.userId) === String(userId)
        )
        setOrders(mine)

        // load each order's payment (ignore orders with no payment)
        const entries = await Promise.all(
          mine.map((o) =>
            paymentApi.getByOrder(o.id).then((p) => [o.id, p]).catch(() => [o.id, null])
          )
        )
        setPayments(Object.fromEntries(entries))
      })
      .catch((err) => {
        if (err.status === 401 || err.status === 403) {
          authApi.logout()
          setSessionExpired(true)
        } else {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))
  }, [userId])

  // Require login
  if (!userId || sessionExpired) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <main className="container-page min-h-[55vh] py-16">
      <p className="eyebrow text-rose">Your account</p>
      <h1 className="mt-3 font-display text-4xl">Order history</h1>

      {loading && <p className="mt-8 text-muted">Loading orders...</p>}
      {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-line p-8 text-center">
          <p className="text-muted">You have no orders yet.</p>
          <Link to="/shop" className="btn-primary mt-5">Start shopping</Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((o) => {
          const pay = payments[o.id]
          return (
            <div key={o.id} className="flex justify-between gap-4 rounded-2xl border border-line p-5">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="mt-1 text-xs text-muted">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                </p>
                {pay && (
                  <p className="mt-2 text-xs text-muted">
                    Payment: {pay.paymentMethod} · {pay.paymentStatus}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p>${Number(o.totalAmount).toFixed(2)}</p>
                <p className="mt-1 text-xs text-muted">{o.status}</p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}