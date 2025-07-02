import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    Filter,
    Package,
    DollarSign,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    Truck,
    ShoppingBag,
    CreditCard,
    User
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllOrders } from "@/store/slices/ordersSlice"
import { formatDate } from "@/utils/formatString"

const OrderManagement = () => {
    // const [orders, setOrders] = useState([
    //     {
    //         id: "ORD001",
    //         customer: "John Doe",
    //         date: "2024-02-20",
    //         time: "14:30",
    //         total: "₹2,499",
    //         status: "Processing",
    //         items: [
    //             { name: "Silk Dupatta", quantity: 2, price: 999 },
    //             { name: "Lehenga Set", quantity: 1, price: 1499 }
    //         ],
    //         paymentStatus: "Paid"
    //     },
    //     {
    //         id: "ORD002",
    //         customer: "Jane Smith",
    //         date: "2024-02-19",
    //         time: "16:45",
    //         total: "₹1,999",
    //         status: "Shipped",
    //         items: [
    //             { name: "Designer Saree", quantity: 1, price: 1999 }
    //         ],
    //         paymentStatus: "Paid"
    //     },
    //     {
    //         id: "ORD003",
    //         customer: "Mike Johnson",
    //         date: "2024-02-18",
    //         time: "09:15",
    //         total: "₹3,499",
    //         status: "Delivered",
    //         items: [
    //             { name: "Bridal Lehenga", quantity: 1, price: 3499 }
    //         ],
    //         paymentStatus: "Paid"
    //     }
    // ])

    const { orders, loading } = useSelector(state => state.orders);

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [expandedOrder, setExpandedOrder] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch])

    const statuses = [
        "all",
        "Pending",
        "Processing",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Refunded",
        "Failed Delivery"
    ]

    // Filter orders based on search query and status
    // const filteredOrders = orders.filter(order => {
    //     const searchLower = searchQuery.toLowerCase()
    //     const matchesSearch = searchQuery === "" ||
    //         order.id.toLowerCase().includes(searchLower) ||
    //         order.customer.toLowerCase().includes(searchLower) ||
    //         order.status.toLowerCase().includes(searchLower) ||
    //         order.total.toLowerCase().includes(searchLower) ||
    //         order.paymentStatus.toLowerCase().includes(searchLower)

    //     const matchesStatus = selectedStatus === "all" || order.status === selectedStatus

    //     return matchesSearch && matchesStatus
    // })

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending":
                return <Clock className="w-4 h-4 text-yellow-500" />
            case "Processing":
                return <Package className="w-4 h-4 text-blue-500" />
            case "Confirmed":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "Shipped":
                return <Truck className="w-4 h-4 text-indigo-500" />
            case "Out for Delivery":
                return <ShoppingBag className="w-4 h-4 text-purple-500" />
            case "Delivered":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "Cancelled":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "Refunded":
                return <CreditCard className="w-4 h-4 text-orange-500" />
            case "Failed Delivery":
                return <AlertCircle className="w-4 h-4 text-red-500" />
            default:
                return <Package className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800"
            case "Processing":
                return "bg-blue-100 text-blue-800"
            case "CONFIRMED":
                return "bg-green-100 text-green-800"
            case "SHIPPED":
                return "bg-indigo-100 text-indigo-800"
            case "Out for Delivery":
                return "bg-purple-100 text-purple-800"
            case "DELIVERED":
                return "bg-green-100 text-green-800"
            case "CANCELLED":
                return "bg-red-100 text-red-800"
            case "Refunded":
                return "bg-orange-100 text-orange-800"
            case "PAYMENT_FAILED":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleStatusUpdate = (orderId, newStatus) => {
        // setOrders(orders.map(order =>
        //     order.id === orderId ? { ...order, status: newStatus } : order
        // ))
        console.log("Handle status change");

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
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map(status => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
                        onClick={() => {
                            setSelectedStatus("all")
                            setSearchQuery("")
                        }}
                    >
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Reset Filters
                    </Button>
                </div>
            </div>

            {/* Orders List - Mobile View */}
            <div className="block sm:hidden space-y-3">
                {orders.map((order) => (
                    <div key={order?.razorpayOrderId} className="bg-white rounded-lg shadow-md p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="font-medium text-sm">Order #{order?.id}</div>
                                <div className="text-xs text-gray-500">{order?.date}</div>
                            </div>
                            <button
                                onClick={() => toggleOrderExpansion(order?.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedOrder === order?.id ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {expandedOrder === order?.id && (
                            <div className="space-y-3 pt-3 border-t">
                                <div className="space-y-1.5">
                                    <div className="text-xs">
                                        <span className="font-medium">Customer name & ID:</span> {order?.customerName}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Date:</span> {order?.date}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Time:</span> {order?.time}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-xs font-medium">Order Items:</div>
                                    {order?.items?.map((item, index) => (
                                        <div key={index} className="text-xs">
                                            {item?.quantity}x {item?.name} - ₹{item?.price}
                                        </div>
                                    ))}
                                    <div className="text-xs font-medium mt-1">
                                        Total: {order?.totalDiscountPrice}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {getStatusIcon(order?.orderStatus)}
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(order?.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => handleStatusUpdate(order?.id, value)}
                                    >
                                        <SelectTrigger className="flex-1 text-xs px-2 py-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                            <SelectItem value="Shipped">Shipped</SelectItem>
                                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                            <SelectItem value="Delivered">Delivered</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            <SelectItem value="Refunded">Refunded</SelectItem>
                                            <SelectItem value="Failed Delivery">Failed Delivery</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Customer Name & ID</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Items</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Total</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Status</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Date</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order?.razorpayOrderId} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{order?.razorpayOrderId}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-sm sm:text-base">{order?.customerName}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                                            <div className="space-y-0.5">
                                                {order?.orderItems.map((item, index) => (
                                                    <div key={index} className="text-xs sm:text-sm">
                                                        {item?.quantity}x {item?.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">₹{order?.totalDiscountPrice}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(order?.orderStatus)}
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(order?.orderStatus)}`}>
                                                    {order?.orderStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{formatDate(order?.orderDate)}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex gap-1.5">
                                                <Select
                                                    value={order?.orderStatus}
                                                    onValueChange={(value) => handleStatusUpdate(order?.id, value)}
                                                >
                                                    <SelectTrigger className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="Processing">Processing</SelectItem>
                                                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                        <SelectItem value="Refunded">Refunded</SelectItem>
                                                        <SelectItem value="Failed Delivery">Failed Delivery</SelectItem>
                                                    </SelectContent>
                                                </Select>
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