import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Tag, TrendingUp, Star, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ReusableComponents/ProductCard";
import { featuredProducts } from "@/data/products";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "@/store/slices/cartSlice";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070&auto=format&fit=crop",
    title: "Discover Your Style",
    subtitle: "Explore our latest collection of trendy fashion for men and women.",
    cta: "Shop Now",
    link: "/men",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    title: "Summer Collection",
    subtitle: "Stay cool and stylish with our new summer arrivals.",
    cta: "View Collection",
    link: "/women",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    title: "Limited Time Offer",
    subtitle: "Get up to 50% off on selected items.",
    cta: "Shop Sale",
    link: "/men",
  },
];

const offerCards = [
  {
    icon: <Tag className="h-6 w-6" />,
    title: "Bridal Collection",
    description: "Exclusive bridal dupattas starting at ₹2999",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Festive Special",
    description: "Limited edition festive dupattas",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Summer Collection",
    description: "Light and breezy summer dupattas",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
  },
];

const categoryGrid = [
  {
    title: "Bridal Dupattas",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
    link: "/category/bridal",
  },
  {
    title: "Silk Dupattas",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    link: "/category/silk",
  },
  {
    title: "Cotton Dupattas",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop",
    link: "/category/cotton",
  },
  {
    title: "Designer Dupattas",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    link: "/category/designer",
  },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const dispatch = useDispatch();


  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentSlide(
      (prev) => (prev + newDirection + slides.length) % slides.length
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 1 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="container relative z-10 mx-auto px-4 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl text-white"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  {slides[currentSlide].subtitle}
                </p>
                <Button size="lg" asChild>
                  <Link to={slides[currentSlide].link}>
                    {slides[currentSlide].cta}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="container mx-auto px-4">
        {/* Offer Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offerCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg ${card.bgColor} ${card.textColor} flex items-center gap-4 relative overflow-hidden`}
            >
              <div className="absolute right-0 bottom-0 w-32 h-32">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="rounded-full z-10">
                {card.icon}
              </div>
              <div className="z-10">
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-sm">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Category Grid Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryGrid.map((category, index) => (
              <Link to={category.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative h-80 rounded-lg overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <Button
                      variant="outline"
                      className=" border-white text-black hover:bg-white  transition-colors duration-300"
                    >
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fashion Banner */}
        <section className="mb-12">
          <div className="relative h-[300px] rounded-lg overflow-hidden bg-[#F5F5DC]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-1/2 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop your fashion needs</h2>
                <p className="text-gray-600 mb-6">with Latest & Trendy Choices</p>
                <Button className="bg-gray-800 hover:bg-gray-700">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="w-1/2 h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                  alt="Fashion Banner"
                  className="absolute right-0 h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
            <div className="flex justify-center items-center gap-2">
              <div className="h-1 w-20 bg-[#871845] rounded-full"></div>
              <div className="h-1 w-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
            {featuredProducts.map((product, index) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.imageUrls?.[0]}
                      alt={product.productName}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button className="w-full bg-white text-black hover:bg-gray-100">
                        Quick View
                      </Button>
                    </div>
                    {product.discount && (
                      <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-sm text-white">
                        {product.discount}% OFF
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1.5 text-sm text-white">
                        New
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.productName}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-[#871845] fill-[#871845]" />
                        <span className="ml-1 text-sm text-gray-500">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#871845]">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/category/dupattas">
              <Button variant="outline" size="lg" className="border-[#871845] text-[#871845] hover:bg-[#871845] hover:text-white">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="mb-12">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="relative z-10 h-full flex items-center px-8">
              <div className="max-w-xl text-white">
                <h2 className="text-4xl font-bold mb-4">Special Summer Sale</h2>
                <p className="text-xl mb-6">
                  Get up to 60% off on summer collection. Limited time offer!
                </p>
                <Button size="lg" asChild>
                  <Link to="/sale">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
