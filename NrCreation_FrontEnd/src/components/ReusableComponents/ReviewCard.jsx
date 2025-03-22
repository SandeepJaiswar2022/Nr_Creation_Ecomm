import { motion } from 'framer-motion'
import { format } from 'date-fns'
import StarRating from './StarRating'

const ReviewCard = ({ review }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <p className="text-sm text-gray-500">
                        {format(new Date(review.date), 'MMMM d, yyyy')}
                    </p>
                </div>
                <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-20 h-28 object-cover rounded-md"
                        />
                    ))}
                </div>
            )}
        </motion.div>
    )
}

export default ReviewCard 