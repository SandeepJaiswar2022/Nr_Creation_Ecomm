import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCartItems, updateQuantity } from "@/store/slices/cartSlice";
import { SkeletonLoader } from "@/components/ReusableComponents";

const NewCartPage = () => {
    const dispatch = useDispatch();
    const { cartItems, cartTotalAmount, cartLoading } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);

    const handleQuantityChange = (cartItemId, newQuantity) => {
        console.log('Quantity changed:', { cartItemId, quantity: newQuantity });
        dispatch(updateQuantity({ cartItemId, quantity: newQuantity }));
    };

    const handleDelete = (productId) => {
        console.log('Delete item:', { productId });
    };

    if (cartLoading === `FetchingCart`) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <SkeletonLoader className="h-8 w-32" />
                    <SkeletonLoader className="h-8 w-24" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex gap-4">
                            <SkeletonLoader className="h-48 w-40" />
                            <div className="flex-1 space-y-2">
                                <SkeletonLoader className="h-6 w-3/4" />
                                <SkeletonLoader className="h-4 w-1/4" />
                                <SkeletonLoader className="h-8 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-8 w-8 text-[#871845]" />
                                <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
                            </div>
                            <p className="text-muted-foreground text-white px-3 py-1 rounded-full bg-[#871845]">
                                {cartItems?.length || 0} items
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {cartItems?.length > 0 && cartItems?.map((item) => (
                                <motion.div
                                    key={item?.itemId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-48 h-64 sm:h-48 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={item?.imageUrl}
                                                alt="Product"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                {/* Product Details */}
                                                <div className="space-y-2 mb-4">
                                                    <h3 className="font-semibold text-lg sm:text-xl">Product #{item?.productId}</h3>
                                                    <p className="text-muted-foreground text-sm">Unit Price: ₹{item?.unitPrice.toFixed(2)}</p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleQuantityChange(item?.itemId, item?.quantity - 1)}
                                                        disabled={item?.quantity <= 1}
                                                        className="h-8 w-8 border-[#871845] text-[#871845]"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item?.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleQuantityChange(item?.itemId, item?.quantity + 1)}
                                                        className="h-8 w-8 border-[#871845] text-[#871845]"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                {/* Total Price */}
                                                <p className="font-semibold text-lg text-[#871845]">
                                                    ₹{item?.totalPrice.toFixed(2)}
                                                </p>

                                                {/* Delete Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                                                    onClick={() => handleDelete(item?.productId)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        {cartItems?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:w-80"
                            >
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>₹{cartTotalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="border-t pt-3 mt-3">
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>Total Amount</span>
                                                <span className="text-[#871845]">₹{cartTotalAmount.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Including all taxes</p>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-6 bg-[#871845] hover:bg-[#671234] text-white">
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Empty Cart State */}
                    {(!cartItems || cartItems.length === 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-lg shadow-sm p-12 text-center"
                        >
                            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-[#871845] opacity-20" />
                            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">Add items to your cart to see them here</p>
                            <Button className="bg-[#871845] hover:bg-[#671234]">
                                Continue Shopping
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default NewCartPage; 