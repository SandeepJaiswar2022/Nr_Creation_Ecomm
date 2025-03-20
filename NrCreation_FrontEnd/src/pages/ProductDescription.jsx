import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Minus, ChevronDown, ChevronUp, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ReusableComponents/ProductCard'
import { featuredProducts } from '@/data/products'

const ProductDescription = () => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState('maroon')
    const [selectedSize, setSelectedSize] = useState('M')
    const [openSection, setOpenSection] = useState(null)
    const [startIndex, setStartIndex] = useState(0)

    const images = [
        "/Images/Duppta1.jpeg",
        "/Images/Duppta2.jpeg",
        "/Images/Duppta3.jpeg",
        "/Images/Duppta4.jpeg",
        "/Images/Duppta1.jpeg",
        "/Images/Duppta5.jpeg",
    ]

    const colors = [
        { name: 'maroon', value: '#871845' },
        { name: 'blue', value: '#1E40AF' },
        { name: 'green', value: '#065F46' },
        { name: 'black', value: '#111827' },
    ]

    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    const nextThumbnails = () => {
        setStartIndex(Math.min(startIndex + 1, images.length - 4))
    }

    const prevThumbnails = () => {
        setStartIndex(Math.max(startIndex - 1, 0))
    }

    const visibleThumbnails = images.slice(startIndex, startIndex + 4)

    return (
        <div className="container mx-auto px-4 py-16">
            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Left Column - Image Gallery */}
                <div className="lg:col-span-4">
                    <div className="flex gap-4 h-full">
                        {/* Thumbnail List */}
                        <div className="relative flex flex-col">
                            <button
                                className={`absolute -top-7 left-1/2 -translate-x-1/2 p-1 rounded-full bg-[#871845] text-white shadow-md z-10 ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-[#871845]'}`}
                                onClick={prevThumbnails}
                                disabled={startIndex === 0}
                            >
                                <ChevronUp className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col gap-4 py-2 h-[calc(6*5rem+3*1rem)] overflow-hidden">
                                {visibleThumbnails.map((img, index) => (
                                    <motion.div
                                        key={startIndex + index}
                                        className={`w-20 max-sm:w-16 h-28 max-sm:h-24 cursor-pointer border-2 ${selectedImage === startIndex + index ? 'border-[#871845]' : 'border-transparent'}`}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedImage(startIndex + index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`Product view ${startIndex + index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 p-1 rounded-full bg-[#871845] shadow-md text-white z-10 ${startIndex >= images.length - 4 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#871845]'}`}
                                onClick={nextThumbnails}
                                disabled={startIndex >= images.length - 4}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Main Image */}
                        <div className="flex-1">
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative pt-[150%]" // 3:2 aspect ratio
                            >
                                <img
                                    src={images[selectedImage]}
                                    alt="Main product view"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </motion.div>
                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button className="flex-1 py-3 bg-[#871845] hover:bg-[#611031]">
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                </Button>
                                <Button className="flex-1 bg-[#871845] hover:bg-[#611031]">
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Info and Accordion */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Royal Blue Silk Dupatta</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-[#871845]">₹4,999</span>
                            <span className="text-lg text-gray-500 line-through">₹6,999</span>
                            <span className="text-green-600 font-medium">30% off</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600">
                            Luxurious silk dupatta with intricate zari work. Perfect for special occasions and festivals.
                            Features traditional motifs and premium quality fabric.
                        </p>

                        {/* Color Selection */}
                        <div className="space-y-3">
                            <h3 className="font-medium">Select Color</h3>
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <motion.div
                                        key={color.name}
                                        className={`w-8 h-8 rounded cursor-pointer ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-[#871845]' : ''}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => setSelectedColor(color.name)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            {/* Size Selection */}
                            <div className="space-y-3 bg-[#f0e3e9]  p-4">
                                <h3 className="font-medium">Select Size</h3>
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                        onClick={() => setOpenSection(openSection === 'size' ? null : 'size')}
                                    >
                                        {selectedSize}
                                        {openSection === 'size' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                    <AnimatePresence>
                                        {openSection === 'size' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg"
                                            >
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${selectedSize === size ? 'text-[#871845] font-medium' : ''}`}
                                                        onClick={() => {
                                                            setSelectedSize(size)
                                                            setOpenSection(null)
                                                        }}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Quantity Selection */}
                            <div className="space-y-3 bg-[#f0e3e9]  p-4">
                                <h3 className="font-medium">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-8 w-8"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-8 w-8"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Accordion Sections */}
                    <div className="space-y-4">
                        {/* Product Description */}
                        <div className="border rounded-lg">
                            <button
                                className="w-full px-6 py-4 flex justify-between items-center"
                                onClick={() => toggleSection('description')}
                            >
                                <span className="font-medium">Product Description</span>
                                {openSection === 'description' ? (
                                    <Minus className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openSection === 'description' && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-t">
                                            <p className="text-gray-600">
                                                Our Royal Blue Silk Dupatta is crafted from the finest silk fabric,
                                                featuring intricate zari work that adds a touch of elegance to your outfit.
                                                The dupatta measures 2.5 meters in length and comes with carefully
                                                finished edges to ensure durability.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Return Policy */}
                        <div className="border rounded-lg">
                            <button
                                className="w-full px-6 py-4 flex justify-between items-center"
                                onClick={() => toggleSection('returns')}
                            >
                                <span className="font-medium">Return & Refund Policy</span>
                                {openSection === 'returns' ? (
                                    <Minus className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openSection === 'returns' && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-t">
                                            <p className="text-gray-600">
                                                We accept returns within 7 days of delivery. The product must be unused
                                                and in its original packaging. Refunds will be processed within 5-7
                                                business days after we receive the returned item.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Shipping Info */}
                        <div className="border rounded-lg">
                            <button
                                className="w-full px-6 py-4 flex justify-between items-center"
                                onClick={() => toggleSection('shipping')}
                            >
                                <span className="font-medium">Shipping Information</span>
                                {openSection === 'shipping' ? (
                                    <Minus className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openSection === 'shipping' && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-t">
                                            <p className="text-gray-600">
                                                We offer free shipping on all orders above ₹999. Standard delivery takes
                                                3-5 business days. Express delivery (additional charges apply) takes
                                                1-2 business days. We ship to all major cities in India.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            <div>
                <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductDescription 