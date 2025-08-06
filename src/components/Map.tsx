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
  Phone
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
    // Simulate getting user location
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

  const getStationColor = (type: string) => {
    switch (type) {
      case 'fuel':
        return 'bg-blue-500';
      case 'ev-charging':
        return 'bg-green-500';
      case 'garage':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
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
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Nearby Services</h1>
        <p className="text-muted-foreground">Find fuel stations, EV charging points, and garages near you</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                All
              </Button>
              <Button
                variant={selectedFilter === 'fuel' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('fuel')}
                className="gap-2"
              >
                <Fuel className="h-4 w-4" />
                Fuel
              </Button>
              <Button
                variant={selectedFilter === 'ev-charging' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('ev-charging')}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                EV
              </Button>
              <Button
                variant={selectedFilter === 'garage' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('garage')}
                className="gap-2"
              >
                <Wrench className="h-4 w-4" />
                Garage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg border-2 border-dashed border-border bg-muted/20 relative overflow-hidden">
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
              
              {/* User Location */}
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600/20 rounded-full animate-ping" />
                  </div>
                  <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow">
                    You are here
                  </span>
                </div>
              )}

              {/* Service Stations on Map */}
              {filteredStations.slice(0, 6).map((station, index) => (
                <div
                  key={station.id}
                  className={`absolute cursor-pointer transform transition-transform hover:scale-110 ${
                    index === 0 ? 'top-[20%] left-[30%]' :
                    index === 1 ? 'top-[60%] right-[25%]' :
                    index === 2 ? 'bottom-[20%] left-[20%]' :
                    index === 3 ? 'top-[30%] right-[40%]' :
                    index === 4 ? 'bottom-[40%] right-[30%]' :
                    'top-[70%] left-[40%]'
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className={`w-8 h-8 ${getStationColor(station.type)} rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white`}>
                    {getStationIcon(station.type)}
                  </div>
                  {selectedStation?.id === station.id && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg border min-w-[200px]">
                      <p className="font-medium text-sm">{station.name}</p>
                      <p className="text-xs text-muted-foreground">{station.distance} km away</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Current Location Button */}
              <Button
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => {
                  // Simulate centering on user location
                  console.log('Centering on user location');
                }}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Station List */}
        <Card>
          <CardHeader>
            <CardTitle>Nearby Stations ({filteredStations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/20 ${
                    selectedStation?.id === station.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 ${getStationColor(station.type)} rounded-lg flex items-center justify-center text-white`}>
                        {getStationIcon(station.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{station.name}</h4>
                          <Badge variant={station.isOpen ? 'default' : 'secondary'} className="text-xs">
                            {station.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{station.address}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {station.distance} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {station.rating}
                          </span>
                          <span className="text-muted-foreground">{getTypeLabel(station.type)}</span>
                        </div>
                        {station.amenities && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {station.amenities.slice(0, 3).map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs px-1 py-0">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" className="h-7">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="h-7">
                        <Navigation className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Station Details */}
      {selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStationIcon(selectedStation.type)}
              {selectedStation.name}
              <Badge variant={selectedStation.isOpen ? 'default' : 'secondary'}>
                {selectedStation.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selectedStation.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedStation.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      {selectedStation.distance} km away
                    </p>
                  </div>
                </div>
                {selectedStation.amenities && (
                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex gap-1 flex-wrap">
                      {selectedStation.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
                {selectedStation.type === 'garage' && (
                  <Button variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Book Service
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Map;