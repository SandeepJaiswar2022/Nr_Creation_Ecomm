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
import { Filter, SlidersHorizontal } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const { products, loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

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
              <SkeletonLoader className="h-6 w-3/4" />
              <SkeletonLoader className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto px-4">
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

      {/* Filters and Sort Bar */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 py-4 border-b">
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 hover:text-[#871845] hover:border-[#871845]">
              <SlidersHorizontal className="h-4 w-4 bg-red-200" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[20rem] px-4 flex flex-col">
            <div className="flex-1 overflow-y-auto mt-10">
              <FilterContent priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
            <div className="mt-auto border-t ">
              <Button className="w-full bg-[#871845] hover:bg-[#671234]">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Select defaultValue="featured">
          <SelectTrigger className="w-[180px] border-[#871845] text-[#871845]">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {products && products.length > 0 ? (
          products.map((product, index) =>
            product.id ? (
              <Link to={`/product/${product?.id}`} key={product?.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </Link>
            ) : (
              <div key={index} className="text-red-500">
                Product ID missing
              </div>
            )
          )
        ) : (
          <div className="text-center text-gray-500">
            No products available.
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Content Component
const FilterContent = ({ priceRange, setPriceRange }) => (
  <div className="space-y-8 px-2">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>

    <div>
      <h3 className="font-semibold mb-4">Price Range</h3>
      <Slider
        defaultValue={priceRange}
        max={5000}
        step={100}
        className="mb-2"
        onValueChange={setPriceRange}
      />
      <div className="flex justify-between text-sm text-[#871845]">
        <span>₹{priceRange[0]}</span>
        <span>₹{priceRange[1]}</span>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Categories</h3>
      <div className="space-y-2">
        {["All", "Bridal", "Silk", "Cotton", "Designer"].map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="w-full justify-start hover:text-[#871845] hover:bg-pink-50"
          >
            {item}
          </Button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Colors</h3>
      <div className="grid grid-cols-3 gap-2">
        {["Red", "Blue", "Green", "Pink", "Purple", "Yellow", "Orange", "Black", "White"].map((color) => (
          <Button
            key={color}
            variant="outline"
            size="sm"
            className="hover:text-[#871845] hover:border-[#871845]"
          >
            {color}
          </Button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-4">Material</h3>
      <div className="space-y-2">
        {["Silk", "Cotton", "Chiffon", "Net", "Georgette", "Crepe", "Chanderi", "Banarasi"].map((material) => (
          <Button
            key={material}
            variant="ghost"
            className="w-full justify-start hover:text-[#871845] hover:bg-pink-50"
          >
            {material}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default ProductListingPage;
