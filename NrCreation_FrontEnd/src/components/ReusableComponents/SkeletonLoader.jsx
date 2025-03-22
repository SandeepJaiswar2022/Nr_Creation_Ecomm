const SkeletonLoader = ({ count = 1, className = '' }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
                />
            ))}
        </div>
    )
}

export default SkeletonLoader 