import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'

const Toast = ({ type = 'success', message, duration = 3000, onClose }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose?.()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    const icons = {
        success: CheckCircle2,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    }

    const colors = {
        success: 'bg-green-50 text-green-600 border-green-200',
        error: 'bg-red-50 text-red-600 border-red-200',
        warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        info: 'bg-blue-50 text-blue-600 border-blue-200'
    }

    const Icon = icons[type]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg border ${colors[type]}`}
            >
                <Icon className="w-5 h-5 mr-3" />
                <p className="text-sm font-medium">{message}</p>
                <button
                    onClick={() => onClose?.()}
                    className="ml-4 p-1 hover:opacity-75"
                >
                    <XCircle className="w-4 h-4" />
                </button>
            </motion.div>
        </AnimatePresence>
    )
}

export default Toast 