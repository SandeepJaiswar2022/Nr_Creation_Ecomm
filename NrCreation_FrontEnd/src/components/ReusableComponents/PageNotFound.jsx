import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
        >
            <h1 className="text-6xl font-bold text-[#871845] mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track!
            </p>
            <Button asChild className="bg-[#871845] hover:bg-[#611031]">
                <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                </Link>
            </Button>
        </motion.div>
    )
}

export default PageNotFound 