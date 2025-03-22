import { useState } from "react"
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
    Filter
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
        {
            id: "USR002",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+91 98765 43211",
            role: "Admin",
            status: "Active",
            joinDate: "2024-02-01",
            totalOrders: 8,
            totalSpent: "₹18,750"
        },
        {
            id: "USR003",
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "+91 98765 43212",
            role: "Vendor",
            status: "Suspended",
            joinDate: "2024-02-15",
            totalOrders: 5,
            totalSpent: "₹12,300"
        }
    ])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [expandedUser, setExpandedUser] = useState(null)

    const roles = ["all", "Admin", "Customer", "Vendor"]
    const statuses = ["all", "Active", "Suspended", "Inactive"]

    // Filter users based on search query, role, and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchQuery === "" ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.status.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = selectedRole === "all" || user.role === selectedRole
        const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

        return matchesSearch && matchesRole && matchesStatus
    })

    const handleRoleUpdate = (userId, newRole) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ))
    }

    const handleStatusUpdate = (userId, newStatus) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ))
    }

    const toggleUserExpansion = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId)
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            {/* ... existing header ... */}

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
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                            setSelectedRole("all")
                            setSelectedStatus("all")
                            setSearchQuery("")
                        }}
                    >
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Reset Filters
                    </Button>
                </div>
            </div>

            {/* Users List - Mobile View */}
            <div className="block sm:hidden space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-md p-3">
                        {/* ... existing user card header ... */}

                        {expandedUser === user.id && (
                            <div className="space-y-3 pt-3 border-t">
                                {/* ... existing user details ... */}

                                <div className="flex gap-2">
                                    <Select
                                        value={user.role}
                                        onValueChange={(value) => handleRoleUpdate(user.id, value)}
                                    >
                                        <SelectTrigger className="flex-1 text-xs px-2 py-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Customer">Customer</SelectItem>
                                            <SelectItem value="Vendor">Vendor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={user.status}
                                        onValueChange={(value) => handleStatusUpdate(user.id, value)}
                                    >
                                        <SelectTrigger className="flex-1 text-xs px-2 py-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Activate</SelectItem>
                                            <SelectItem value="Suspended">Suspend</SelectItem>
                                            <SelectItem value="Inactive">Deactivate</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">User ID</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Name</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Contact</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Role</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Status</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Join Date</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Activity</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{user.id}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-sm sm:text-base">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="text-sm sm:text-base">{user.email}</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${user.role === "Admin" ? "bg-purple-100 text-purple-800" :
                                                user.role === "Vendor" ? "bg-blue-100 text-blue-800" :
                                                    "bg-green-100 text-green-800"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${user.status === "Active" ? "bg-green-100 text-green-800" :
                                                user.status === "Suspended" ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">{user.joinDate}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="text-sm sm:text-base">{user.totalOrders} orders</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user.totalSpent}</div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="flex gap-1.5">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) => handleRoleUpdate(user.id, value)}
                                                >
                                                    <SelectTrigger className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Customer">Customer</SelectItem>
                                                        <SelectItem value="Vendor">Vendor</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={user.status}
                                                    onValueChange={(value) => handleStatusUpdate(user.id, value)}
                                                >
                                                    <SelectTrigger className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Activate</SelectItem>
                                                        <SelectItem value="Suspended">Suspend</SelectItem>
                                                        <SelectItem value="Inactive">Deactivate</SelectItem>
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

export default UserManagement