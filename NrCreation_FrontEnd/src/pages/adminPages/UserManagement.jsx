import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Search,
    Filter
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { LoadingSpinner, PageLoader, Pagination } from "@/components/ReusableComponents"
import { fetchAllUser, setFilters, updateUserRole } from "@/store/slices/userSlice"
import { useMinimumLoading } from "@/hooks/useMinimumLoading"

const UserManagement = () => {
    const { users, filters, loading } = useSelector((state) => state.user)
    const totalPages = filters?.totalPages;
    const { user } = useSelector((state) => state.auth);
    const { isLoading, startLoading } = useMinimumLoading(1000, 5000);

    const dispatch = useDispatch()

    // console.log(`users in user management : `, users);


    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [expandedUser, setExpandedUser] = useState(null)

    const roles = ["all", "Admin", "Customer", "Vendor"]
    const statuses = ["all", "Active", "Suspended", "Inactive"]

    // console.log("User Management - Filters: ", filters);

    useEffect(() => {
        // Fetch users from the API or any other source
        if (user?.role === 'ADMIN')
            dispatch(fetchAllUser({ loggedInAdminEmail: user?.email, filters: filters }));
    }, [dispatch, user, filters])

    // Filter users based on search query, role, and status
    // const filteredUsers = users.filter(user => {
    //     const matchesSearch = searchQuery === "" ||
    //         user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user?.phone.includes(searchQuery) ||
    //         user?.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user?.status.toLowerCase().includes(searchQuery.toLowerCase())

    //     const matchesRole = selectedRole === "all" || user?.role === selectedRole
    //     const matchesStatus = selectedStatus === "all" || user?.status === selectedStatus

    //     return matchesSearch && matchesRole && matchesStatus
    // })

    // const handleRoleUpdate = (userId, newRole) => {
    //     setUsers(users.map(user =>
    //         user?.id === userId ? { ...user, role: newRole } : user
    //     ))
    // }

    // const handleStatusUpdate = (userId, newStatus) => {
    //     setUsers(users.map(user =>
    //         user?.id === userId ? { ...user, status: newStatus } : user
    //     ))
    // }

    const handleFilterChange = async (newFilters) => {

        // console.log("New filters: ", newFilters);
        await startLoading(async () => {
            dispatch(setFilters(newFilters));
        });
        // setSelectedStatus(newFilters.status || "all");
    };


    const handleSearch = async () => {
        console.log("Search key : ", searchQuery);
        await handleFilterChange({
            ...filters,
            search: searchQuery,
        });
    };

    const handleRoleChange = (value) => {
        setSelectedRole(value)
        console.log("Selected role: ", value);
        handleFilterChange({
            ...filters,
            role: value === "all" ? "" : value,
        });
    }

    const handlePageNumberChange = async (newPage) => {
        await handleFilterChange({ ...filters, page: newPage });
    };
    const handlePageSizeChange = async (newSize) => {
        await handleFilterChange({ ...filters, pageSize: newSize, page: 1 });
    };
    const toggleUserExpansion = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId)
    }


    if (isLoading) {
        return (
            <PageLoader message="Loading Users..." />
            // <LoadingSpinner />
        )
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
                <Button
                    variant="outline"
                    className="text-sm sm:text-base bg-[#871845] color-transition-delay hover:bg-[#430e2b] text-white hover:text-white px-3 sm:px-4 py-1.5 sm:py-2"
                    onClick={() => handleSearch()}
                >
                    Search
                </Button>
                <div className="flex flex-wrap gap-2">
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
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
                {users.map((user) => (
                    <div key={user?.userId} className="bg-white rounded-lg shadow-md p-3">
                        {/* ... existing user card header ... */}

                        {expandedUser === user?.userId && (
                            <div className="space-y-3 pt-3 border-t">
                                {/* ... existing user details ... */}

                                <div className={`flex gap-1.5 ${loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                                    }`}>
                                    <Select
                                        // value={user?.role}
                                        onValueChange={(value) => dispatch(updateUserRole({ userEmail: user?.email, role: value }))
                                        }
                                    >
                                        <SelectTrigger className="flex-1 text-xs px-2 py-1">
                                            <SelectValue placeholder="Change Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="USER">USER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={user?.status}
                                        onValueChange={(value) => console.log("Change status to: ", value) /* handleStatusUpdate(user?.id, value) */}
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
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Activity</th>
                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user?.userId} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">USR00{user?.userId}</td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-sm sm:text-base">{user?.firstName + ` ` + user?.lastName}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="text-sm sm:text-base">{user?.email}</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user?.phone}</div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${user?.role === "Admin" ? "bg-purple-100 text-purple-800" :
                                                user?.role === "Vendor" ? "bg-blue-100 text-blue-800" :
                                                    "bg-green-100 text-green-800"
                                                }`}>
                                                {user?.role}
                                            </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${user?.status === "Active" ? "bg-green-100 text-green-800" :
                                                user?.status === "Suspended" ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>
                                                {user?.status || "Active"}
                                            </span>
                                        </td>

                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className="text-sm sm:text-base">{user?.totalOrders} orders</div>
                                            <div className="text-xs sm:text-sm text-gray-500">{user?.totalSpent}</div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                                            <div className={`flex gap-1.5 ${loading ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                                                }`}>
                                                <Select
                                                    // value={user?.role}
                                                    onValueChange={(value) => dispatch(updateUserRole({ userEmail: user?.email, role: value }))
                                                    }
                                                >
                                                    <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                                                        <SelectValue placeholder="Change Role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                                            <SelectItem value="USER">User</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    // value={user?.status}
                                                    onValueChange={(value) => console.log("Change status to: ", value)}
                                                >
                                                    <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                                                        <SelectValue placeholder="Change Status" />
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
            <Pagination
                selectedFilters={filters}
                handlePageChange={handlePageNumberChange}
                totalPages={totalPages}
                handlePageSizeChange={handlePageSizeChange}
            />
        </div>
    )
}

export default UserManagement