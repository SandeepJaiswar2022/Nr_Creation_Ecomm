import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
        </Route>
      </Routes>
    </Router>
  )
}

export default App
