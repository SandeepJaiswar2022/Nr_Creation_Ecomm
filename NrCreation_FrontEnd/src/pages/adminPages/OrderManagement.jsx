import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronDown
} from "lucide-react"

const OrderManagement = () => {
    const [orders, setOrders] = useState([
        {
            id: "ORD001",
            customer: "John Doe",
            email: "john@example.com",
            items: [
                { name: "Silk Dupatta", quantity: 2, price: 1999 },
                { name: "Lehenga Set", quantity: 1, price: 15999 }
            ],
            total: 19997,
            status: "Processing",
            date: "2024-03-20",
            shippingAddress: "123 Main St, City, Country",
            paymentMethod: "Credit Card"
        },
        // Add more mock orders as needed
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedDateRange, setSelectedDateRange] = useState("all")
    const [expandedOrder, setExpandedOrder] = useState(null)

    const statuses = ["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    const dateRanges = ["all", "Today", "This Week", "This Month", "Last Month"]

    const getStatusIcon = (status) => {
        switch (status) {
            case "Processing":
                return <Clock className="w-4 h-4" />
            case "Shipped":
                return <Truck className="w-4 h-4" />
            case "Delivered":
                return <CheckCircle className="w-4 h-4" />
            case "Cancelled":
                return <XCircle className="w-4 h-4" />
            default:
                return <Package className="w-4 h-4" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "bg-yellow-100 text-yellow-800"
            case "Shipped":
                return "bg-blue-100 text-blue-800"
            case "Delivered":
                return "bg-green-100 text-green-800"
            case "Cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ))
    }

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId)
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Order Management</h1>
                <Button className="bg-[#871845] hover:bg-[#6a1337] w-full sm:w-auto text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    View Notifications
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8 sm:pl-10 text-sm sm:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        className="border rounded-md px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border rounded-md px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none"
                        value={selectedDateRange}
                        onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                        {dateRanges.map(range => (
                            <option key={range} value={range}>
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </option>
                        ))}
                    </select>
                    <Button variant="outline" className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Orders List - Mobile View */}
            <div className="block sm:hidden space-y-3">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="font-medium text-sm">Order #{order.id}</div>
                                <div className="text-xs text-gray-500">{order.date}</div>
                            </div>
                            <button
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {expandedOrder === order.id && (
                            <div className="space-y-3 pt-3 border-t">
                                <div className="space-y-1.5">
                                    <div className="text-xs">
                                        <span className="font-medium">Customer:</span> {order.customer}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Email:</span> {order.email}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Address:</span> {order.shippingAddress}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-xs font-medium">Order Items:</div>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="text-xs">
                                            {item.quantity}x {item.name} - ₹{item.price}
                                        </div>
                                    ))}
                                    <div className="text-xs font-medium mt-1">
                                        Total: ₹{order.total}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex gap-1.5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(order.id, "Processing")}
                                        className="flex-1 text-xs px-2 py-1"
                                    >
                                        Process
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(order.id, "Shipped")}
                                        className="flex-1 text-xs px-2 py-1"
                                    >
                                        Ship
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleStatusUpdate(order.id, "Cancelled")}
                                        className="flex-1 text-xs px-2 py-1 text-red-500"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Orders Table - Desktop View */}
            <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="min-w-[800px]">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Order ID</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Customer</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Items</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Total</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Status</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Date</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{order.id}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-sm sm:text-base">{order.customer}</div>
                                                <div className="text-xs sm:text-sm text-gray-500">{order.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                                            <div className="space-y-0.5">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="text-xs sm:text-sm">
                                                        {item.quantity}x {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">₹{order.total}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(order.status)}
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{order.date}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(order.id, "Processing")}
                                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                                >
                                                    Process
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(order.id, "Shipped")}
                                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                                >
                                                    Ship
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(order.id, "Cancelled")}
                                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 text-red-500"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderManagement 