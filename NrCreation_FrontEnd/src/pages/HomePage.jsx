import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ReusableComponents/ProductCard'
import { featuredProducts } from '@/data/products'

const slides = [
    {
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070&auto=format&fit=crop",
        title: "Discover Your Style",
        subtitle: "Explore our latest collection of trendy fashion for men and women.",
        cta: "Shop Now",
        link: "/men"
    },
    {
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        title: "Summer Collection",
        subtitle: "Stay cool and stylish with our new summer arrivals.",
        cta: "View Collection",
        link: "/women"
    },
    {
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
        title: "Limited Time Offer",
        subtitle: "Get up to 50% off on selected items.",
        cta: "Shop Sale",
        link: "/men"
    }
]

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1)
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(timer)
    }, [])

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection) => {
        setDirection(newDirection)
        setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length)
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 1 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                        className="absolute inset-0"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="container relative z-10 mx-auto px-4 h-full flex items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-2xl text-white"
                            >
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    {slides[currentSlide].title}
                                </h1>
                                <p className="text-lg md:text-xl mb-8">
                                    {slides[currentSlide].subtitle}
                                </p>
                                <Button size="lg" asChild>
                                    <Link to={slides[currentSlide].link}>
                                        {slides[currentSlide].cta} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            <div className="my-container mx-auto">
                {/* Categories Section */}
                <section className="mx-auto py-16">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-center">Shop by Category</h2>
                        <div className="flex justify-center items-center gap-2">
                            <div className="h-[0.2rem] w-[80px] bg-[#871845] rounded-full"></div>
                            <div className="h-[0.2rem] w-[25px] bg-gray-400 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[500px] rounded-lg overflow-hidden "
                        >
                            <Link to="/men">
                                <div className="absolute inset-0 bg-[url('/Images/men-collection.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold mb-4">Men's Collection</h3>
                                    <Button variant="outline" className="text-black py-6 rounded-none font-semibold text-lg border-white hover:bg-white hover:text-black transition-colors duration-300">
                                        Shop Men <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-[32rem] rounded-lg overflow-hidden "
                        >
                            <Link to="/women">
                                <div className="absolute inset-0 bg-[url('/Images/women-collection.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h3 className="text-3xl font-bold mb-4">Women's Collection</h3>
                                    <Button variant="outline" className="text-black py-6 rounded-none font-semibold text-lg border-white hover:bg-white hover:text-black transition-colors duration-300">
                                        Shop Women <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="pb-24">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-center">Featured Products</h2>
                        <div className="flex justify-center items-center gap-2">
                            <div className="h-[0.2rem] w-[80px] bg-[#871845] rounded-full"></div>
                            <div className="h-[0.2rem] w-[25px] bg-gray-400 rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, index) => (
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            </Link>

                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default HomePage 