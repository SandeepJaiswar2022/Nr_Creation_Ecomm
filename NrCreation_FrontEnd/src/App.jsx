import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import ProductListingPage from './pages/ProductListingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":category" element={<ProductListingPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
