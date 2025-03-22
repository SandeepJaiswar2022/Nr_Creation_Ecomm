import { useState } from "react"
import { motion } from "framer-motion"
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    Calendar,
    ArrowUp,
    ArrowDown,
    BarChart2,
    PieChart,
    LineChart
} from "lucide-react"

const Analytics = () => {
    const [timeRange, setTimeRange] = useState("week")

    const stats = [
        {
            title: "Total Revenue",
            value: "₹2,45,000",
            change: "+12.5%",
            trend: "up",
            icon: <DollarSign className="w-6 h-6" />,
            color: "bg-green-100 text-green-800"
        },
        {
            title: "Total Orders",
            value: "1,234",
            change: "+8.2%",
            trend: "up",
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "bg-blue-100 text-blue-800"
        },
        {
            title: "New Customers",
            value: "156",
            change: "-3.1%",
            trend: "down",
            icon: <Users className="w-6 h-6" />,
            color: "bg-purple-100 text-purple-800"
        },
        {
            title: "Average Order Value",
            value: "₹1,985",
            change: "+5.7%",
            trend: "up",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "bg-orange-100 text-orange-800"
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <select
                        className="border rounded-md px-4 py-2 flex-1 sm:flex-none"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-full ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1">
                                {stat.trend === "up" ? (
                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Revenue Overview</h2>
                        <LineChart className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm sm:text-base">Revenue Chart Placeholder</p>
                    </div>
                </motion.div>

                {/* Orders Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Orders Overview</h2>
                        <BarChart2 className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm sm:text-base">Orders Chart Placeholder</p>
                    </div>
                </motion.div>

                {/* Customer Demographics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Customer Demographics</h2>
                        <Users className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm sm:text-base">Demographics Chart Placeholder</p>
                    </div>
                </motion.div>

                {/* Product Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold">Product Categories</h2>
                        <PieChart className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm sm:text-base">Categories Chart Placeholder</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Analytics 