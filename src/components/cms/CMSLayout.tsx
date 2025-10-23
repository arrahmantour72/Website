import { ReactNode, useState } from 'react';
import { CMSSidebar } from './CMSSidebar';
import { User, Menu, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CMSLayoutProps {
  children: ReactNode;
  title: string;
  onSave?: () => void;
  loading?: boolean; // Added loading prop
}

export const CMSLayout = ({
  children,
  title,
  onSave,
  loading = false,
}: CMSLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-muted md:flex">
      {/* --- Sidebar --- */}
      
      {/* Overlay for mobile (closes sidebar on click) */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          w-64 bg-card border-r border-border
          transform transition-transform ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex-shrink-0
        `}
      >
        {/* Your Sidebar Content */}
        <CMSSidebar />

        {/* Mobile close button (inside the sidebar) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute top-3 right-3"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          
          {/* Left Side: Menu Toggle + Title */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
              {title}
            </h1>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User Button */}
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Save Button */}
            <Button
              onClick={onSave}
              disabled={loading}
              className="gradient-primary text-white hover:shadow-glow transition-smooth flex items-center"
            >
              <Save className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">
                {loading ? 'Saving...' : 'Save Changes'}
              </span>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};