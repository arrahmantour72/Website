// src/pages/PackageDetails.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Link is needed for the package cards
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// --- NEW ICONS ---
// Added Star for Key Destinations
// Added Package for the header of the "Other Packages" section
import {
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Hotel,
  CalendarDays,
  Plane,
  ChevronRight,
  Loader2,
  Info,
  Star, // <-- NEW
  Package, // <-- NEW
} from "lucide-react";

// --- UPDATED TYPE ---
// Added optional 'key_locations' and 'featured' properties
type ZiyaratPackage = Tables<"packages">;

// --- Framer Motion Variants (Unchanged) ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// --- NEW REUSABLE COMPONENT ---
// A simple card for the "You might also like" section
const PackageCard = ({ pkg }: { pkg: ZiyaratPackage }) => (
  <motion.div
    variants={itemVariants} // Use itemVariants for stagger effect
    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
  >
    <Link to={`/packageDetails/${pkg.id}`} className="block">
      <img
        src={pkg.image_url || "/placeholder.jpg"}
        alt={pkg.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {pkg.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-4 space-x-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="text-sm">{pkg.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-lg font-bold text-amber-600">
              ₹{pkg.price?.toLocaleString()}
            </p>
          </div>
          <span className="flex items-center text-sm font-medium text-amber-600">
            View <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export const PackageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<ZiyaratPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW STATE for suggested packages ---
  const [relatedPackages, setRelatedPackages] = useState<ZiyaratPackage[]>([]);

  // Main data fetching for the current package
  useEffect(() => {
    // Scroll to top when ID changes
    window.scrollTo(0, 0);

    const fetchPackageDetails = async () => {
      if (!id) {
        setError("Package ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setRelatedPackages([]); // Clear related packages on new load

      try {
        const { data, error: supabaseError } = await supabase
          .from("packages")
          .select("*")
          .eq("id", id)
          .single();

        if (supabaseError) throw supabaseError;

        if (data) {
          setPackageData(data as ZiyaratPackage);
        } else {
          setError("Package not found.");
        }
      } catch (err: any) {
        console.error("Error fetching package details:", err);
        setError(
          `Failed to load package details: ${err.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  // --- NEW useEffect to fetch related packages ---
  // Runs after the main package has been fetched (or when 'id' changes)
  useEffect(() => {
    if (!id) return; // Don't fetch if the main ID isn't available

    const fetchRelatedPackages = async () => {
      try {
        const { data, error: relatedError } = await supabase
          .from("packages")
          .select("*")
          .eq("featured", true) // Get other featured packages
          .neq("id", id) // Exclude the current one
          .limit(3); // Only get 3

        if (relatedError) throw relatedError;

        if (data) {
          setRelatedPackages(data as ZiyaratPackage[]);
        }
      } catch (err) {
        console.error("Error fetching related packages:", err);
        // We don't set a main error here, just log it,
        // as this section is not critical.
      }
    };

    fetchRelatedPackages();
  }, [id]); // Dependency: re-fetch if the main package ID changes

  // --- Loading, Error, and Not Found States (Unchanged) ---
  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-700">
          <Loader2 className="animate-spin mr-2 w-6 h-6 text-amber-500" />{" "}
          Loading package details...
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-lg text-red-600 p-8">
          <Info className="w-10 h-10 mb-4" />
          <p className="font-semibold mb-2">Error:</p>
          <p className="text-center">{error}</p>
          <Link to="/" className="mt-6">
            <Button className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
              Go to Home
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  if (!packageData) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-lg text-gray-700 p-8">
          <Info className="w-10 h-10 mb-4" />
          <p className="font-semibold mb-2">Package Not Found</p>
          <Link to="/packages" className="mt-6">
            <Button className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white">
              View All Packages
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  // --- Main Render ---
  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen pb-24 overflow-hidden">
        {/* Hero Section (Unchanged) */}
        <motion.section
          className="relative h-96 bg-cover bg-center flex items-end p-8 text-white"
          style={{
            backgroundImage: `url(${
              packageData.image_url || "/placeholder.jpg"
            })`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <motion.div
            className="relative z-10 w-full"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {packageData.title}
            </h1>
            <p className="text-xl md:text-2xl font-light">
              {packageData.location}
            </p>
          </motion.div>
        </motion.section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          {/* Key Details & CTA Card (Unchanged) */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0 lg:space-x-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* ... Key details ... */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-grow">
              <div className="flex items-center space-x-3">
                <IndianRupee className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-gray-500 text-sm">Price</p>
                  <p className="text-lg font-bold text-gray-800">
                    ₹{packageData.price?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="text-lg font-bold text-gray-800">
                    {packageData.duration || "N/A"} 
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="text-lg font-bold text-gray-800">
                    {packageData.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-gray-500 text-sm">Dates</p>
                  <p className="text-lg font-bold text-gray-800">
                    {packageData.dates || "Flexible"}
                  </p>
                </div>
              </div>
            </div>
            <Link to="/contact" className="w-full lg:w-auto flex-shrink-0">
              <Button className="w-full lg:w-auto bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                Book Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Overview (Unchanged) */}
              <motion.section
                className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {packageData.description}
                </p>
              </motion.section>

              {/* --- NEW SECTION: Key Destinations --- */}
              {packageData.key_locations &&
                packageData.key_locations.length > 0 && (
                  <motion.section
                    className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Key Destinations
                    </h2>
                    <motion.ul
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={staggerContainerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      {packageData.key_locations.map((location, index) => (
                        <motion.li
                          key={index}
                          variants={itemVariants}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <span className="text-lg text-gray-800 font-medium">
                            {location}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.section>
                )}

              {/* Itinerary */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Itinerary
                  </h2>
                  <motion.div
                    className="space-y-6"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {packageData.itinerary.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-lg">{item}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              )}

              {/* Inclusions */}
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What's Included
                  </h2>
                  <motion.ul
                    className="space-y-3"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {packageData.inclusions.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="flex items-start space-x-3 text-gray-700"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.section>
              )}

              {/* Exclusions */}
              {packageData.exclusions && packageData.exclusions.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    What's Not Included
                  </h2>
                  <motion.ul
                    className="space-y-3"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    {packageData.exclusions.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="flex items-start space-x-3 text-gray-700"
                      >
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.section>
              )}
            </div>

            {/* Sidebar (Accommodation & Quick Contact) */}
            <div className="lg:col-span-1 space-y-12">
              {packageData.accommodations &&
                packageData.accommodations.length > 0 && (
                  <motion.section
                    className="bg-white rounded-xl shadow-lg p-6 md:p-8"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Accommodation
                    </h2>
                    <motion.div
                      className="space-y-6"
                      variants={staggerContainerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      {packageData.accommodations.map((acc, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-start space-x-4"
                        >
                          <Hotel className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {acc.hotel_name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {acc.city} {acc.rating && `(${acc.rating} Stars)`}
                            </p>
                            {acc.description && (
                              <p className="text-gray-500 text-sm mt-1">
                                {acc.description}
                              </p>
                            )}
                            {Array.isArray(acc.amenities) &&
                              acc.amenities.length > 0 && (
                                <ul className="text-gray-500 text-sm mt-2 list-disc list-inside">
                                  {acc.amenities.map((amenity, i) => (
                                    <li key={i}>{amenity}</li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.section>
                )}

              <motion.section
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Book?
                </h3>
                <p className="text-gray-600 mb-6">
                  Have questions or want to customize your journey? Contact us
                  today!
                </p>
                <Link to="/contact">
                  <Button className="w-full bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                    Inquire Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.section>
            </div>
          </div>

          {/* --- NEW SECTION: Other Popular Packages --- */}
          {relatedPackages.length > 0 && (
            <motion.section
              className="mt-24"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className="flex items-center mb-8">
                <Package className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl font-bold text-gray-900 ml-3">
                  Other Popular Packages
                </h2>
              </div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {relatedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </motion.div>
            </motion.section>
          )}
        </div>{" "}
        {/* End of container */}
      </div>{" "}
      {/* End of bg-gray-50 */}
    </PublicLayout>
  );
};
