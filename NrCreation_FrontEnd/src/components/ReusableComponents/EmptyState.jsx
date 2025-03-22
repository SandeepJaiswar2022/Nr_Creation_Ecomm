import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const EmptyState = ({ icon: Icon, title, description }) => {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
                {Icon && (
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {description && (
                    <p className="text-gray-600">{description}</p>
                )}
            </div>
        </div>
    )
}

export default EmptyState 