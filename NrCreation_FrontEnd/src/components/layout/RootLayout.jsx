import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect } from 'react'

const RootLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div className="min-h-screen  flex flex-col bg-background">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky  -top-1 z-50 w-full border-b bg-white"
            >
                <Navbar />
            </motion.header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default RootLayout 