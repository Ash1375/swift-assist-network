
import { StarIcon, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    testimonial: "I was stranded on the highway with a flat tire. SwiftAssist arrived in just 20 minutes and got me back on the road quickly. Amazing service!",
    service: "Flat Tire Repair",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "bg-gradient-to-r from-red-500 to-red-600"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    testimonial: "Battery died in a parking lot late at night. Their technician was professional, fast, and got my car started in minutes. Would definitely recommend!",
    service: "Battery Jumpstart",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    rating: 4,
    testimonial: "Locked my keys in the car with my toddler's car seat inside. The technician arrived quickly and helped me get back in without any damage. Very grateful!",
    service: "Lockout Assistance",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    color: "bg-gradient-to-r from-green-500 to-green-600"
  },
  {
    id: 4,
    name: "David Williams",
    location: "Houston, TX",
    rating: 5,
    testimonial: "My car broke down miles from home. The towing service was prompt and the driver was incredibly helpful. They took great care of my vehicle.",
    service: "Towing Services",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-700">
            What Our Customers Say
          </span>
        </h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Don't just take our word for it - hear from some of our satisfied customers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all service-card"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className={`h-2 ${testimonial.color}`}></div>
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className={`text-white text-sm px-3 py-1 rounded-full w-fit mb-4 ${testimonial.color}`}>
                    {testimonial.service}
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-1 -left-1 h-6 w-6 text-gray-200 transform -scale-x-100" />
                    <p className="text-gray-700 pl-5 flex-grow mb-4 italic">
                      "{testimonial.testimonial}"
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center">
                    <div className={`relative w-12 h-12 rounded-full overflow-hidden border-2 ${activeIndex === index ? 'border-red-500 scale-110' : 'border-transparent'} transition-all duration-300`}>
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
