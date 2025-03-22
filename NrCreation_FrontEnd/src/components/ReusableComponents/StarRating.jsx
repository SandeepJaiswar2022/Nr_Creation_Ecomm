import { Star, StarHalf } from 'lucide-react'

const StarRating = ({ rating, size = 'md', showCount = false, interactive = false, onRatingChange }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    const handleStarClick = (index) => {
        if (!interactive || !onRatingChange) return
        onRatingChange(index + 1)
    }

    const handleStarHover = (index) => {
        if (!interactive) return
        // Add hover effect logic here if needed
    }

    const starSize = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }[size]

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {[...Array(fullStars)].map((_, index) => (
                    <Star
                        key={`full-${index}`}
                        className={`${starSize} text-[#871845] fill-current ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
                            }`}
                        onClick={() => handleStarClick(index)}
                        onMouseEnter={() => handleStarHover(index)}
                    />
                ))}
                {hasHalfStar && (
                    <StarHalf
                        className={`${starSize} text-[#871845] fill-current ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
                            }`}
                        onClick={() => handleStarClick(fullStars)}
                        onMouseEnter={() => handleStarHover(fullStars)}
                    />
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <Star
                        key={`empty-${index}`}
                        className={`${starSize} text-gray-300 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
                            }`}
                        onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + index)}
                        onMouseEnter={() => handleStarHover(fullStars + (hasHalfStar ? 1 : 0) + index)}
                    />
                ))}
            </div>
            {showCount && (
                <span className="ml-2 text-sm text-gray-600">
                    ({rating.toFixed(1)})
                </span>
            )}
        </div>
    )
}

export default StarRating 