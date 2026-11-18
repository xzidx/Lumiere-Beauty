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

// Turns any Axios error into a readable message.
// Needs server.error.include-message=always in application.properties.
function getErrorMessage(error, fallback) {
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Is the backend running on port 8080?'
  }
  return error.response?.data?.message || fallback
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
  // POST /api/auth/login
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  // POST /api/auth/register
  async register(accountData) {
    try {
      const response = await apiClient.post('/auth/register', accountData)
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }
}

export const orderApi = {
  // POST /api/orders (also creates the payment when paymentMethod is sent)
  async create(orderData) {
    try {
      const response = await apiClient.post('/orders', orderData)
      return response.data
    } catch (error) {
      console.error('Unable to create order:', error)
      throw new Error(getErrorMessage(error, 'Unable to create order'))
    }
  },

  // GET /api/orders/user/{userId}
  async getByUser(userId) {
    try {
      const response = await apiClient.get(`/orders/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Unable to load orders:', error)
      throw new Error(getErrorMessage(error, 'Unable to load orders'))
    }
  },

  // GET /api/orders/{id}
  async getById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      console.error(`Unable to load order ${id}:`, error)
      throw new Error(getErrorMessage(error, 'Unable to load order'))
    }
  },

  // PUT /api/orders/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(`/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Unable to update order ${id}:`, error)
      throw new Error(getErrorMessage(error, 'Unable to update order'))
    }
  }
}

export const paymentApi = {
  // GET /api/payments
  async getAll() {
    try {
      const response = await apiClient.get('/payments')
      return response.data
    } catch (error) {
      console.error('Unable to load payments:', error)
      throw new Error(getErrorMessage(error, 'Unable to load payments'))
    }
  },

  // GET /api/payments/order/{orderId}
  async getByOrder(orderId) {
    try {
      const response = await apiClient.get(`/payments/order/${orderId}`)
      return response.data
    } catch (error) {
      console.error(`Unable to load payment for order ${orderId}:`, error)
      throw new Error(getErrorMessage(error, 'Unable to load payment'))
    }
  },

  // PUT /api/payments/{id}/status
  async updateStatus(id, status) {
    try {
      const response = await apiClient.put(`/payments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Unable to update payment ${id}:`, error)
      throw new Error(getErrorMessage(error, 'Unable to update payment'))
    }
  },

  // DELETE /api/payments/{id}
  async remove(id) {
    try {
      await apiClient.delete(`/payments/${id}`)
    } catch (error) {
      console.error(`Unable to delete payment ${id}:`, error)
      throw new Error(getErrorMessage(error, 'Unable to delete payment'))
    }
  }
}

export default apiClient