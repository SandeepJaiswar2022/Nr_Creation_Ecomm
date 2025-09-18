import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Breadcrumbs from '@/components/ReusableComponents/Breadcrumbs'
import LoadingSpinner from '@/components/ReusableComponents/LoadingSpinner'

const ContactPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    })

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Contact Us', path: '/contact' }
    ]

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['123 Fashion Street', 'New Delhi, India 110001']
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+91 98765 43210', '+91 98765 43211']
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: ['support@nrcreation.com', 'info@nrcreation.com']
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: ['Monday - Saturday: 10:00 AM - 8:00 PM', 'Sunday: Closed']
        }
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: ''
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you. Fill out the form
                        below and our team will get back to you as soon as possible.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        {contactInfo.map((info) => {
                            const Icon = info.icon
                            return (
                                <div
                                    key={info.title}
                                    className="bg-white p-6 rounded-lg shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-full bg-[#871845] bg-opacity-10">
                                            <Icon className="w-5 h-5 text-[#871845]" />
                                        </div>
                                        <h3 className="font-semibold">{info.title}</h3>
                                    </div>
                                    <div className="space-y-1">
                                        {info.details.map((detail) => (
                                            <p key={detail} className="text-gray-600">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <Input
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <Input
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <textarea
                                    name="message"
                                    rows={6}
                                    placeholder="Your Message"
                                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#871845]"
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-[#871845] hover:bg-[#611031]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : null}
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                >
                    <div className="bg-gray-200 rounded-lg h-[400px] flex items-center justify-center">
                        <p className="text-gray-500">Map will be integrated here</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ContactPage 