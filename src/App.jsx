import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { ProductsProvider } from './context/ProductsProvider'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/layout/CartDrawer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminDashboard from './pages/admin/AdminDashboard'
import OverviewSection from './pages/admin/OverviewSection'
import OrdersSection from './pages/admin/OrdersSection'
import ProductsSection from './pages/admin/ProductsSection'
import InventorySection from './pages/admin/InventorySection'
import CustomersSection from './pages/admin/CustomersSection'
import SettingsSection from './pages/admin/SettingsSection'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink-950 focus:px-5 focus:py-3 focus:text-sm focus:text-ink-50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout/success" element={<OrderConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<OverviewSection />} />
              <Route path="orders" element={<OrdersSection />} />
              <Route path="products" element={<ProductsSection />} />
              <Route path="inventory" element={<InventorySection />} />
              <Route path="customers" element={<CustomersSection />} />
              <Route path="settings" element={<SettingsSection />} />
              <Route path="*" element={<Navigate to="/admin/overview" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}