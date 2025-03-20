import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Settings, ShoppingBag, Heart, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

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

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">My Orders</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((order) => (
                                        <div
                                            key={order}
                                            className="border rounded-lg p-4 space-y-4"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">Order #{order}23456</p>
                                                    <p className="text-sm text-gray-500">
                                                        Placed on 12 March 2024
                                                    </p>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    Delivered
                                                </span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-200 rounded-md">
                                                    <span className="sr-only">Product Image</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Product Name</p>
                                                    <p className="text-sm text-gray-500">
                                                        Size: M | Qty: 1
                                                    </p>
                                                    <p className="text-[#871845] font-medium">₹4,999</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full">
                                                View Order Details
                                            </Button>
                                        </div>
                                    ))}
                                </div>
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