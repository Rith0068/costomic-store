import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { CartContext } from './CartContext'
import { useAuth } from './AuthContext'

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    api
      .cart()
      .then((data) => {
        if (active) setItems(data.cart.items)
      })
      .catch(() => {
        if (active) setItems([])
      })
    return () => {
      active = false
    }
  }, [user?.id])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const run = useCallback(async (action, fallback) => {
    setBusy(true)
    try {
      const data = await action()
      setItems(data.cart.items)
      return true
    } catch (error) {
      setItems(fallback)
      setNotice(error.message)
      return false
    } finally {
      setBusy(false)
    }
  }, [])

  const addItem = useCallback(
    async (product, variant = product.sizes?.[0] ?? '') => {
      const ok = await run(
        () => api.addToCart({ productId: product.id, variant, quantity: 1 }),
        items,
      )
      if (ok) setIsOpen(true)
      return ok
    },
    [run, items],
  )

  const updateQuantity = useCallback(
    async (key, quantity) => {
      setItems((current) =>
        quantity < 1
          ? current.filter((item) => item.key !== key)
          : current.map((item) => (item.key === key ? { ...item, quantity } : item)),
      )
      await run(() => api.updateCartItem(key, quantity), items.filter((i) => i.key !== key))
    },
    [run, items],
  )

  const removeItem = useCallback(
    async (key) => {
      const previous = items
      setItems(items.filter((item) => item.key !== key))
      await run(() => api.removeCartItem(key), previous)
    },
    [run, items],
  )

  const clearCart = useCallback(async () => {
    const previous = items
    setItems([])
    await run(() => api.clearCart(), previous)
  }, [run, items])

  const refresh = useCallback(async () => {
    const data = await api.cart()
    setItems(data.cart.items)
  }, [])

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce(
      (total, item) => total + item.snapshot.price * item.quantity,
      0,
    )

    return {
      items,
      count,
      subtotal,
      isOpen,
      busy,
      notice,
      dismissNotice: () => setNotice(''),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refresh,
    }
  }, [items, isOpen, busy, notice, addItem, updateQuantity, removeItem, clearCart, refresh])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
