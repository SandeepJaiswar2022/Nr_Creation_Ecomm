import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Truck } from 'lucide-react'
import Breadcrumbs from '@/components/ReusableComponents/Breadcrumbs'

const AboutPage = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' }
    ]

    const features = [
        {
            icon: ShoppingBag,
            title: 'Quality Products',
            description: 'Curated selection of premium fashion items'
        },
        {
            icon: Truck,
            title: 'Fast Delivery',
            description: 'Quick and reliable shipping nationwide'
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Dedicated support for the best experience'
        }
    ]

    const teamMembers = [
        {
            name: 'John Doe',
            role: 'Founder & CEO',
            image: 'https://source.unsplash.com/200x200/?portrait&1'
        },
        {
            name: 'Jane Smith',
            role: 'Creative Director',
            image: 'https://source.unsplash.com/200x200/?portrait&2'
        },
        {
            name: 'Mike Johnson',
            role: 'Head of Design',
            image: 'https://source.unsplash.com/200x200/?portrait&3'
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-4xl font-bold mb-4">Our Story</h1>
                <p className="text-gray-600 leading-relaxed">
                    NR Creation started with a simple idea: to bring high-quality, fashionable clothing
                    to everyone. Since our founding in 2020, we've grown from a small startup to a
                    beloved fashion brand, all while maintaining our commitment to quality,
                    sustainability, and customer satisfaction.
                </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center p-6 bg-white rounded-lg shadow-sm"
                        >
                            <div className="inline-flex p-3 rounded-full bg-[#871845] bg-opacity-10 mb-4">
                                <Icon className="w-6 h-6 text-[#871845]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To provide our customers with the finest quality fashion that empowers them to
                        express their unique style while maintaining sustainable and ethical practices
                        throughout our supply chain.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                >
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To become the most trusted and loved fashion brand, known for our commitment to
                        quality, innovation, and customer satisfaction, while leading the industry in
                        sustainable practices.
                    </p>
                </motion.div>
            </div>

            {/* Team Section */}
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-lg shadow-sm"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AboutPage 