import axios from 'axios'

// Base URL of the Java Spring Boot REST API.
// Change VITE_API_BASE_URL in the .env file when the backend is ready.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// One Axios instance so all API requests share the same configuration.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Reads the login token saved after login.
// Looks for localStorage "token" first, then "user.token".
function getToken() {
  const direct = localStorage.getItem('token')
  if (direct) return direct
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user?.token || null
  } catch {
    return null
  }
}

// Returns the logged-in user saved in localStorage, or null.
export function getStoredUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user?.id ? user : null
  } catch {
    return null
  }
}

// Permission check: only logged-in / signed-up users may use order & payment APIs.
function requireLogin() {
  const user = getStoredUser()
  if (!user) {
    const err = new Error('Please log in or sign up first.')
    err.status = 401
    throw err
  }
  return user
}

export function isLoggedIn() {
  return getStoredUser() !== null
}

// Use on "Add to bag" / "Order" buttons.
// Not logged in -> goes to the login page and returns false.
// Logged in     -> returns true so the action can continue.
//
//   const navigate = useNavigate()
//   onClick={() => ensureLoggedIn(navigate) && addToCart(product)}
export function ensureLoggedIn(navigate) {
  if (isLoggedIn()) return true

  const from = window.location.pathname
  const message = 'Please log in or sign up to add to bag or place an order.'
  if (typeof navigate === 'function') {
    navigate('/login', { state: { from, message } })
  } else {
    window.location.assign('/login')
  }
  return false
}

// The login page posts to /api/users/login with plain axios and does not save
// the result. Catch that response here and save the user, so the rest of the
// app knows who is logged in. Auth.jsx does not need to change.
function isLoginRequest(response) {
  const url = response?.config?.url || ''
  return response?.config?.method === 'post' && /\/users\/login\/?$/.test(url)
}

function saveUserFromLogin(response) {
  if (isLoginRequest(response) && response.data?.id) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response
}

axios.interceptors.response.use(saveUserFromLogin) // plain axios (Auth.jsx)

// Wraps every method of an API object with the login check.
// If nobody is logged in, the call is rejected before any request is sent.
function guardAll(api) {
  return Object.fromEntries(
    Object.entries(api).map(([name, fn]) => [
      name,
      async (...args) => {
        requireLogin()
        return fn(...args)
      }
    ])
  )
}

apiClient.interceptors.response.use((response) => {
  // Same capture for requests made through apiClient (authApi.login).
  return typeof saveUserFromLogin === 'function' ? saveUserFromLogin(response) : response
})

// Sends the token with every request so the backend knows who is asking.
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Turns any Axios error into a readable message.
// Needs server.error.include-message=always in application.properties.
function getErrorMessage(error, fallback) {
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Is the backend running on port 8080?'
  }
  return error.response?.data?.message || fallback
}

// Builds an Error that keeps the HTTP status (401, 403, 404 ...)
// so pages can react, e.g. redirect to login on 401/403.
function toApiError(error, fallback) {
  const err = new Error(getErrorMessage(error, fallback))
  err.status = error.response?.status
  return err
}

export const productApi = {
  // GET /api/products
  async getAll() {
    try {
      const response = await apiClient.get('/products')
      return response.data
    } catch (error) {
      console.error('Unable to load products:', error)
      throw error
    }
  },

  // GET /api/products/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Unable to load product ${id}:`, error)
      throw error
    }
  },

  // POST /api/products
  async create(productData) {
    try {
      const response = await apiClient.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Unable to create product:', error)
      throw error
    }
  },

  // PUT /api/products/{id}
  async update(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      console.error(`Unable to update product ${id}:`, error)
      throw error
    }
  },

  // DELETE /api/products/{id}
  async remove(id) {
    try {
      const response = await apiClient.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Unable to delete product ${id}:`, error)
      throw error
    }
  }
}

export const brandApi = {
  // GET /api/brands
  async getAll() {
    try {
      const response = await apiClient.get('/brands')
      return response.data
    } catch (error) {
      console.error('Unable to load brands:', error)
      throw error
    }
  }
}

export const authApi = {
  // POST /api/users/login
  async login(credentials) {
    try {
      const response = await apiClient.post('/users/login', credentials)
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  // POST /api/users
  async register(accountData) {
    try {
      const response = await apiClient.post('/users', accountData)
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  // Clears the saved login (call from a Logout button or on 401/403).
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

// Every orderApi method requires a logged-in user.
export const orderApi = guardAll({
  // POST /api/orders (also creates the payment when paymentMethod is sent)
  // The backend should take the user from the token, not from orderData.
  async create(orderData) {
    try {
      // Always attach the logged-in user's id to the order.
      const user = requireLogin()
      const response = await apiClient.post('/orders', { ...orderData, userId: user.id })
      return response.data
    } catch (error) {
      console.error('Unable to create order:', error)
      throw toApiError(error, 'Unable to create order')
    }
  },

  // GET /api/orders/user/{userId}
  async getByUser(userId) {
    try {
      const response = await apiClient.get(`/orders/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Unable to load orders:', error)
      throw toApiError(error, 'Unable to load orders')
    }
  },

  // GET /api/orders/me  (backend reads the user from the token)
  async getMine() {
    try {
      const response = await apiClient.get('/orders/me')
      return response.data
    } catch (error) {
      console.error('Unable to load orders:', error)
      throw toApiError(error, 'Unable to load orders')
    }
  },

  // GET /api/orders/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      console.error(`Unable to load order ${id}:`, error)
      throw toApiError(error, 'Unable to load order')
    }
  },

  // PUT /api/orders/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(`/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Unable to update order ${id}:`, error)
      throw toApiError(error, 'Unable to update order')
    }
  }
})

// Every paymentApi method requires a logged-in user.
export const paymentApi = guardAll({
  // GET /api/payments
  async getAll() {
    try {
      const response = await apiClient.get('/payments')
      return response.data
    } catch (error) {
      console.error('Unable to load payments:', error)
      throw toApiError(error, 'Unable to load payments')
    }
  },

  // GET /api/payments/order/{orderId}
  async getByOrder(orderId) {
    try {
      const response = await apiClient.get(`/payments/order/${orderId}`)
      return response.data
    } catch (error) {
      console.error(`Unable to load payment for order ${orderId}:`, error)
      throw toApiError(error, 'Unable to load payment')
    }
  },

  // PUT /api/payments/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(`/payments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Unable to update payment ${id}:`, error)
      throw toApiError(error, 'Unable to update payment')
    }
  },

  // DELETE /api/payments/{id}
  async remove(id) {
    try {
      await apiClient.delete(`/payments/${id}`)
    } catch (error) {
      console.error(`Unable to delete payment ${id}:`, error)
      throw toApiError(error, 'Unable to delete payment')
    }
  }
})

export default apiClient