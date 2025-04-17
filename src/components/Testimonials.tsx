
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    testimonial: "I was stranded on the highway with a flat tire. SwiftAssist arrived in just 20 minutes and got me back on the road quickly. Amazing service!",
    service: "Flat Tire Repair"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    testimonial: "Battery died in a parking lot late at night. Their technician was professional, fast, and got my car started in minutes. Would definitely recommend!",
    service: "Battery Jumpstart"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    rating: 4,
    testimonial: "Locked my keys in the car with my toddler's car seat inside. The technician arrived quickly and helped me get back in without any damage. Very grateful!",
    service: "Lockout Assistance"
  },
  {
    id: 4,
    name: "David Williams",
    location: "Houston, TX",
    rating: 5,
    testimonial: "My car broke down miles from home. The towing service was prompt and the driver was incredibly helpful. They took great care of my vehicle.",
    service: "Towing Services"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Don't just take our word for it - hear from some of our satisfied customers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                
                <div className="bg-red-50 text-red-800 text-sm px-3 py-1 rounded-full w-fit mb-4">
                  {testimonial.service}
                </div>
                
                <p className="text-gray-700 flex-grow mb-4 italic">
                  "{testimonial.testimonial}"
                </p>
                
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
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
