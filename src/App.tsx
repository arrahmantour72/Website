import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Gallery } from './pages/public/Gallery';
import { Packages } from './pages/public/Packages';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { HomeEditor } from './pages/cms/HomeEditor';
import { AboutEditor } from './pages/cms/AboutEditor';
import { GalleryEditor } from './pages/cms/GalleryEditor';
import { PackagesEditor } from './pages/cms/PackagesEditor';
import { ContactEditor } from './pages/cms/ContactEditor';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ui/ScrollToTop";
import {PackageDetails} from "./pages/public/PackageDetails";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
         <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/packageDetails/:id" element={<PackageDetails />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* CMS Routes - Protected */}
            <Route path="/cms" element={<Navigate to="/cms/packages" replace />} />
            <Route path="/cms/pages" element={<ProtectedRoute requireAdmin><HomeEditor /></ProtectedRoute>} />
            <Route path="/cms/about" element={<ProtectedRoute requireAdmin><AboutEditor /></ProtectedRoute>} />
            <Route path="/cms/gallery" element={<ProtectedRoute requireAdmin><GalleryEditor /></ProtectedRoute>} />
            <Route path="/cms/packages" element={<ProtectedRoute requireAdmin><PackagesEditor /></ProtectedRoute>} />
            <Route path="/cms/contact" element={<ProtectedRoute requireAdmin><ContactEditor /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
