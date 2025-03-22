import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDescription from './pages/ProductDescription'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
// import OrdersPage from './pages/OrdersPage'
import AdminDashboard from './pages/adminPages/AdminDashboard'
import ProductManagement from './pages/adminPages/ProductManagement'
import OrderManagement from './pages/adminPages/OrderManagement'
import UserManagement from './pages/adminPages/UserManagement'
import Analytics from './pages/adminPages/Analytics'
import PageNotFound from '@/components/ReusableComponents/PageNotFound'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = true // Replace with actual auth check
  const isAdmin = true // Replace with actual admin check

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

// Admin Layout Component
const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/analytics", label: "Analytics" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="my-container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="flex items-center">
              <h1 className="text-xl font-bold text-[#871845]">Admin Panel</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:text-[#871845] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-600 hover:text-[#871845] transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Admin Content */}
      <main className="my-container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<AuthPage />} />

        {/* Main layout routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:category" element={<ProductListingPage />} />
          <Route path="product/:id" element={<ProductDescription />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          {/* <Route path="orders" element={<OrdersPage />} /> */}

          {/* Catch all route - must be last */}
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
