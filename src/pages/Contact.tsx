
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In a real app, you would send the form data to your backend
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you shortly.",
    });
    
    // Clear form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <div className="bg-red-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Contact Us</h1>
          <p className="text-xl text-center mt-4 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help 24/7.
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-700 mb-8">
              Whether you have questions about our services, need technical support, or want to provide feedback, our team is ready to assist you. Fill out the form, and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Your email address" required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this regarding?" required />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help you?" 
                  className="min-h-[150px]"
                  required 
                />
              </div>
              
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Send Message
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold">Main Office</h3>
                    <p className="text-gray-700">123 Road Assistance St, City, State 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-red-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-700">General: +1 (555) 123-4567</p>
                    <p className="text-gray-700">Emergency: +1 (555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-red-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-700">info@swiftassist.com</p>
                    <p className="text-gray-700">support@swiftassist.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-red-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-gray-700">Emergency Services: 24/7</p>
                    <p className="text-gray-700">Office Hours: Monday-Friday, 9am-6pm</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Service Areas</h3>
            <p className="text-gray-700 mb-4">
              We provide roadside assistance services in the following areas:
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">New York City</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">Los Angeles</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">Chicago</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">Houston</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">Phoenix</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">Philadelphia</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">San Antonio</div>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm">San Diego</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
