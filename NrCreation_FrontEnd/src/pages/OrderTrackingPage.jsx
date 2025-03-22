import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Truck, CheckCircle2 } from 'lucide-react'
import Breadcrumbs from '@/components/ReusableComponents/Breadcrumbs'
import LoadingSpinner from '@/components/ReusableComponents/LoadingSpinner'
import EmptyState from '@/components/ReusableComponents/EmptyState'

const OrderTrackingPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [orderFound, setOrderFound] = useState(true)
    const [orderId, setOrderId] = useState('')

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Order Tracking', path: '/track-order' }
    ]

    const steps = [
        { title: 'Order Confirmed', date: 'March 15, 2024 9:30 AM', icon: Package, status: 'completed' },
        { title: 'Out for Delivery', date: 'March 16, 2024 10:45 AM', icon: Truck, status: 'current' },
        { title: 'Delivered', date: 'Estimated March 17, 2024', icon: CheckCircle2, status: 'upcoming' }
    ]

    const handleTrackOrder = async () => {
        if (!orderId.trim()) return

        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setOrderFound(true)
        setIsLoading(false)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="flex gap-4 mb-6">
                        <Input
                            placeholder="Enter Order ID"
                            className="flex-1"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            className="bg-[#871845] hover:bg-[#611031]"
                            onClick={handleTrackOrder}
                            disabled={isLoading || !orderId.trim()}
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" className="mr-2" />
                            ) : null}
                            Track Order
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : !orderFound ? (
                        <EmptyState
                            title="No Order Found"
                            description="Enter your order ID to track your package"
                            icon={Package}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Order Details */}
                            <div className="border-b pb-6">
                                <h2 className="font-semibold mb-4">Order Details</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Order ID</p>
                                        <p className="font-medium">{orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Order Date</p>
                                        <p className="font-medium">March 15, 2024</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Estimated Delivery</p>
                                        <p className="font-medium">March 17, 2024</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Shipping Address</p>
                                        <p className="font-medium">123 Main St, City, State, 12345</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className="relative">
                                {steps.map((step, index) => {
                                    const Icon = step.icon
                                    return (
                                        <div key={step.title} className="flex gap-4 mb-8 last:mb-0">
                                            <div className="relative">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'completed'
                                                        ? 'bg-[#871845] text-white'
                                                        : step.status === 'current'
                                                            ? 'bg-[#871845] bg-opacity-20 text-[#871845]'
                                                            : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                {index !== steps.length - 1 && (
                                                    <div
                                                        className={`absolute top-8 left-4 w-0.5 h-12 ${step.status === 'completed'
                                                            ? 'bg-[#871845]'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{step.title}</h3>
                                                <p className="text-sm text-gray-500">{step.date}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderTrackingPage 