
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Technician } from "@/types/technician";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter } from "lucide-react";
import { mapTechnicianData } from "@/utils/technicianMappers";

type FilterStatus = 'all' | 'pending' | 'verified' | 'rejected';

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        let query = supabase.from('technicians').select('*');
        
        if (filter !== 'all') {
          query = query.eq('verification_status', filter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Map the data to our Technician type using the mapper utility
        const mappedTechnicians = data.map(mapTechnicianData);
        setTechnicians(mappedTechnicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTechnicians();
  }, [filter]);

  const filteredTechnicians = technicians.filter(technician =>
    technician.name.toLowerCase().includes(search.toLowerCase()) ||
    technician.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const handleFilterChange = (value: string) => {
    // Type assertion to ensure value is of the correct type
    setFilter(value as FilterStatus);
  };
  
  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Technician Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search technicians..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent>
          {loading ? (
            <p>Loading technicians...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTechnicians.map((technician) => (
                    <tr key={technician.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {technician.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {technician.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(technician.verification_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/admin/technician/${technician.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianManagement;
