import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Settings, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import WishlistPage from './WishlistPage'
import { useDispatch, useSelector } from 'react-redux'
import { fetchParticularCustomerOrders, setSelectedOrderFilters } from '@/store/slices/ordersSlice'
import { formatDate } from '@/utils/formatString'
import Pagination from '@/components/ReusableComponents/Pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
]

const orderStatusOptions = [
    'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
];
const shippingMethodOptions = [
    '', 'Standard', 'Express', 'Pickup'
];

const ProfilePage = () => {
    const { tabId } = useParams();
    const defaultTab = "profile";
    const tabIds = tabs.map(t => t.id);
    const initialTabId = tabIds.includes(tabId) ? tabId : defaultTab;
    const [activeTab, setActiveTab] = useState(initialTabId);
    const [openOrderId, setOpenOrderId] = useState(null);
    const { customerOrders, selectedOrderFilters, totalPages, loading } = useSelector(state => state.orders);
    const [tempOrderFilters, setTempOrderFilters] = useState(selectedOrderFilters);

    const toggle = (id) =>
        setOpenOrderId((prev) => (prev === id ? null : id));

    const dispatch = useDispatch();

    //any change in dependency called selectedOrderFilters will call the api and update the state
    useEffect(() => {
        if (activeTab === 'orders') {
            dispatch(fetchParticularCustomerOrders(selectedOrderFilters));
        }
    }, [dispatch, activeTab, selectedOrderFilters]);


    useEffect(() => {
        if (tabIds.includes(tabId)) {
            setActiveTab(tabId);
        } else {
            setActiveTab(defaultTab);
        }
    }, [tabId]);

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
    };
    const handleOrderPageChange = (newPage) => {
        dispatch(setSelectedOrderFilters({ ...selectedOrderFilters, page: newPage }));
    };
    const handleOrderPageSizeChange = (newSize) => {
        dispatch(setSelectedOrderFilters({ ...selectedOrderFilters, pageSize: newSize, page: 1 }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-[#871845] text-white'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Profile Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input placeholder="First Name" defaultValue="John" />
                                    <Input placeholder="Last Name" defaultValue="Doe" />
                                    <Input
                                        placeholder="Email"
                                        defaultValue="john@example.com"
                                        className="md:col-span-2"
                                    />
                                    <Input
                                        placeholder="Phone"
                                        defaultValue="+91 9876543210"
                                        className="md:col-span-2"
                                    />
                                </div>
                                <Button className="bg-[#871845] hover:bg-[#611031]">
                                    Save Changes
                                </Button>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <WishlistPage />
                        )}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">My Orders</h2>
                                {/* Order Filters Bar */}
                                <div className="flex flex-wrap gap-3 items-end bg-gray-50 p-4 rounded-lg border mb-4">
                                    <Input
                                        placeholder="Search by product name"
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
                                        <Select
                                            value={tempOrderFilters.orderStatus}
                                            onValueChange={(value) => handleOrderFilterChange("orderStatus", value)}
                                        >
                                            <SelectTrigger className="w-[180px] border rounded px-2 py-1 text-sm">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderStatusOptions.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    {/* <div>
                                        <label className="block text-xs text-gray-500 mb-1">Price Range</label>
                                        <div className="flex gap-1 items-center">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={tempOrderFilters.priceLow}
                                                onChange={e => handleOrderFilterChange('priceLow', Number(e.target.value))}
                                                className="w-20"
                                                placeholder="Min"
                                            />
                                            <span className="mx-1">-</span>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={tempOrderFilters.priceHigh}
                                                onChange={e => handleOrderFilterChange('priceHigh', Number(e.target.value))}
                                                className="w-20"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div> */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Shipping</label>
                                        <select
                                            value={tempOrderFilters.shippingMethod}
                                            onChange={e => handleOrderFilterChange('shippingMethod', e.target.value)}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            {shippingMethodOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt || 'All'}</option>
                                            ))}
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
                                {/* Orders List */}
                                <div className="space-y-4">
                                    {customerOrders.length === 0 && (
                                        <div className="text-center text-gray-500">No orders found.</div>
                                    )}
                                    {customerOrders.map((order) => {
                                        const {
                                            orderId,
                                            orderDate,
                                            orderStatus,
                                            orderAmount,
                                            orderItems,
                                            shippingAddress,
                                            shippingMethod,
                                            totalDiscountPrice,
                                        } = order;

                                        const firstItem = orderItems[0] ?? {};
                                        const itemCount = orderItems.length;

                                        const badgeColor =
                                            orderStatus === "DELIVERED"
                                                ? "bg-green-100 text-green-700"
                                                : orderStatus === "CONFIRMED"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600";

                                        return (
                                            <div
                                                key={orderId}
                                                className="border rounded-lg p-4 space-y-4"
                                            >
                                                {/* summary row */}
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">
                                                            Order #{orderId.toString().padStart(6, "0")}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Placed on {formatDate(orderDate)}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-sm whitespace-nowrap ${badgeColor}`}
                                                    >
                                                        {orderStatus}
                                                    </span>
                                                </div>

                                                {/* compact product preview */}
                                                <div className="flex gap-4">
                                                    <img
                                                        src={firstItem.imageUrl}
                                                        alt={firstItem.productName ?? "Product image"}
                                                        className="w-20 h-20 object-cover rounded-md bg-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-medium">
                                                            {firstItem.productName ?? "Product Name"}
                                                            {itemCount > 1 && (
                                                                <span className="text-gray-500">
                                                                    {" "}
                                                                    + {itemCount - 1} more
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {firstItem.quantity}
                                                        </p>
                                                        <p className="text-[#871845] font-medium">
                                                            ₹{orderAmount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* toggle button */}
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => toggle(orderId)}
                                                >
                                                    {openOrderId === orderId
                                                        ? "Hide Order Details"
                                                        : "View Order Details"}
                                                </Button>

                                                {/* full order details (collapsible) */}
                                                {openOrderId === orderId && (
                                                    <div className="space-y-4 border-t pt-4 text-sm text-gray-700">
                                                        {/* items list */}
                                                        <div className="space-y-2">
                                                            <p className="font-medium mb-1">Items:</p>
                                                            {orderItems.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex justify-between"
                                                                >
                                                                    <span>
                                                                        {item.productName ?? "Product"} × {item.quantity}
                                                                    </span>
                                                                    <span>₹{item.totalPrice.toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* price block */}
                                                        <div className="flex justify-between font-medium">
                                                            <span>Total:</span>
                                                            <span>₹{orderAmount.toFixed(2)}</span>
                                                        </div>
                                                        {totalDiscountPrice && (
                                                            <div className="flex justify-between text-gray-500">
                                                                <span>Discounted Total:</span>
                                                                <span>₹{totalDiscountPrice.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        {/* shipping */}
                                                        <div>
                                                            <p className="font-medium mb-1">Shipping Address:</p>
                                                            <p>
                                                                {shippingAddress.fullName}
                                                                <br />
                                                                {shippingAddress.address}
                                                                <br />
                                                                {shippingAddress.city}, {shippingAddress.state} –
                                                                {shippingAddress.pinCode}
                                                                <br />
                                                                {shippingAddress.country}
                                                                <br />
                                                                Phone: {shippingAddress.phone}
                                                            </p>
                                                            {shippingMethod && (
                                                                <p className="mt-2">
                                                                    Shipping Method: {shippingMethod}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <Pagination
                                    selectedFilters={selectedOrderFilters}
                                    handlePageChange={handleOrderPageChange}
                                    totalPages={totalPages}
                                    handlePageSizeChange={handleOrderPageSizeChange}
                                />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Account Settings</h2>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-medium mb-2">Change Password</h3>
                                        <div className="space-y-4">
                                            <Input type="password" placeholder="Current Password" />
                                            <Input type="password" placeholder="New Password" />
                                            <Input type="password" placeholder="Confirm New Password" />
                                            <Button className="bg-[#871845] hover:bg-[#611031]">
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-medium mb-2">Notification Settings</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" defaultChecked />
                                                <span>Email notifications for orders</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" defaultChecked />
                                                <span>SMS notifications for orders</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" defaultChecked />
                                                <span>Promotional emails</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage 