import LoadingSpinner from './LoadingSpinner'

const PageLoader = ({ message = `Loading...` }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    )
}

export default PageLoader 