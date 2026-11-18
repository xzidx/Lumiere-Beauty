import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialProducts } from '../data/products'
import { productApi } from '../services/api'

const ShopContext = createContext(null)

// Maps the backend product to the shape your UI expects.
// If Step 1 showed different field names, change them here (one place only).
const normalizeProduct = (p) => ({
  ...p,
  id: p.id,
  name: p.name,
  brand: p.brand ?? p.brandName ?? '',
  category: p.category ?? p.categoryName ?? '',
  price: Number(p.price),
  imageUrl: p.imageUrl ?? p.image ?? '',
  stock: p.stock ?? p.stockQuantity ?? 0,
  status: p.status ?? 'Active',
  description: p.description ?? '',
})

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)
  const [productsLoading, setProductsLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lumiere-cart')) || [] }
    catch { return [] }
  })

  // Load products from the backend once
  useEffect(() => {
    productApi.getAll()
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch(() => console.warn('Backend not reachable, using local products'))
      .finally(() => setProductsLoading(false))
  }, [])

  useEffect(() => localStorage.setItem('lumiere-cart', JSON.stringify(cart)), [cart])

  const addToCart = (product) => setCart(current => {
    const found = current.find(item => item.id === product.id)
    return found
      ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
  })
  const updateQuantity = (id, quantity) => setCart(current =>
    quantity <= 0
      ? current.filter(item => item.id !== id)
      : current.map(item => item.id === id ? { ...item, quantity } : item))
  const removeFromCart = (id) => setCart(current => current.filter(item => item.id !== id))
  const clearCart = () => setCart([])

  // Admin actions: still local only for now (see Step 5)
  const saveProduct = (product) => setProducts(current => {
    const exists = current.some(item => item.id === product.id)
    return exists ? current.map(item => item.id === product.id ? product : item) : [product, ...current]
  })
  const deleteProduct = (id) => setProducts(current => current.filter(item => item.id !== id))

  const value = useMemo(
    () => ({ products, productsLoading, cart, addToCart, updateQuantity, removeFromCart, clearCart, saveProduct, deleteProduct }),
    [products, productsLoading, cart]
  )
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
export const useShop = () => useContext(ShopContext)