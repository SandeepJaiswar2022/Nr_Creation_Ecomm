import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import LoadingSpinner from '@/components/ReusableComponents/LoadingSpinner'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm"
            >
                <div>
                    <h2 className="text-center text-3xl font-bold">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-1 text-[#871845] hover:text-[#611031] font-medium"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="First Name" disabled={isLoading} />
                            <Input placeholder="Last Name" disabled={isLoading} />
                        </div>
                    )}
                    <Input type="email" placeholder="Email address" disabled={isLoading} />
                    <Input type="password" placeholder="Password" disabled={isLoading} />
                    {!isLogin && <Input type="password" placeholder="Confirm Password" disabled={isLoading} />}

                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded text-[#871845]" disabled={isLoading} />
                                <span className="text-sm">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#871845] hover:text-[#611031]"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-[#871845] hover:bg-[#611031]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                        ) : null}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" disabled={isLoading}>
                            Google
                        </Button>
                        <Button variant="outline" className="w-full" disabled={isLoading}>
                            Facebook
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AuthPage 