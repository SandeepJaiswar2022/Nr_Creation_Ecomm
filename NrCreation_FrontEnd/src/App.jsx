import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDescription from './pages/ProductDescription'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":category" element={<ProductListingPage />} />
          <Route path="/product" element={<ProductDescription />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
