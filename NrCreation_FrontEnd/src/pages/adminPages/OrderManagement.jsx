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
import Pagination from "@/components/ReusableComponents/Pagination"
import { setSelectedOrderFilters } from "@/store/slices/ordersSlice"

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

    
    const { orders, loading, selectedOrderFilters, totalPages } = useSelector(state => state.orders);
    const [tempOrderFilters, setTempOrderFilters] = useState(selectedOrderFilters);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const dispatch = useDispatch();

    // Sync tempOrderFilters with redux selectedOrderFilters
    useEffect(() => {
        setTempOrderFilters(selectedOrderFilters);
    }, [selectedOrderFilters]);


    // Fetch all orders when filters change
    useEffect(() => {
        dispatch(fetchAllOrders(selectedOrderFilters));
    }, [dispatch, selectedOrderFilters]);

    // console.log("Orders in OrderManagement: ", orders);

    // Filter Handlers
    const handleOrderFilterChange = (type, value) => {
        setTempOrderFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };
    const handleOrderDateChange = (type, value) => {
        setTempOrderFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };
    const handleApplyOrderFilters = () => {
        dispatch(setSelectedOrderFilters(tempOrderFilters));
    };
    const handleClearOrderFilters = () => {



        const cleared = {
            search: '',
            startDate: '',
            endDate: '',
            orderStatus: '',
            priceLow: 0,
            priceHigh: 1000000,
            shippingMethod: '',
            page: 1,
            pageSize: selectedOrderFilters.pageSize,
        };


        setTempOrderFilters(cleared);
        dispatch(setSelectedOrderFilters(cleared));
    };
    const handleOrderPageChange = (newPage) => {
        dispatch(setSelectedOrderFilters({ ...selectedOrderFilters, page: newPage }));
    };
    const handleOrderPageSizeChange = (newSize) => {
        dispatch(setSelectedOrderFilters({ ...selectedOrderFilters, pageSize: newSize, page: 1 }));
    };

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

            {/* Search and Filter Bar (like ProfilePage) */}
            <div className="flex flex-wrap gap-3 items-end bg-gray-50 p-4 rounded-lg border mb-4">
                <Input
                    placeholder="Search by product name or customer email"
                    value={tempOrderFilters.search}
                    onChange={e => handleOrderFilterChange('search', e.target.value)}
                    className="max-w-xs"
                />
                <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <Input
                        type="date"
                        value={tempOrderFilters.startDate}
                        onChange={e => handleOrderDateChange('startDate', e.target.value)}
                        className="w-36"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <Input
                        type="date"
                        value={tempOrderFilters.endDate}
                        onChange={e => handleOrderDateChange('endDate', e.target.value)}
                        className="w-36"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Order Status</label>
                    <select
                        value={tempOrderFilters.orderStatus}
                        onChange={e => handleOrderFilterChange('orderStatus', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value=''>All</option>
                        <option value='PENDING'>Pending</option>
                        <option value='CONFIRMED'>Confirmed</option>
                        <option value='SHIPPED'>Shipped</option>
                        <option value='DELIVERED'>Delivered</option>
                        <option value='CANCELLED'>Cancelled</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Shipping</label>
                    <select
                        value={tempOrderFilters.shippingMethod}
                        onChange={e => handleOrderFilterChange('shippingMethod', e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value=''>All</option>
                        <option value='Standard'>Standard</option>
                        <option value='Express'>Express</option>
                        <option value='Pickup'>Pickup</option>
                    </select>
                </div>
                <Button
                    className="bg-[#871845] hover:bg-[#671234]"
                    onClick={handleApplyOrderFilters}
                    disabled={loading}
                >
                    Apply
                </Button>
                <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={handleClearOrderFilters}
                    disabled={loading}
                >
                    Clear
                </Button>
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
                                            {item?.quantity}x {item?.productName} - ₹{item?.price}
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
                                                        {item?.quantity}x {item?.productName}
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
                                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
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
            <Pagination
                selectedFilters={selectedOrderFilters}
                handlePageChange={handleOrderPageChange}
                totalPages={totalPages}
                handlePageSizeChange={handleOrderPageSizeChange}
            />
        </div>
    )
}

export default OrderManagement 