import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Truck, Gift, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePageNew = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user?.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [user, navigate]);

    // prevent flash on initial load
    if (user && user?.role === 'ADMIN') {
        return null;
    }

    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero section images
    const heroImages = [
        'https://images.pexels.com/photos/2781813/pexels-photo-2781813.jpeg',
        'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg',
        'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg',
        'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg',
    ];

    // Auto-slide for hero section
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [heroImages.length]);

    // Sample data
    const collections = [
        { name: 'Banarasi Silk', image: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg', description: 'Timeless elegance with intricate weaves' },
        { name: 'Chiffon Bliss', image: 'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg', description: 'Light, flowy, and perfect for any occasion' },
        { name: 'Embroidered Elegance', image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg', description: 'Custom embroidery with a personal touch' },
        { name: 'Phulkari Charm', image: 'https://images.pexels.com/photos/2781814/pexels-photo-2781814.jpeg', description: 'Vibrant and traditional craftsmanship' },
    ];

    const offers = [
        { title: 'Festive Sale', discount: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1618376930632-4d34dd214c7a' },
        { title: 'Buy 2 Get 1 Free', discount: 'Limited Time', image: 'https://images.unsplash.com/photo-1618376930632-4d34dd214c7b' },
        { title: 'Monsoon Special', discount: '20% Off', image: 'https://images.unsplash.com/photo-1618376930632-4d34dd214c7c' },
        { title: 'Wedding Collection', discount: 'Flat 25% Off', image: 'https://images.unsplash.com/photo-1618376930632-4d34dd214c7d' },
    ];

    const newArrivals = [
        {
            name: 'Floral Phulkari',
            image: 'https://images.unsplash.com/photo-1606170043606-2f027e1c20f7',
            price: 1299,
            description: 'Bright and vibrant for festive occasions',
        },
        {
            name: 'Zari Border',
            image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b',
            price: 1999,
            description: 'Elegant gold zari for timeless style',
        },
        {
            name: 'Personalized Name',
            image: 'https://images.unsplash.com/photo-1607349913338-fc1f00a37d25',
            price: 1599,
            description: 'Customized with your personal touch',
        },
        {
            name: 'Silk Elegance',
            image: 'https://images.unsplash.com/photo-1611080626844-07b6a8118b71',
            price: 1799,
            description: 'Luxurious silk for special moments',
        },
    ];

    const instagramPosts = [
        'https://images.pexels.com/photos/2781819/pexels-photo-2781819.jpeg',
        'https://images.pexels.com/photos/2781820/pexels-photo-2781820.jpeg',
        'https://images.pexels.com/photos/2781821/pexels-photo-2781821.jpeg',
        'https://images.pexels.com/photos/2781822/pexels-photo-2781822.jpeg',
    ];

    const testimonials = [
        {
            name: 'Priya S.',
            text: 'The personalized dupatta was stunning! Perfect for my sister’s wedding.',
            image: 'https://images.pexels.com/photos/415263/pexels-photo-415263.jpeg',
            date: 'July 10, 2025',
            rating: 5,
        },
        {
            name: 'Anjali R.',
            text: 'Unmatched quality and craftsmanship. I’m a repeat customer!',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
            date: 'June 28, 2025',
            rating: 4,
        },
        {
            name: 'Meera K.',
            text: 'Fast shipping and beautiful packaging. Love my Banarasi dupatta!',
            image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
            date: 'July 15, 2025',
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
            {/* Hero Section with Infinite Sliding Carousel */}
            <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full overflow-hidden">
                <div className="relative w-full h-full">
                    {heroImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Hero Slide ${index + 1}`}
                            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#871845]/20 via-[#871845]/50 to-[#871845]/20 flex flex-col items-center justify-center text-center text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in">
                        Wrap Yourself in Elegance
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl mb-6 max-w-md sm:max-w-lg md:max-w-2xl">
                        Handpicked ethnic dupattas crafted for every occasion
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-[#871845] hover:bg-[#6b1336] text-white px-6 py-5  hover:scale-105 duration-500 transition-all rounded-full text-base sm:text-lg">
                            Shop Now
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white hover:scale-105 hover:text-[#871845]  duration-500 transition-all bg-white text-[#871845] px-6 py-5 rounded-full sm:text-lg"
                        >
                            Explore Collection →
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-10">
                    Featured Collections
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {collections.map((collection, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <img
                                    src={collection.image}
                                    alt={collection.name}
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg"
                                />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-lg sm:text-xl font-semibold text-[#871845]">{collection.name}</CardTitle>
                                <p className="text-gray-600 text-sm mt-2">{collection.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" className="text-[#871845] text-sm">Shop Now</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Button className="bg-[#871845] hover:bg-[#6b1336] text-white">See More</Button>
                </div>
            </section>

            {/* Limited-Time Offers */}
            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-l from-rose-100/5 to-rose-50/5 border-y border-rose-200">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-8">
                    Limited-Time Offers
                </h2>
                <div className="relative max-w-6xl mx-auto">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4">
                        {offers.map((offer, index) => (
                            <div
                                key={index}
                                className="snap-start flex-shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[22%] rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full h-36 sm:h-44 object-cover"
                                />
                                <div className="p-4 text-center">
                                    <h3 className="text-base sm:text-lg font-semibold text-[#871845]">{offer.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{offer.discount}</p>
                                    <Button
                                        className="mt-3 bg-[#871845] hover:bg-[#6b1336] text-white text-xs sm:text-sm px-4 py-2 rounded-full"
                                    >
                                        Grab Offer
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#871845] text-white p-2 rounded-full hover:bg-[#6b1336] sm:flex hidden"
                        onClick={() => document.querySelector('.scrollbar-hide').scrollBy({ left: -300, behavior: 'smooth' })}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#871845] text-white p-2 rounded-full hover:bg-[#6b1336] sm:flex hidden"
                        onClick={() => document.querySelector('.scrollbar-hide').scrollBy({ left: 300, behavior: 'smooth' })}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-8">
                    New Arrivals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {newArrivals.map((item, index) => (
                        <div
                            key={index}
                            className="group relative w-full h-64 sm:h-80 perspective-1000"
                        >
                            <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                                {/* Front Face */}
                                <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#871845]/70 text-white text-center py-2">
                                        <h3 className="text-base sm:text-lg font-semibold">{item.name}</h3>
                                    </div>
                                </div>
                                {/* Back Face */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#871845] text-white rounded-lg flex flex-col items-center justify-center p-4">
                                    <h3 className="text-base sm:text-lg font-semibold mb-2">{item.name}</h3>
                                    <p className="text-sm">₹{item.price}</p>
                                    <p className="text-xs text-center mt-1">{item.description}</p>
                                    <Button
                                        variant="link"
                                        className="text-rose-100 hover:text-white mt-3 text-sm"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Button className="bg-[#871845] hover:bg-[#6b1336] text-white text-sm sm:text-base px-6 py-2 rounded-full">
                        Load More
                    </Button>
                </div>
                <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
            </section>
            {/* Instagram Gallery */}
            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-l from-rose-100/5 to-rose-50/5 border-y border-rose-200">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-10">
                    Our Instagram Looks
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {instagramPosts.map((post, index) => (
                        <div key={index} className="relative overflow-hidden rounded-md">
                            <img
                                src={post}
                                alt={`Instagram Post ${index + 1}`}
                                className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                <Heart className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Button
                        variant="outline"
                        className="border-[#871845] text-[#871845] hover:bg-[#871845] hover:text-white"
                    >
                        Follow Us on Instagram
                    </Button>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-10">
                    Why Choose Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="text-center">
                        <Star className="w-10 h-10 text-[#871845] mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-[#871845]">Premium Quality</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Handcrafted dupattas made with love and care, ensuring top-notch quality.
                        </p>
                    </div>
                    <div className="text-center">
                        <Truck className="w-10 h-10 text-[#871845] mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-[#871845]">Fast Shipping</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Quick and reliable delivery to bring your dupatta to you in no time.
                        </p>
                    </div>
                    <div className="text-center">
                        <Gift className="w-10 h-10 text-[#871845] mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-[#871845]">Personalization</h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Add a personal touch with custom name printing and size variations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-l from-rose-100/5 to-rose-50/5 border-y border-rose-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#871845] mb-6">
                        Our Story
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        From a small shop weaving dreams into fabric, we bring you the finest collection of dupattas that blend tradition with modern aesthetics. Our journey began with a passion for celebrating Indian craftsmanship, and now we’re taking it online to wrap the world in elegance. Follow us on Instagram to see our latest creations and join our community of dupatta lovers.
                    </p>
                    <Button className="mt-6 bg-[#871845] hover:bg-[#6b1336] text-white">Learn More</Button>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center text-[#871845] mb-10">
                    What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="border-none shadow-md">
                            <CardHeader className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <CardTitle className="text-lg font-semibold text-[#871845]">{testimonial.name}</CardTitle>
                                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-1 mb-2">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-[#871845] fill-[#871845]" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePageNew;