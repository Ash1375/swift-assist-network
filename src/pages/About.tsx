import { Shield, Clock, CheckSquare, MapPin, User, Users, Car, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-red-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-center">About Us</h1>
          <p className="text-xl text-center mt-4 max-w-3xl mx-auto">
            Providing reliable roadside assistance and vehicle repair services since 2010.
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              At SwiftAssist, our mission is to provide fast, reliable, and professional roadside assistance when you need it most. We understand that vehicle breakdowns are stressful and can happen at the most inconvenient times.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              That's why we're committed to offering 24/7 emergency services with quick response times and fair pricing. Our goal is to get you back on the road safely and minimize the disruption to your day.
            </p>
            <p className="text-lg text-gray-700">
              With a network of skilled technicians and modern equipment, we tackle everything from flat tires to complex mechanical issues with the same level of professionalism and care.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Reliable</h3>
                <p className="text-gray-600">Count on us when you need help</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Fast</h3>
                <p className="text-gray-600">Quick response times</p>
              </div>
              <div className="text-center">
                <CheckSquare className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Professional</h3>
                <p className="text-gray-600">Skilled technicians</p>
              </div>
              <div className="text-center">
                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-xl">Everywhere</h3>
                <p className="text-gray-600">Wide service coverage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Company Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <User className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">50,000+</p>
              <p className="text-gray-600">Satisfied Customers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <Users className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">200+</p>
              <p className="text-gray-600">Expert Technicians</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <Car className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">100,000+</p>
              <p className="text-gray-600">Services Completed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <Award className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">15+</p>
              <p className="text-gray-600">Years of Experience</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              I'm Arokiya Aswanth A, currently pursuing my B.Tech in Information Technology. The inspiration behind this website came from a personal experience in 2025, when I found myself stranded in the middle of nowhere due to a flat tire—with no repair shops nearby and no one to turn to for help.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              That moment sparked an idea: a simple yet powerful solution to connect travelers in need with nearby technicians. With the support of a group of friends, we brought this vision to life—creating an ecosystem designed to assist people who face unexpected breakdowns while on the road.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our mission is to ensure that no one has to feel helpless during such moments by bridging the gap between those in need and those who can help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
