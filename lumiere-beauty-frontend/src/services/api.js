
import axios from 'axios'

// ==========================================
// 1. API CONFIGURATION
// ==========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ==========================================
// 2. USER AUTHENTICATION
// ==========================================

export function getStoredUser() {
  try {
    const user = JSON.parse(
      localStorage.getItem('user') || 'null'
    )

    return user?.id ? user : null
  } catch {
    return null
  }
}

function getToken() {
  const direct = localStorage.getItem('token')

  if (direct) return direct

  try {
    const user = getStoredUser()
    return user?.token || null
  } catch {
    return null
  }
}

function requireLogin() {
  const user = getStoredUser()

  if (!user) {
    const error = new Error('Please log in first.')
    error.status = 401
    throw error
  }

  return user
}

export function isLoggedIn() {
  return getStoredUser() !== null
}

export function ensureLoggedIn(navigate) {
  if (isLoggedIn()) return true

  const from = window.location.pathname

  const message =
    'Please log in or sign up to place an order.'

  if (typeof navigate === 'function') {
    navigate('/login', {
      state: { from, message },
    })
  } else {
    window.location.assign('/login')
  }

  return false
}

// ==========================================
// 3. LOGIN RESPONSE HANDLING
// ==========================================

function isLoginRequest(response) {
  const url = response?.config?.url || ''

  return (
    response?.config?.method === 'post' &&
    /\/users\/login\/?$/.test(url)
  )
}

function saveUserFromLogin(response) {
  if (isLoginRequest(response)) {
    const data = response.data

    const user = data?.user || data

    if (user?.id) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    if (data?.token) {
      localStorage.setItem('token', data.token)
    } else if (user?.token) {
      localStorage.setItem('token', user.token)
    }
  }

  return response
}

// For login requests using normal axios
axios.interceptors.response.use(saveUserFromLogin)

// For requests using apiClient
apiClient.interceptors.response.use(saveUserFromLogin)

// ==========================================
// 4. REQUEST INTERCEPTOR
// ==========================================

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ==========================================
// 5. ERROR HANDLING
// ==========================================

function getErrorMessage(error, fallback = 'Request failed') {
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot connect to backend. Check whether Spring Boot is running on port 8080.'
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.'
  }

  const data = error.response?.data

  console.error(
    'SERVER ERROR:',
    error.response?.status,
    data
  )

  if (typeof data === 'string') {
    return data
  }

  if (data?.message) {
    return data.message
  }

  if (data?.error) {
    return data.error
  }

  if (data?.errors) {
    return JSON.stringify(data.errors)
  }

  if (data?.detail) {
    return data.detail
  }

  return fallback
}

function toApiError(error, fallback) {
  const err = new Error(
    getErrorMessage(error, fallback)
  )

  err.status = error.response?.status
  err.data = error.response?.data
  err.response = error.response

  return err
}

// ==========================================
// 6. LOGIN GUARD
// ==========================================

function guardAll(api) {
  return Object.fromEntries(
    Object.entries(api).map(([name, fn]) => [
      name,
      async (...args) => {
        requireLogin()
        return fn(...args)
      },
    ])
  )
}

// ==========================================
// 7. PRODUCT API
// ==========================================

export const productApi = {
  // GET /api/products
  async getAll() {
    try {
      const response = await apiClient.get('/products')
      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load products')
    }
  },

  // GET /api/products/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(
        `/products/${id}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load product')
    }
  },

  // POST /api/products
  async create(productData) {
    try {
      const response = await apiClient.post(
        '/products',
        productData
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to create product')
    }
  },

  // PUT /api/products/{id}
  async update(id, productData) {
    try {
      const response = await apiClient.put(
        `/products/${id}`,
        productData
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to update product')
    }
  },

  // DELETE /api/products/{id}
  async remove(id) {
    try {
      const response = await apiClient.delete(
        `/products/${id}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to delete product')
    }
  },
}

// ==========================================
// 8. BRAND API
// ==========================================

export const brandApi = {
  // GET /api/brands
  async getAll() {
    try {
      const response = await apiClient.get('/brands')
      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load brands')
    }
  },
}

// ==========================================
// 9. AUTH API
// ==========================================

export const authApi = {
  // POST /api/users/login
  async login(credentials) {
    try {
      const response = await apiClient.post(
        '/users/login',
        credentials
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Login failed')
    }
  },

  // POST /api/users
  async register(accountData) {
    try {
      const response = await apiClient.post(
        '/users',
        accountData
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Registration failed')
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}

// ==========================================
// 10. ORDER API
// ==========================================

export const orderApi = guardAll({
  // POST /api/orders
  async create(orderData) {
    try {
      const user = getStoredUser()

      // Attach logged-in user ID
      const payload = {
        ...orderData,
        userId: user.id,
      }

      console.log('Sending Order:', payload)

      const response = await apiClient.post(
        '/orders',
        payload
      )

      console.log('Order Response:', response.data)

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to create order')
    }
  },

  // GET /api/orders/user/{userId}
  async getByUser(userId) {
    try {
      const response = await apiClient.get(
        `/orders/user/${userId}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load orders')
    }
  },

  // GET /api/orders/me
  async getMine() {
    try {
      const response = await apiClient.get('/orders/me')
      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load your orders')
    }
  },

  // GET /api/orders/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(
        `/orders/${id}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load order')
    }
  },

  // PUT /api/orders/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(
        `/orders/${id}/status`,
        { status }
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to update order')
    }
  },
})

// ==========================================
// 11. PAYMENT API
// ==========================================

export const paymentApi = guardAll({
  // POST /api/payments
  // Use only if your PaymentController has this endpoint.
  async create(paymentData) {
    try {
      const response = await apiClient.post(
        '/payments',
        paymentData
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to create payment')
    }
  },

  // GET /api/payments
  async getAll() {
    try {
      const response = await apiClient.get('/payments')
      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load payments')
    }
  },

  // GET /api/payments/order/{orderId}
  async getByOrder(orderId) {
    try {
      const response = await apiClient.get(
        `/payments/order/${orderId}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load payment')
    }
  },

  // PUT /api/payments/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(
        `/payments/${id}/status`,
        { status }
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to update payment')
    }
  },

  // DELETE /api/payments/{id}
  async remove(id) {
    try {
      const response = await apiClient.delete(
        `/payments/${id}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to delete payment')
    }
  },
})

// ==========================================
// 12. ORDER ITEM API
// ==========================================

export const orderItemApi = guardAll({
  // GET /api/order-items/order/{orderId}
  async getByOrder(orderId) {
    try {
      const response = await apiClient.get(
        `/order-items/order/${orderId}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load order items')
    }
  },

  // GET /api/order-items/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(
        `/order-items/${id}`
      )

      return response.data
    } catch (error) {
      throw toApiError(error, 'Unable to load order item')
    }
  },
})

// ==========================================
// 13. EXPORT API CLIENT
// ==========================================

export default apiClient
