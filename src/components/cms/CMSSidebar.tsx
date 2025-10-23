import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Image, 
  MessageSquare, 
  Settings 
} from 'lucide-react';
import logo from "@/assets/logo/logo.png";
const navItems = [
  { icon: Package, label: 'Packages', path: '/cms/packages' },
  { icon: Image, label: 'Gallery', path: '/cms/gallery' },
  { icon: MessageSquare, label: 'Contact', path: '/cms/contact' },
  { icon: Settings, label: 'Settings', path: '/cms/settings' },
];

export const CMSSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mb-1">
             <img
                              src={logo}
                              alt="Ar-Rahman Logo"
                              className="w-14 h-14 object-contain"
                            />
          </div>
          <span className="text-primary font-serif text-sm">Ar Rahman Tours</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-6 py-3 transition-smooth
                ${isActive 
                  ? 'bg-sidebar-accent text-primary border-l-4 border-primary' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
