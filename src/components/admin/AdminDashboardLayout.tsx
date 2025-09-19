
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Home, 
  LogOut, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const AdminDashboardLayout = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border transition-all duration-300 ease-in-out",
          "fixed md:relative z-40 h-full md:h-auto",
          isSidebarCollapsed ? "w-16" : "w-64 md:w-64",
          "md:block"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-primary">Admin</h2>
            </div>
          )}
          {isSidebarCollapsed && <Shield className="h-6 w-6 text-primary mx-auto" />}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn("ml-auto", isSidebarCollapsed && "mx-auto")}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 py-4">
          <div className="space-y-1 px-3">
            <Link
              to="/admin/dashboard"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive("/admin/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Home className="w-5 h-5 mr-3" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </Link>
            
            <Link
              to="/admin/technicians"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive("/admin/technician")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Users className="w-5 h-5 mr-3" />
              {!isSidebarCollapsed && <span>Technicians</span>}
            </Link>
            
            <Link
              to="/admin/applications"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive("/admin/applications")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Users className="w-5 h-5 mr-3" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Applications</span>
                  <Badge className="bg-primary text-xs">New</Badge>
                </div>
              )}
              {isSidebarCollapsed && (
                <Badge className="ml-auto bg-primary text-xs">3</Badge>
              )}
            </Link>
            
            <Link
              to="/admin/analytics"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive("/admin/analytics")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              {!isSidebarCollapsed && <span>Analytics</span>}
            </Link>
            
            <Link
              to="/admin/settings"
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive("/admin/settings")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="w-5 h-5 mr-3" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/">
              <LogOut className="w-4 h-4 mr-2" />
              {!isSidebarCollapsed && <span>Exit Admin</span>}
            </Link>
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        !isSidebarCollapsed ? "md:ml-64" : "md:ml-16"
      )}>
        {/* Top nav */}
        <header className="border-b border-border bg-card h-14 md:h-16 flex items-center px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <span className="font-medium">Notifications</span>
                    <Badge variant="secondary" className="ml-2">3 new</Badge>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">New Technician Application</span>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">John Smith submitted an application for the technician role</p>
                    </div>
                    <div className="px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">New Technician Application</span>
                        <span className="text-xs text-muted-foreground">3h ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Sarah Johnson submitted an application for the technician role</p>
                    </div>
                    <div className="px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">New Technician Application</span>
                        <span className="text-xs text-muted-foreground">5h ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Michael Brown submitted an application for the technician role</p>
                    </div>
                  </div>
                  <div className="p-2 text-center border-t border-border">
                    <Button variant="ghost" className="text-xs w-full">View all notifications</Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">A</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">Admin User</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        admin@towbuddy.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout;
