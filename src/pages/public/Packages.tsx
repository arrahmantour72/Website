"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import package_home from "@/assets/about/about-home.png"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

type ZiyaratPackage = Tables<"packages">;

export const Packages = () => {
    const [packages, setPackages] = useState<ZiyaratPackage[]>([]);
  const [filtered, setFiltered] = useState<ZiyaratPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [destination, setDestination] = useState<string>("all");
  const [duration, setDuration] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedPackages = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  

  // --- Fetch Packages ---
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("packages").select("*");
      if (error) {
        setError(error.message);
        setPackages([]);
        setFiltered([]);
      } else if (data) {
        setPackages(data as ZiyaratPackage[]);
        setFiltered(data as ZiyaratPackage[]);
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  // --- Filter Logic ---
  useEffect(() => {
    let filteredList = [...packages];

    if (destination !== "all") {
      filteredList = filteredList.filter(
        (pkg) =>
          pkg.category?.toLowerCase().includes(destination.toLowerCase()) ||
          pkg.title?.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (duration !== "all") {
      filteredList = filteredList.filter((pkg) =>
        pkg.duration?.toLowerCase().includes(duration.toLowerCase())
      );
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredList = filteredList.filter((pkg) => pkg.price <= max);
    }

    setFiltered(filteredList);
    setCurrentPage(1); // reset page
  }, [destination, duration, maxPrice, packages]);

  // Loading / Error states
  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl font-medium text-slate-600">
            Loading Packages...
          </p>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-red-500">
          <h2 className="text-2xl font-semibold">Failed to load packages</h2>
          <p className="mt-2">{error}</p>
        </div>
      </PublicLayout>
    );
  }

  // Feature list for “What’s Included”
  const features = [
    { id: 1, icon: "🧭", title: "Experienced Guides" },
    { id: 2, icon: "🍽️", title: "Halal Meals" },
    { id: 3, icon: "⏰", title: "24/7 Support" },
    { id: 4, icon: "🏨", title: "Luxury Accommodations" },
    { id: 5, icon: "🛂", title: "Visa Assistance" },
    { id: 6, icon: "🚐", title: "Private Transport" },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section
  className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden"
  style={{
    backgroundImage: `url(${package_home})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

  {/* Content */}
  <div className="relative z-10 max-w-3xl px-6 sm:px-8">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
      Discover Your Ziyarat Packages
    </h1>

    <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 font-light tracking-wide">
      Tailored journeys of faith and comfort
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white mb-4 py-3 px-8 rounded-full shadow-lg transition-all">
        Explore Packages
      </Button>
      <Button
        variant="outline"
        className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-base font-medium transition"
      >
        Contact Us
      </Button>
    </div>
  </div>
</section>


      {/* Main Section */}
   <section className="bg-[#fbf7f1] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Filters */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="iran">Iran</SelectItem>
              <SelectItem value="iraq">Iraq</SelectItem>
              <SelectItem value="syria">Syria</SelectItem>
            </SelectContent>
          </Select>

          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="7 days">7 Days</SelectItem>
              <SelectItem value="10 days">10 Days</SelectItem>
              <SelectItem value="15 days">15 Days</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Packages List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            No packages found for selected filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white flex-[0_0_100%] 
                  sm:flex-[0_0_45%] 
                  md:flex-[0_0_30%] 
                  bg-white 
                  rounded-3xl 
                  shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
                  hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] 
                  transition-all 
                  duration-300 
                  overflow-hidden 
                  p-4 "
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={pkg.image_url || "/placeholder.jpg"}
                      alt={pkg.title}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-primary-600"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {pkg.location} • {pkg.duration}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Start from</p>
                        <p className="text-lg font-bold text-gray-800">
                          ₹{pkg.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-4 h-4"
                        >
                          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.781 1.4 8.172L12 18.897l-7.334 3.866 1.4-8.172L.132 9.21l8.2-1.192z" />
                        </svg>
                        4.9
                      </div>
                    </div>

                    <Link to={`/packages/${pkg.id}`}>
                      <Button className="w-full text-white text-sm font-medium py-2 bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-full shadow-md transition">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-full border ${
                    currentPage === i + 1
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* What's Included Section */}
        <div className="mt-20">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            What’s Included
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="text-3xl bg-[#f6efe1] w-12 h-12 flex items-center justify-center rounded-full">
                  {f.icon}
                </div>
                <p className="text-slate-700 font-medium">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>


      {/* Inline Theme */}
      
    </PublicLayout>
  );
};
