import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Menu, X } from "lucide-react"; // Icons
import logo from "@/assets/logo/logo.png";
import { Facebook, Instagram, Youtube, MessageCircleCode } from "lucide-react";
interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const location = useLocation();
  const navItems = useSelector((state: RootState) => state.navigation.items);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <img
                  src={logo}
                  alt="Ar-Rahman Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">
                Ar-Rahman Tours
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    className={`
                      text-sm font-medium transition-all relative
                      ${
                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }
                      after:content-[''] after:absolute after:w-full after:h-0.5 
                      after:bg-primary after:bottom-[-4px] after:left-0 
                      after:transition-transform after:origin-bottom-right
                      ${
                        isActive
                          ? "after:scale-x-100"
                          : "after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-6 pb-4 animate-fadeIn">
            <ul className="flex flex-col gap-3 mt-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.url}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground  py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Logo & Description */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={logo}
                  alt="Ar-Rahman Tours Logo"
                  className="w-14 h-14 object-contain rounded-full border border-[#c2a25e] p-1 bg-white"
                />
                <span className="text-2xl font-serif font-bold text-[#c2a25e]">
                  Ar-Rahman Tours
                </span>
              </div>
              <p className="text-sm text-white-400 max-w-xs leading-relaxed">
                Providing spiritual journeys to sacred sites with care and
                reverence since 2008.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-lg mb-4 text-[#c2a25e]">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.url}
                      className="text-sm text-white-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-lg mb-4 text-[#c2a25e]">
                Contact Us
              </h3>
              <ul className="space-y-2 text-sm text-white-400 mb-4">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:maulanaatahaider@gmail.com"
                    className="hover:text-[#c2a25e]"
                  >
                    maulanaatahaider@gmail.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href="tel:+919819837579" className="hover:text-[#c2a25e]">
                    +91 98198 37579
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/919819837579"
                    target="_blank"
                    className="hover:text-[#c2a25e]"
                  >
                    Chat with us
                  </a>
                </li>
              </ul>

              {/* Social Media Icons */}
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#c2a25e]/10 hover:bg-[#c2a25e] rounded-full transition transform hover:scale-110"
                >
                  <Facebook className="text-[#c2a25e] hover:text-white text-lg" />
                </a>
                <a
                  href="https://www.instagram.com/ar_rahman_tour?igsh=MXBuZmFtYnNobjB2ZQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#c2a25e]/10 hover:bg-[#c2a25e] rounded-full transition transform hover:scale-110"
                >
                  <Instagram className="text-[#c2a25e] hover:text-white text-lg" />
                </a>
                <a
                  href="https://wa.me/919819837579"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#c2a25e]/10 hover:bg-[#c2a25e] rounded-full transition transform hover:scale-110"
                >
                  <MessageCircleCode className="text-[#c2a25e] hover:text-white text-lg" />
                </a>
                <a
                  href="https://youtube.com/@arrahmantourarrahmantour?si=HGpgXT-PZQTIkORM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#c2a25e]/10 hover:bg-[#c2a25e] rounded-full transition transform hover:scale-110"
                >
                  <Youtube className="text-[#c2a25e] hover:text-white text-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-5 pt-6 text-center text-sm text-white-500">
            © {new Date().getFullYear()} Ar-Rahman Tours. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
