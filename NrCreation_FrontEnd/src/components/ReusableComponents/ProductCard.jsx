import { Star } from 'lucide-react'
import { Button } from '../ui/button'

const ProductCard = ({ product }) => {
    const { name, rating = 4, price, imageUrls } = product
    const productName = name?.length > 30 ? `${name?.slice(0, 30)}...` : name

    return (
        <div className="cursor-pointer group p-2 h-[32rem] max-sm:h-[30rem] w-full">
            <div className="aspect-square h-[22rem] max-sm:h-[28rem] w-full overflow-hidden bg-muted relative">
                <img
                    src={imageUrls?.[0] || "/fallback.jpg"}
                    alt={productName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="text-center mt-2">
                <h3 className="font-semibold text-sm text-foreground/80 group-hover:text-[#871845] transition-colors duration-300">{productName}</h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-sm font-medium">₹</span>
                    <span className="text-sm font-medium">{price}</span>
                </div>
                {/* <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-3 w-3 ${star <= rating ? 'fill-[#871845] text-[#871845]' : 'text-gray-300'}`}
                        />
                    ))}
                </div> */}
            </div>
            <div>
                <Button className="w-full rounded-none mt-2 text-[#871845] bg-white group-hover:bg-[#871845] group-hover:text-white transition-colors duration-500">
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}

export default ProductCard
