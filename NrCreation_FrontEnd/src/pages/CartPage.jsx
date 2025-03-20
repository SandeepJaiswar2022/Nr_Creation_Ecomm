import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '@/components/ReusableComponents/EmptyState'

const CartPage = () => {
    const [cartItems, setCartItems] = useState([])

    // if (cartItems.length === 0) {
    //     return (
    //         <EmptyState
    //             icon={ShoppingBag}
    //             title="Your cart is empty"
    //             description="Looks like you haven't added anything to your cart yet."
    //             link="/"
    //             linkText="Continue Shopping"
    //         />
    //     )
    // }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-8">
                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                            >
                                <div className="w-24 h-32 bg-gray-200 rounded-md">
                                    <span className="sr-only">Product Image</span>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between">
                                        <h3 className="font-semibold">Product Name</h3>
                                        <p className="font-semibold text-[#871845]">₹4,999</p>
                                    </div>
                                    <p className="text-sm text-gray-500">Size: M</p>
                                    <p className="text-sm text-gray-500">Color: Blue</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">1</span>
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold">Order Summary</h2>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>₹9,998</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span>₹99</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tax</span>
                                <span>₹499</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span className="text-[#871845]">₹10,596</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-[#871845] hover:bg-[#611031]">
                            Proceed to Checkout
                        </Button>

                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage 