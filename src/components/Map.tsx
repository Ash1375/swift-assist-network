import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
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
  Shield,
  Locate,
  RefreshCw
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
  const [allStations, setAllStations] = useState<ServiceStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<ServiceStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<ServiceStation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({ 
    id: 'google-map-script', 
    googleMapsApiKey: apiKey,
    libraries: ['places', 'geometry']
  });

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ saturation: -20 }]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  // Fetch nearby places using Google Places API
  const fetchNearbyPlaces = async (location: { lat: number; lng: number }) => {
    if (!isLoaded || !window.google) return;
    
    setIsLoadingPlaces(true);
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const allResults: ServiceStation[] = [];

    // Define search types
    const searchTypes = [
      { type: 'gas_station', category: 'fuel' as const },
      { type: 'electric_vehicle_charging_station', category: 'ev-charging' as const },
      { type: 'car_repair', category: 'garage' as const }
    ];

    // Fetch each type
    const promises = searchTypes.map(({ type, category }) => 
      new Promise<void>((resolve) => {
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: 5000, // 5km radius
          type: type
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place, index) => {
              if (place.geometry?.location && place.place_id) {
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                  new google.maps.LatLng(location.lat, location.lng),
                  place.geometry.location
                ) / 1000; // Convert to km

                const station: ServiceStation = {
                  id: place.place_id,
                  name: place.name || 'Unknown',
                  type: category,
                  address: place.vicinity || 'Address not available',
                  distance: parseFloat(distance.toFixed(1)),
                  rating: place.rating || 0,
                  isOpen: place.opening_hours?.isOpen?.() ?? true,
                  phone: place.formatted_phone_number || 'N/A',
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                  amenities: place.types?.slice(0, 3) || []
                };
                allResults.push(station);
              }
            });
          }
          resolve();
        });
      })
    );

    await Promise.all(promises);
    
    // Sort by distance
    allResults.sort((a, b) => a.distance - b.distance);
    setAllStations(allResults);
    setIsLoadingPlaces(false);
  };

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

  // Fetch places when location and map are ready
  useEffect(() => {
    if (userLocation && isLoaded) {
      fetchNearbyPlaces(userLocation);
    }
  }, [userLocation, isLoaded]);

  // Filter stations based on selected filter and search query
  useEffect(() => {
    let filtered = allStations;

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
  }, [selectedFilter, searchQuery, allStations]);

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

  const centerMapOnUser = () => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  };

  const getUserMarkerIconUrl = () => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
        <circle cx='12' cy='12' r='8' fill='#3B82F6' stroke='white' stroke-width='3'/>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const getMarkerIconUrl = (type: string) => {
    const colors = {
      fuel: '#3B82F6',
      'ev-charging': '#10B981',
      garage: '#F97316'
    } as const;
    const color = colors[type as keyof typeof colors] || '#6B7280';
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>
        <circle cx='14' cy='14' r='9' fill='${color}' stroke='white' stroke-width='3'/>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header with modern gradient */}
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 relative">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
          Nearby Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
          Connect with verified vendors through our secure platform
        </p>
        {userLocation && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchNearbyPlaces(userLocation)}
            disabled={isLoadingPlaces}
            className="absolute right-4 top-1/2 -translate-y-1/2 gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingPlaces ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}
      </div>


      {/* Search and Filters with glassmorphism */}
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-card/80 dark:to-card/60 backdrop-blur-xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search for stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-2 border-border/50 focus:border-primary rounded-xl bg-white/50 backdrop-blur-sm transition-all hover:bg-white/80"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-md text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-lg"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                All
              </Button>
              <Button
                variant={selectedFilter === 'fuel' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('fuel')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-md text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                style={selectedFilter === 'fuel' ? {} : { background: 'transparent' }}
              >
                <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                Fuel
              </Button>
              <Button
                variant={selectedFilter === 'ev-charging' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('ev-charging')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-md text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                style={selectedFilter === 'ev-charging' ? {} : { background: 'transparent' }}
              >
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                EV
              </Button>
              <Button
                variant={selectedFilter === 'garage' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('garage')}
                className="gap-1 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-xl shadow-md text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                style={selectedFilter === 'garage' ? {} : { background: 'transparent' }}
              >
                <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
                Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Google Maps View */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-card/90 dark:to-card/70 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] sm:h-[400px] lg:h-[450px] relative overflow-hidden">
              {apiKey && isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={userLocation || { lat: 12.9716, lng: 77.5946 }}
                  zoom={13}
                  options={mapOptions}
                  onLoad={(mapInstance) => setMap(mapInstance)}
                >
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={getUserMarkerIconUrl()}
                    />
                  )}

                  {/* Service Station Markers */}
                  {filteredStations.map((station) => (
                    <Marker
                      key={station.id}
                      position={{ lat: station.latitude, lng: station.longitude }}
                      icon={getMarkerIconUrl(station.type)}
                      onClick={() => setSelectedStation(station)}
                    />
                  ))}

                  {/* Info Window for Selected Station */}
                  {selectedStation && (
                    <InfoWindow
                      position={{ lat: selectedStation.latitude, lng: selectedStation.longitude }}
                      onCloseClick={() => setSelectedStation(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-sm mb-1">{selectedStation.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{selectedStation.address}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedStation.distance} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {selectedStation.rating}
                          </span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Map Ready to Load</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Enter your Google Maps API key above to view the interactive map
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Current Location Button */}
              {apiKey && (
                <Button
                  size="sm"
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 shadow-2xl rounded-xl bg-white/95 dark:bg-card/95 backdrop-blur-md border-2 border-primary/20 text-foreground hover:bg-white hover:scale-110 h-10 w-10 sm:h-12 sm:w-12 p-0 transition-all"
                  onClick={centerMapOnUser}
                >
                  <Locate className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Station List with modern design */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-card/90 dark:to-card/70 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 backdrop-blur-sm">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Verified Vendors ({filteredStations.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[450px] overflow-y-auto custom-scrollbar">
              {isLoadingPlaces && filteredStations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading nearby services...</p>
                </div>
              ) : filteredStations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No services found nearby</p>
                </div>
              ) : (
                filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className={`p-3 sm:p-5 border-b last:border-b-0 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:scale-[1.02] ${
                      selectedStation?.id === station.id ? 'bg-gradient-to-r from-primary/15 to-transparent border-l-4 border-l-primary shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedStation(station)}
                  >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getStationGradient(station.type)} rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0 hover:scale-110 transition-transform`}>
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
                        className="h-8 sm:h-9 px-2 sm:px-4 rounded-xl shadow-md text-xs hover:shadow-lg hover:scale-105 transition-all bg-white/50 backdrop-blur-sm"
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
                        className="h-8 sm:h-9 px-2 sm:px-4 rounded-xl shadow-md text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:scale-105 transition-all"
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
              ))
              )}
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