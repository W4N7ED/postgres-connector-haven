
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Database, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { name: 'Connexions', path: '/connections', icon: <Database className="w-4 h-4 mr-2" /> },
    { name: 'Paramètres', path: '/settings', icon: <Settings className="w-4 h-4 mr-2" /> },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-lg">
      <div className="container flex justify-between items-center py-4">
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl font-semibold flex items-center text-primary hover:opacity-90 transition-opacity">
            <Database className="mr-2 h-6 w-6" />
            <span>PostgreSQL Manager</span>
          </NavLink>
        </div>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {mobileMenuOpen && (
              <div className="fixed inset-0 top-[72px] z-50 bg-background animate-fade-in">
                <div className="flex flex-col p-6 space-y-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center py-3 px-4 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-4 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-secondary"
                )}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
