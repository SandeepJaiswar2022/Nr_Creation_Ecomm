import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    User,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown
} from "lucide-react"

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            id: "USR001",
            name: "John Doe",
            email: "john@example.com",
            phone: "+91 98765 43210",
            role: "Customer",
            status: "Active",
            joinDate: "2024-01-15",
            totalOrders: 12,
            totalSpent: "₹24,500"
        },
        // Add more mock users as needed
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [expandedUser, setExpandedUser] = useState(null)

    const roles = ["all", "Admin", "Customer", "Vendor"]
    const statuses = ["all", "Active", "Inactive", "Suspended"]

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "Inactive":
                return <XCircle className="w-4 h-4 text-gray-500" />
            case "Suspended":
                return <AlertCircle className="w-4 h-4 text-red-500" />
            default:
                return <User className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800"
            case "Inactive":
                return "bg-gray-100 text-gray-800"
            case "Suspended":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleStatusUpdate = (userId, newStatus) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ))
    }

    const handleRoleUpdate = (userId, newRole) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ))
    }

    const toggleUserExpansion = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId)
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">User Management</h1>
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
                        placeholder="Search users..."
                        className="pl-8 sm:pl-10 text-sm sm:text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        className="border rounded-md px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>
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
                    <Button variant="outline" className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Users List - Mobile View */}
            <div className="block sm:hidden space-y-3">
                {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleUserExpansion(user.id)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {expandedUser === user.id && (
                            <div className="space-y-3 pt-3 border-t">
                                <div className="space-y-1.5">
                                    <div className="text-xs">
                                        <span className="font-medium">Phone:</span> {user.phone}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Role:</span> {user.role}
                                    </div>
                                    <div className="text-xs">
                                        <span className="font-medium">Join Date:</span> {user.joinDate}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="text-xs text-gray-500">Total Orders</div>
                                        <div className="text-sm font-medium">{user.totalOrders}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Total Spent</div>
                                        <div className="text-sm font-medium">{user.totalSpent}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {getStatusIcon(user.status)}
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs px-2 py-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs px-2 py-1 text-red-500"
                                    >
                                        Suspend
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Users Table - Desktop View */}
            <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="min-w-[800px]">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">User</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Contact</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Role</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Status</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Join Date</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Activity</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm sm:text-base">{user.name}</div>
                                                    <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="text-sm sm:text-base">{user.phone}</div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{user.role}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(user.status)}
                                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{user.joinDate}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm">{user.totalOrders}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm">{user.totalSpent}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 text-red-500"
                                                >
                                                    Suspend
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

export default UserManagement 