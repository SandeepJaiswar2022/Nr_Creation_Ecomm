import { Component } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <Button
                            onClick={this.handleRetry}
                            className="bg-[#871845] hover:bg-[#611031]"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary 