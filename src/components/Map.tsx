import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Fuel, 
  Zap, 
  Wrench, 
  Navigation, 
  Search,
  Filter,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  Shield
} from "lucide-react";

interface ServiceStation {
  id: string;
  name: string;
  type: 'fuel' | 'ev-charging' | 'garage';
  address: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  phone: string;
  latitude: number;
  longitude: number;
  amenities?: string[];
}

const mockServiceStations: ServiceStation[] = [
  {
    id: '1',
    name: 'Shell Petrol Station',
    type: 'fuel',
    address: '123 Main Street, Bangalore',
    distance: 0.8,
    rating: 4.3,
    isOpen: true,
    phone: '+91 98765 43210',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['24/7', 'ATM', 'Convenience Store']
  },
  {
    id: '2',
    name: 'Tata Power EV Station',
    type: 'ev-charging',
    address: '456 Tech Park, Bangalore',
    distance: 1.2,
    rating: 4.5,
    isOpen: true,
    phone: '+91 98765 43211',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['Fast Charging', 'WiFi', 'Cafe']
  },
  {
    id: '3',
    name: 'AutoCare Service Center',
    type: 'garage',
    address: '789 Service Road, Bangalore',
    distance: 2.1,
    rating: 4.2,
    isOpen: false,
    phone: '+91 98765 43212',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['AC Service', 'Oil Change', 'Tire Repair']
  },
  {
    id: '4',
    name: 'HP Petrol Pump',
    type: 'fuel',
    address: '321 Highway Road, Bangalore',
    distance: 1.8,
    rating: 4.1,
    isOpen: true,
    phone: '+91 98765 43213',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['24/7', 'Payment Cards']
  },
  {
    id: '5',
    name: 'Ather Charging Station',
    type: 'ev-charging',
    address: '654 Mall Complex, Bangalore',
    distance: 1.5,
    rating: 4.4,
    isOpen: true,
    phone: '+91 98765 43214',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['Fast Charging', 'Parking', 'Food Court']
  },
  {
    id: '6',
    name: 'QuickFix Garage',
    type: 'garage',
    address: '987 Industrial Area, Bangalore',
    distance: 3.2,
    rating: 4.0,
    isOpen: true,
    phone: '+91 98765 43215',
    latitude: 12.9716,
    longitude: 77.5946,
    amenities: ['Multi-brand', 'Warranty', 'Pickup/Drop']
  }
];

const Map = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fuel' | 'ev-charging' | 'garage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState<ServiceStation[]>(mockServiceStations);
  const [selectedStation, setSelectedStation] = useState<ServiceStation | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to Bangalore coordinates
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  useEffect(() => {
    let filtered = mockServiceStations;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(station => station.type === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStations(filtered);
  }, [selectedFilter, searchQuery]);

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'fuel':
        return <Fuel className="h-5 w-5" />;
      case 'ev-charging':
        return <Zap className="h-5 w-5" />;
      case 'garage':
        return <Wrench className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getStationGradient = (type: string) => {
    switch (type) {
      case 'fuel':
        return 'from-blue-500 to-blue-600';
      case 'ev-charging':
        return 'from-emerald-500 to-emerald-600';
      case 'garage':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const handleConnectVendor = (station: ServiceStation) => {
    console.log('Connecting to vendor through app:', station.name);
    // Here you would navigate to vendor connection page or open connection modal
  };

  const handleBookService = (station: ServiceStation) => {
    console.log('Booking service through app:', station.name);
    // Here you would navigate to booking page
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fuel':
        return 'Fuel Station';
      case 'ev-charging':
        return 'EV Charging';
      case 'garage':
        return 'Garage';
      default:
        return 'Service';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Nearby Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
          Connect with verified vendors through our secure platform
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                placeholder="Search for stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-2 border-border/50 focus:border-primary rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-sm text-xs sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                All
              </Button>
              <Button
                variant={selectedFilter === 'fuel' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('fuel')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-sm text-xs sm:text-sm"
              >
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                Fuel
              </Button>
              <Button
                variant={selectedFilter === 'ev-charging' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('ev-charging')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-sm text-xs sm:text-sm"
              >
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                EV
              </Button>
              <Button
                variant={selectedFilter === 'garage' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('garage')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-sm text-xs sm:text-sm"
              >
                <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
                Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Map View */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px] lg:h-[450px] rounded-xl bg-gradient-to-br from-blue-50 via-emerald-50 to-orange-50 relative overflow-hidden shadow-inner border">
              {/* Enhanced Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-emerald-100/30 to-orange-100/30" />
              
              {/* User Location */}
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full border-2 sm:border-3 border-white shadow-lg" />
                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-6 h-6 sm:w-9 sm:h-9 bg-blue-600/20 rounded-full animate-ping" />
                  </div>
                  <span className="absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-lg border">
                    You are here
                  </span>
                </div>
              )}

              {/* Enhanced Service Stations on Map */}
              {filteredStations.slice(0, 6).map((station, index) => (
                <div
                  key={station.id}
                  className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-125 hover:z-20 ${
                    index === 0 ? 'top-[20%] left-[30%]' :
                    index === 1 ? 'top-[60%] right-[25%]' :
                    index === 2 ? 'bottom-[20%] left-[20%]' :
                    index === 3 ? 'top-[30%] right-[40%]' :
                    index === 4 ? 'bottom-[40%] right-[30%]' :
                    'top-[70%] left-[40%]'
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${getStationGradient(station.type)} rounded-full flex items-center justify-center text-white shadow-lg border-2 sm:border-3 border-white hover:shadow-xl transition-shadow`}>
                    <div className="text-xs sm:text-sm">
                      {getStationIcon(station.type)}
                    </div>
                  </div>
                  {selectedStation?.id === station.id && (
                    <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-xl border min-w-[180px] sm:min-w-[220px] animate-scale-in">
                      <p className="font-semibold text-xs sm:text-sm text-foreground">{station.name}</p>
                      <p className="text-xs text-muted-foreground">{station.distance} km away</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{station.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Enhanced Current Location Button */}
              <Button
                size="sm"
                className="absolute top-2 sm:top-4 right-2 sm:right-4 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border text-foreground hover:bg-white h-8 w-8 sm:h-auto sm:w-auto p-2"
                onClick={() => {
                  console.log('Centering on user location');
                }}
              >
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Station List */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Verified Vendors ({filteredStations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[450px] overflow-y-auto">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className={`p-3 sm:p-5 border-b last:border-b-0 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent ${
                    selectedStation?.id === station.id ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${getStationGradient(station.type)} rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <div className="text-sm sm:text-base">
                          {getStationIcon(station.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{station.name}</h4>
                          <Badge 
                            variant={station.isOpen ? 'default' : 'secondary'} 
                            className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 ${station.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {station.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{station.address}</p>
                        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                          <span className="flex items-center gap-1 sm:gap-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            <span className="font-medium">{station.distance} km</span>
                          </span>
                          <span className="flex items-center gap-1 sm:gap-2">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{station.rating}</span>
                          </span>
                        </div>
                        {station.amenities && (
                          <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                            {station.amenities.slice(0, 2).map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/50">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 sm:h-9 px-2 sm:px-4 rounded-xl shadow-sm text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectVendor(station);
                        }}
                      >
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Connect</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 sm:h-9 px-2 sm:px-4 rounded-xl shadow-sm text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookService(station);
                        }}
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Book</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Selected Station Details */}
      {selectedStation && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${getStationGradient(selectedStation.type)}`}>
                <div className="text-white text-sm sm:text-base">
                  {getStationIcon(selectedStation.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h2 className="text-lg sm:text-xl font-bold truncate">{selectedStation.name}</h2>
                  <Badge 
                    variant={selectedStation.isOpen ? 'default' : 'secondary'}
                    className={`self-start ${selectedStation.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {selectedStation.isOpen ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{getTypeLabel(selectedStation.type)}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-muted/30 rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    Location Details
                  </h4>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="break-words">{selectedStation.address}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">{selectedStation.distance} km away</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      <span className="font-medium">{selectedStation.rating} rating</span>
                    </div>
                  </div>
                </div>
                {selectedStation.amenities && (
                  <div className="bg-muted/30 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Available Services</h4>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {selectedStation.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="bg-white/50 text-xs px-2 py-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-primary/5 rounded-xl p-3 sm:p-4 border border-primary/20">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-primary text-sm sm:text-base">Connect Through Our Platform</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    All connections are secure and verified through our platform for your safety.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <Button 
                      className="w-full h-10 sm:h-12 rounded-xl shadow-sm text-sm"
                      onClick={() => handleConnectVendor(selectedStation)}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Connect with Vendor
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-10 sm:h-12 rounded-xl shadow-sm text-sm"
                      onClick={() => handleBookService(selectedStation)}
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Book Service Appointment
                    </Button>
                    {selectedStation.type === 'garage' && (
                      <Button 
                        variant="outline" 
                        className="w-full h-10 sm:h-12 rounded-xl shadow-sm text-sm"
                        onClick={() => console.log('Request emergency service')}
                      >
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Request Emergency Service
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">Secure Platform</span>
                  </div>
                  <p>All vendor communications and payments are processed securely through our verified platform.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Map;