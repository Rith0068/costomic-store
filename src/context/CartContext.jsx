import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'lumiere.cart'

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    const addItem = (product, variant = product.sizes[0]) => {
      setItems((current) => {
        const existing = current.find(
          (item) => item.id === product.id && item.variant === variant,
        )
        if (existing) {
          return current.map((item) =>
            item.id === product.id && item.variant === variant
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        }
        return [
          ...current,
          {
            key: `${product.id}-${variant}`,
            id: product.id,
            variant,
            name: product.name,
            price: product.price,
            shade: product.shade,
            photo: product.photo,
            photoAlt: product.photoAlt,
            category: product.category,
            quantity: 1,
          },
        ]
      })
      setIsOpen(true)
    }

    const updateQuantity = (key, quantity) => {
      if (quantity < 1) {
        setItems((current) => current.filter((item) => item.key !== key))
        return
      }
      setItems((current) =>
        current.map((item) => (item.key === key ? { ...item, quantity } : item)),
      )
    }

    const removeItem = (key) => {
      setItems((current) => current.filter((item) => item.key !== key))
    }

    const clearCart = () => setItems([])

    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
