import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductCard from "../components/ReusableComponents/ProductCard";
import { mensProducts, womensProducts } from "../data/products";
import { SkeletonLoader, EmptyState } from "@/components/ReusableComponents";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlice";

const ProductListingPage = () => {
  const { category } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  // const [products, setProducts] = useState([])
  const [showFilters, setShowFilters] = useState(false);
  const { products, loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  console.log("products : ", products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <SkeletonLoader className="h-8 w-32" />
          <SkeletonLoader className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <SkeletonLoader className="h-64" />
              <h1></h1> {/* Image */}
              <SkeletonLoader className="h-6 w-3/4" /> {/* Title */}
              <SkeletonLoader className="h-6 w-1/4" /> {/* Price */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // if (products.length === 0) {
  //     return (
  //         <div className="container mx-auto px-4 py-8">
  //             <EmptyState
  //                 title="No Products Found"
  //                 description="Try adjusting your filters or check back later"
  //                 icon={Filter}
  //             />
  //         </div>
  //     )
  // }

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
                  <Filter className="mr-2 h-4 w-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {products.map((product, index) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {product && <ProductCard product={product} />}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Content Component
const FilterContent = () => (
  <>
    <div>
      <h3 className="font-semibold mb-4">Price Range</h3>
      <Slider defaultValue={[0, 1000]} max={1000} step={1} className="mb-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>$0</span>
        <span>$1000</span>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Categories</h3>
      <div className="space-y-2">
        {["All", "New Arrivals", "Trending", "Sale"].map((item) => (
          <Button key={item} variant="ghost" className="w-full justify-start">
            {item}
          </Button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
          <Button key={size} variant="outline" size="sm">
            {size}
          </Button>
        ))}
      </div>
    </div>
  </>
);

export default ProductListingPage;
