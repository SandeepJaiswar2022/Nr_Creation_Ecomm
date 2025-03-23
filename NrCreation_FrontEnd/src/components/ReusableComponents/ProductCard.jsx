import { Star } from 'lucide-react'

const ProductCard = ({ product }) => {
    const { productName, rating, price, image } = product

    return (
        <div className="cursor-pointer border-2 p-2 h-[38rem] w-full ">
            <div className="aspect-square h-[32rem] w-full overflow-hidden bg-muted relative">
                <img
                    src={image}
                    alt={productName}
                    className="w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-foreground/80 group-hover:text-[#871845] transition-colors duration-300">{productName}</h3>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[1rem] font-medium">₹</span>
                    <span className="text-[1rem] font-medium">{price}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${star <= rating ? 'fill-[#871845] text-[#871845]' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductCard
