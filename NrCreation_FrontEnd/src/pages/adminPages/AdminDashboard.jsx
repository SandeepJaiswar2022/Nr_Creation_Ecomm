import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Package,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import { Link } from "react-router-dom"
import { OrderCharts, ProductCharts } from "@/features"
import { fetchAllOrders } from "@/store/slices/ordersSlice"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "@/store/slices/productSlice"

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState("week")
    const { orders, loading, selectedOrderFilters, totalPages } = useSelector(state => state.orders);
    const { products, categories, } = useSelector(store => store.product);


    const dispatch = useDispatch();
    const stats = [
        {
            title: "Total Revenue",
            value: "₹2,45,000",
            change: "+12.5%",
            trend: "up",
            icon: <DollarSign className="w-5 h-5" />,
            color: "bg-green-100 text-green-800"
        },
        {
            title: "Total Orders",
            value: "1,234",
            change: "+8.2%",
            trend: "up",
            icon: <ShoppingCart className="w-5 h-5" />,
            color: "bg-blue-100 text-blue-800"
        },
        {
            title: "New Customers",
            value: "156",
            change: "-3.1%",
            trend: "down",
            icon: <Users className="w-5 h-5" />,
            color: "bg-purple-100 text-purple-800"
        },
        {
            title: "Average Order Value",
            value: "₹1,985",
            change: "+5.7%",
            trend: "up",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "bg-yellow-100 text-yellow-800"
        }
    ]

    const recentOrders = [
        {
            id: "ORD001",
            customer: "John Doe",
            amount: "₹1,234",
            status: "Delivered",
            date: "2024-03-20"
        },
        {
            id: "ORD002",
            customer: "Jane Smith",
            amount: "₹2,345",
            status: "Processing",
            date: "2024-03-19"
        },
        {
            id: "ORD003",
            customer: "Mike Johnson",
            amount: "₹3,456",
            status: "Shipped",
            date: "2024-03-18"
        }
    ]

    const quickActions = [
        {
            title: "Manage Products",
            description: "Add, edit, or remove products from your catalog",
            icon: Package,
            link: "/admin/products"
        },
        {
            title: "Manage Orders",
            description: "View and update order statuses",
            icon: ShoppingCart,
            link: "/admin/orders"
        },
        {
            title: "User Management",
            description: "Manage user accounts and permissions",
            icon: Users,
            link: "/admin/users"
        },
        {
            title: "Analytics",
            description: "View sales and performance metrics",
            icon: TrendingUp,
            link: "/admin/analytics"
        }
    ]

    useEffect(() => {
        dispatch(fetchAllOrders(selectedOrderFilters));
        dispatch(fetchProducts({}));
    }, [dispatch]);




    return (
        <div className="container space-y-10 mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="border rounded-md px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                    <Button className="bg-[#871845] hover:bg-[#6a1337] text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        View Notifications
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-3 sm:p-4"
                    >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-xs sm:text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-sm sm:text-base text-gray-500 mb-1">{stat.title}</h3>
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* Revenue Chart */}
                {/* <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium mb-3">Revenue Overview</h3>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">Revenue Chart Placeholder</p>
                    </div>
                </div> */}

                {/* Orders Chart */}

                <div className="col-span-2">
                    <ProductCharts products={products} />
                </div>


                <div className="col-span-2">
                    <OrderCharts orders={orders} />
                </div>



                {/* Customer Demographics
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium mb-3">Customer Demographics</h3>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">Demographics Chart Placeholder</p>
                    </div>
                </div>

                Product Categories
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium mb-3">Product Categories</h3>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm">Categories Chart Placeholder</p>
                    </div>
                </div> */}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white p-6 rounded-lg cursor-pointer shadow-md hover:shadow-lg group hover:bg-[#871845] duration-1000 transition-colors ${index === 1 ? "bg-[#871845]" : ""}`}
                    >
                        <Link to={action.link} className="block">
                            <action.icon className="w-8 h-8 group-hover:text-white text-[#871845] mb-4" />
                            <h3 className="font-semibold mb-2 group-hover:text-white">{action.title}</h3>
                            <p className="text-gray-500 text-sm group-hover:text-white">{action.description}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">Order ID</th>
                                <th className="text-left py-3">Customer</th>
                                <th className="text-left py-3">Amount</th>
                                <th className="text-left py-3">Status</th>
                                <th className="text-left py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="py-3">{order.id}</td>
                                    <td className="py-3">{order.customer}</td>
                                    <td className="py-3">{order.amount}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard 