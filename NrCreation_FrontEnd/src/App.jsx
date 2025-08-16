// import React, { useState } from 'react'

// function App() {
//   const [loaderId, setLoaderId] = useState(0);
//   //0 to 10 
//   const [progressCount, setProgressCount] = useState(0);


//   const statrtLoader = () => {
//     setLoaderId(setInterval(() => {
//       setProgressCount(prev => prev + 1)
//     }, 1000));
//   }

//   const stopLoader = () => {
//     clearInterval(loaderId);
//   }

//   const clearLoading = () => {
//     clearInterval(loaderId);
//     setProgressCount(0);
//   }


//   return (
//     <div className='flex flex-col gap-4 justify-center items-center min-h-screen'>
//       {/* progress bar */}
//       <div className='bg-white '>
//         <span className={`bg-green-300 p-3`}>{progressCount} %</span>
//       </div>
//       <div className='flex gap-4'>
//         <button className='bg-green-100 p-2' onClick={() => statrtLoader()}>Start Loader</button>
//         <button className='bg-green-100 p-2' onClick={() => stopLoader()}>Stop Loader</button>
//         <button className='bg-green-100 p-2' onClick={() => clearLoading()}>Clear Loader</button>
//       </div>
//     </div>
//   )
// }

// export default App



import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDescription from "./pages/ProductDescription";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
// import OrdersPage from './pages/OrdersPage'
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import ProductManagement from "./pages/adminPages/ProductManagement";
import OrderManagement from "./pages/adminPages/OrderManagement";
import UserManagement from "./pages/adminPages/UserManagement";
import Analytics from "./pages/adminPages/Analytics";
import PageNotFound from "@/components/ReusableComponents/PageNotFound";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./routes";
import AdminLayout from "./components/layout/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthState,
  logoutUser,
  setAccessToken,
  setUser,
} from "./store/slices/Auth/authSlice";
import { PageLoader } from "./components/ReusableComponents";
import NewCartPage from "./pages/NewCartPage";
import OrderSuccess from "./pages/OrderSuccess";
import api from "./utils/api";
import ProductImageAddUpdate from "./pages/adminPages/ProductImageAddUpdate";
import HomePageNew from "./pages/HomePageNew";

const App = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefreshToken = async () => {
      try {
        // console.log(`My access token in app : `, accessToken);

        if (!accessToken) {
          // console.log(`Token is not there then refresh it : `, accessToken);
          const res = await api.post(
            "/auth/refresh-token",
            {},
            { withCredentials: true }
          );
          dispatch(setAccessToken(res.data.data?.accessToken));
          dispatch(setUser(res.data.data?.user));
        }
      } catch (err) {
        dispatch(clearAuthState());
        console.error("Auto-refresh failed:", err);
      } finally {
        setLoading(false);
      }
    };

    tryRefreshToken();
  }, [dispatch]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Public Auth routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />

          {/* Public routes */}
          <Route path="/" element={<RootLayout />}>
            {/* <Route index element={<HomePage />} /> */}
            <Route index element={<HomePageNew />} />
            <Route path="category/dupattas" element={<ProductListingPage />} />
            <Route path="product/:id" element={<ProductDescription />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* user-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/" element={<RootLayout />}>
              <Route path="/cart" element={<NewCartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile/:tabId" element={<ProfilePage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/order-confirmation" element={<OrderSuccess />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/images/:productId" element={<ProductImageAddUpdate />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
              {/* <Route path="analytics" element={<Analytics />} /> */}
            </Route>
          </Route>

          {/* Catch other route if not above */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
};

export default App;

