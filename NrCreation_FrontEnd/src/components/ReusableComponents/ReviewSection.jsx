import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import StarRating from './StarRating'
import ReviewCard from './ReviewCard'
import { Star, ThumbsUp, MessageSquare, Image as ImageIcon } from 'lucide-react'

const ReviewSection = ({ reviews, averageRating, totalReviews }) => {
    const [ratingFilter, setRatingFilter] = useState('all')
    const [sortBy, setSortBy] = useState('recent')
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: '',
        images: []
    })

    const filteredReviews = reviews
        .filter(review => ratingFilter === 'all' || review.rating === parseInt(ratingFilter))
        .sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.date) - new Date(a.date)
            } else if (sortBy === 'highest') {
                return b.rating - a.rating
            } else {
                return a.rating - b.rating
            }
        })

    const handleSubmitReview = (e) => {
        e.preventDefault()
        // Handle review submission
        setShowReviewForm(false)
        setNewReview({ rating: 0, comment: '', images: [] })
    }

    return (
        <div className="space-y-8">
            {/* Review Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-[#871845]" />
                        <h3 className="font-semibold">Average Rating</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <StarRating rating={averageRating} size="lg" />
                        <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-5 h-5 text-[#871845]" />
                        <h3 className="font-semibold">Total Reviews</h3>
                    </div>
                    <p className="text-2xl font-bold">{totalReviews}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-[#871845]" />
                        <h3 className="font-semibold">Review Distribution</h3>
                    </div>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter(r => r.rating === rating).length
                            const percentage = (count / totalReviews) * 100
                            return (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="w-4">{rating}</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#871845]"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Review Filters */}
            <div className="flex flex-wrap gap-4">
                <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
                <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-[#871845] hover:bg-[#6a1337]"
                >
                    Write a Review
                </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <StarRating
                                rating={newReview.rating}
                                size="lg"
                                interactive
                                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Review</label>
                            <Textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your thoughts about this product..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Photos</label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Add Photos
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" className="bg-[#871845] hover:bg-[#6a1337]">
                                Submit Review
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowReviewForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
            </div>
        </div>
    )
}

export default ReviewSection 