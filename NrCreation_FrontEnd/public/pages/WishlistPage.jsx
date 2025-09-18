import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/ReusableComponents/EmptyState'

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([])

    // if (wishlistItems.length === 0) {
    //     return (
    //         <EmptyState
    //             icon={Heart}
    //             title="Your wishlist is empty"
    //             description="Save items you love to your wishlist and review them anytime."
    //             link="/"
    //             linkText="Start Shopping"
    //         />
    //     )
    // }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                    <motion.div
                        key={item}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="aspect-square bg-gray-200 relative">
                            <span className="sr-only">Product Image</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-4 space-y-2">
                            <h3 className="font-semibold">Product Name</h3>
                            <p className="text-[#871845] font-medium">₹4,999</p>
                            <p className="text-sm text-gray-500">Size: M | Color: Blue</p>

                            <Button className="w-full bg-[#871845] hover:bg-[#611031]">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default WishlistPage 