import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Supabase testimonial images URLs - using the actual working URLs
const testimonialImages = [
  'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/testimonialpics/IMG_1850.JPEG',
  'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/testimonialpics/IMG_2027.JPEG',
  'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/testimonialpics/IMG_2034.JPEG',
  'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/testimonialpics/IMG_2920.JPEG',
  'https://qivobmyugolhzrimfuht.supabase.co/storage/v1/object/public/product%20images/testimonialpics/IMG_5570.JPEG',
];

const testimonials = [
  {
    name: "Sarah & Mike Thompson",
    location: "North Shore, Auckland",
    rating: 5,
    text: "Outstanding service! TotalCare installed our heat pump system and the difference is incredible. Professional, punctual, and the quality of work is exceptional.",
    project: "Heat Pump Installation"
  },
  {
    name: "David Chen",
    location: "East Auckland",
    rating: 5,
    text: "Best electrical work in Auckland! They installed our EV charger and did a fantastic job. Clean, efficient, and reasonably priced. Highly recommend!",
    project: "EV Charger Installation"
  },
  {
    name: "Lisa & James Wilson",
    location: "West Auckland",
    rating: 5,
    text: "From consultation to completion, TotalCare exceeded our expectations. Their attention to detail and customer service is second to none.",
    project: "Complete Electrical Renovation"
  },
  {
    name: "Robert Martinez",
    location: "Central Auckland",
    rating: 5,
    text: "Professional, reliable, and honest. They fixed our electrical issues quickly and explained everything clearly. Will definitely use them again.",
    project: "Electrical Repairs"
  },
  {
    name: "Emma & Tom Brown",
    location: "South Auckland",
    rating: 5,
    text: "Amazing work on our new home electrical setup. The team was knowledgeable, friendly, and completed everything on time and within budget.",
    project: "New Home Electrical"
  }
];

export function TestimonialSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(testimonialImages.length).fill(false));

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];
  const currentImage = testimonialImages[currentIndex % testimonialImages.length];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it - see what our satisfied customers have to say about our work.
          </p>
        </div>

        <div className="relative">
          {/* Main Testimonial Card */}
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-80 lg:h-96">
                  <img
                    src={currentImage}
                    alt={`Testimonial from ${currentTestimonial.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load testimonial image:', currentImage);
                      // Fallback to a professional electrical work placeholder
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2Zz4K';
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded testimonial image:', currentImage);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">{currentTestimonial.project}</p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                      "{currentTestimonial.text}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {currentTestimonial.name}
                      </p>
                      <p className="text-muted-foreground">
                        {currentTestimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isAutoPlaying ? 'Pause' : 'Play'} slideshow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
