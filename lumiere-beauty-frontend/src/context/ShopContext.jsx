
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import axiosClient from '../api/axiosClient'

const ShopContext = createContext(null)


export function ShopProvider({ children }) {
  // Data from PostgreSQL
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  // Cart stays in localStorage
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lumiere-cart')) || []
    } catch {
      return []
    }
  })

 

  // Get products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosClient.get('/products')
        const data = response.data

        console.log('Backend products:', data)

        const formattedProducts = data.map(product => ({
          ...product,
          id: String(product.id),
          brand: product.brand?.name ?? product.brand,
          category: product.category?.name ?? product.category,
          stock: product.stockQuantity ?? product.stock,
          status: product.status?.toLowerCase() === 'active'
            ? 'Active'
            : product.status
        }))

        console.log('Formatted products:', formattedProducts)
        setProducts(formattedProducts)

      } catch (error) {
        console.error('Products error:', error)
      }
    }

    fetchProducts()
  }, [])

  // Get brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosClient.get('/brands')
        setBrands(response.data)
      } catch (error) {
        console.error('Brands error:', error)
      }
    }

    fetchBrands()
  }, [])

  // Get categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Categories error:', error)
      }
    }

    fetchCategories()
  }, [])

  // Save cart
  useEffect(() => {
    localStorage.setItem('lumiere-cart', JSON.stringify(cart))
  }, [cart])

  // Add product to cart
  const addToCart = (product) => {
    setCart(current => {
      const found = current.find(
        item => item.id === product.id
      )

      if (found) {
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...current,
        { ...product, quantity: 1 }
      ]
    })
  }

  // Update cart quantity
  const updateQuantity = (id, quantity) => {
    setCart(current => {
      if (quantity <= 0) {
        return current.filter(item => item.id !== id)
      }

      return current.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    })
  }

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart(current =>
      current.filter(item => item.id !== id)
    )
  }

  // Update product in frontend state
  const saveProduct = (product) => {
    setProducts(current => {
      const exists = current.some(
        item => item.id === String(product.id)
      )

      return exists
        ? current.map(item =>
            item.id === String(product.id)
              ? product
              : item
          )
        : [product, ...current]
    })
  }

  // Delete product from frontend state
  const deleteProduct = (id) => {
    setProducts(current =>
      current.filter(item => item.id !== String(id))
    )
  }

  const value = useMemo(() => ({
    products,
    brands,
    categories,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveProduct,
    deleteProduct
  }), [products, brands, categories, cart])

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => useContext(ShopContext)
