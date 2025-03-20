import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="min-h-screen px-4 text-center">
                    {/* This element centers the modal */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-lg`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="hover:bg-gray-100 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6">{children}</div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    )
}

export default Modal 