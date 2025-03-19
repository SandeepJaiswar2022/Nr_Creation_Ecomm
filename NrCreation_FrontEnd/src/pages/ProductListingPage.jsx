import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { SlidersHorizontal } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ProductCard from '../components/ReusableComponents/ProductCard'
import { mensProducts, womensProducts } from '../data/products'

const ProductListingPage = () => {
    const { category } = useParams()
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="container py-10  mx-auto px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold capitalize mb-4">
                    {category} Collection
                </h1>
                <p className="text-muted-foreground">
                    Discover our latest {category}'s fashion collection
                </p>
            </motion.div>

            {/* Filters and Products Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Section */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    {/* Filter Toggle - Show on md and below */}
                    <div className="lg:hidden">
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-8 space-y-6">
                                    <FilterContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:block sticky top-24">
                        <div className="space-y-6 p-4 border rounded-lg bg-card">
                            <FilterContent />
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="flex-1">
                    {/* Sort */}
                    <div className="flex justify-end mb-6">
                        <Select defaultValue="featured">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product Grid */}
                    {category === 'men' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mensProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {womensProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>)}
                </div>
            </div>
        </div>
    )
}

// Filter Content Component
const FilterContent = () => (
    <>
        <div>
            <h3 className="font-semibold mb-4">Price Range</h3>
            <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={1}
                className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$1000</span>
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
                {['All', 'New Arrivals', 'Trending', 'Sale'].map(
                    (item) => (
                        <Button
                            key={item}
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            {item}
                        </Button>
                    )
                )}
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-4">Size</h3>
            <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <Button key={size} variant="outline" size="sm">
                        {size}
                    </Button>
                ))}
            </div>
        </div>
    </>
)

export default ProductListingPage 