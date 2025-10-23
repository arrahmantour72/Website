"use client";
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PublicLayout } from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRightIcon, Star,User2Icon,MapPinIcon, CalendarDaysIcon } from "lucide-react";
import heroImage from "@/assets/hero-shrine.jpg";
import { Link } from "react-router-dom";
import about_circle from "@/assets/about/about-circle.png";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types"; // ← adjust the path if needed
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
type ZiyaratPackage = Tables<"packages">;
type Destination = Tables<"destinations">;
export const Home = () => {
  const targetSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const testimonials = useSelector(
    (state: RootState) => state.home.testimonials
  );
   const events = useSelector(
    (state: RootState) => state.home.events
  );
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<ZiyaratPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("featured", true);
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setPackages(data);
      }
    };
    setLoading(false);
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase.from("destinations").select("*");
      if (error) {
        console.error("Error fetching destinations:", error);
      } else {
        setDestinations(data || []);
      }
    };
    fetchDestinations();
  }, []);
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [destinationemblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [packagesemblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const fadeInVariants = {
  hidden: { opacity: 0, y: 30 }, // Start invisible and 30px down
  visible: { 
    opacity: 1, 
    y: 0, // End visible and at original position
  }
};
const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Make each child card animate 0.2s after the previous one
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  }
};
  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="">
        <section className="relative flex items-center justify-center min-h-screen text-center bg-cover bg-center text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80  z-0" />

          <div className="relative z-10 container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
              A Spiritual Journey to Iran & Iraq
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mt-4 mb-8 opacity-90 animate-fade-in">
              Experience peace, comfort, and faith with Ar Rahman Tour
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={scrollToSection}
                className="bg-yellow-500 hover:bg-yellow-600 text-white mb-4 py-3 px-8 rounded-full shadow-lg transition-all"
              >
                View Packages
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white rounded-full backdrop-blur-sm bg-white/10 hover:bg-white hover:text-amber-700 transition-colors py-3 px-8"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
        {/* About Section */}
        <section className="bg-white py-20 md:py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
                About Ar Rahman Tour
              </h2>
              <h6 className="text-xl md:text-1xl font-sans font-bold text-gray-600 dir-rtl">
                الرحمن ٹور کے بارے میں
              </h6>
              <p className="text-gray-600 leading-relaxed">
                Ar-Rahman Tour is founded by <b>(Maulana) Ata Haider Rizvi </b>,
                a prominent religious leader and a volunteer for past twenty
                years, who has been actively engaged in organising Umrah and
                Ziarat Groups with core focus of serving community. The task
                force of the team is geared to offer the best of services to
                muslim holy lands and islamic historical places to our cherished
                guests with the aim of making their holidays memorable.
              </p>
              <Link to="/about" className="">
                <Button className="bg-gradient-to-br mt-4 from-yellow-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-amber-700 transition-all px-8">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src={about_circle}
                alt="Smiling group of travelers"
                className="rounded-full w-80 h-80 md:w-96 md:h-96 object-cover shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </section>
        {/* Events Preview */}
       <section className="bg-gray-50 py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- ANIMATION: Replaced <div> with <motion.div> for the header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants} // Use the fade-in animation
          initial="hidden"           // Start at the "hidden" variant
          whileInView="visible"      // Animate to "visible" when it enters the viewport
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }} // Trigger animation once, when 30% is visible
        >
          {/* Section Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Upcoming <span className="text-green-500">Events</span>
          </h2>
          <h6 className="text-2xl md:text-xl font-sans mt-4 text-gray-600 dir-rtl">
            آنے والے پروگرام
          </h6>
        </motion.div>

        {/* --- ANIMATION: Replaced <div> with <motion.div> for the card container */}
        <motion.div
          className="space-y-16"
          variants={cardContainerVariants} // Use the container variant
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger when 10% is visible
        >
          {/* Event Cards */}
          {events.map((event, index) => (
            // --- ANIMATION: Replaced the card <div> with <motion.div>
            <motion.div
              key={event.id}
              variants={cardVariants} // Use the individual card animation
              className={`flex flex-col lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300`}
            >
              {/* Event Image */}
              <div className="lg:w-1/2">
                <img
                  src={event.imagebase64 || "/placeholder.jpg"}
                  alt={event.title}
                  className="w-full h-80 object-contain"
                />
              </div>

              {/* Event Info */}
              <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* --- Key Details with Icons --- */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User2Icon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">Organized by: {event.organizer}</span>
                  </div>
                </div>

                <button className="self-start flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-7 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300">
                  Learn More
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
        {/* Packages Preview */}
        <section ref={targetSectionRef} className=" overflow-hidden py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4 text-gray-800">
                Popular Ziyarat Packages
              </h2>
              <h6 className="text-xl md:text-lg font-sans font-bold text-gray-600 dir-rtl">
                پاپولر زیارت پیکیجز
              </h6>
            </div>

            {/* Carousel */}
            <div className="" ref={packagesemblaRef}>
              <div className="flex gap-5 sm:gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="
                  flex-[0_0_100%] 
                  sm:flex-[0_0_45%] 
                  md:flex-[0_0_30%] 
                  bg-white 
                  rounded-3xl 
                  shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
                  hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] 
                  transition-all 
                  duration-300 
                  overflow-hidden 
                  p-4
                "
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={pkg.image_url || "/placeholder.jpg"}
                        alt={pkg.title}
                        className="w-full h-44 sm:h-48 md:h-52 object-cover rounded-2xl"
                      />
                      {/* Heart Icon */}
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

                    {/* Text Content */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                        {pkg.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                        {pkg.location}
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
                          {"4.9"}
                        </div>
                      </div>

                      <Link to={`/packageDetails/${pkg.id}`}>
                        <button className="w-full btext-white text-sm font-medium py-2 bg-gradient-to-br mt-4 from-yellow-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-amber-700 transition-all rounded-full shadow-md transition">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-10">
              <Link to="/packages">
                <button
                  className="
    px-6 py-3
    bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600
    text-white
    font-semibold
    rounded-full
    shadow-lg
    hover:shadow-2xl
    hover:scale-105
    transition-all
    duration-300
    relative
    overflow-hidden
  "
                >
                  View All Packages
                  {/* Optional subtle shine */}
                  <span
                    className="
      absolute top-0 left-0 w-0 h-full bg-white/10 
      hover:w-full transition-all duration-500
    "
                  ></span>
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* Destination Preview */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
                Explore Ziyarat Destinations
              </h2>
              <h6 className="text-xl md:text-1xl font-sans font-bold text-gray-600 dir-rtl">
                زیارت کے مقامات کی تلاش کریں{" "}
              </h6>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={destinationemblaRef}>
              <div className="flex gap-6">
                {destinations.map((dest) => (
                  <Link
                    to="/gallery"
                    state={{
                      destinationId: dest.categories,
                      title: dest.title,
                    }}
                    key={dest._id}
                    className="
              flex-[0_0_100%]
              sm:flex-[0_0_48%]
              lg:flex-[0_0_30%]
              relative rounded-xl overflow-hidden shadow-lg group cursor-pointer
              shrink-0
            "
                  >
                    <img
                      src={dest.imagebase64}
                      alt={dest.title}
                      className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <h3 className="absolute bottom-6 left-6 text-2xl font-serif font-bold text-white">
                      {dest.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Gallery Section */}
        <section className="bg-background py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif font-bold mb-4 text-gray-900 leading-tight">
                Our Gallery
              </h2>
              <h6 className="text-2xl md:text-xl font-sans text-gray-600 dir-rtl">
                ہماری گیلری
              </h6>
            </div>

            {/* CHANGES:
          1. Grid changed to `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` for more, smaller images.
          2. Gap reduced to `gap-4` for a tighter layout.
        */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.map((destination, index) => (
                <div
                  key={destination._id || index}
                  className={`
                relative group rounded-xl overflow-hidden shadow-lg 
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                {/* All conditional col-span/row-span classes removed */}
              `}
                >
                  <img
                    src={destination.imagebase64 || "/placeholder-image.jpg"}
                    alt={destination.title || "Gallery image"}
                    className={`
                  w-full object-cover transition-all duration-300 group-hover:brightness-90
                  h-64 {/* Standard, smaller height for all images */}
                `}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="text-white text-lg font-semibold">
                      {destination.title || "Untitled Image"}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
              {/* Testimonials */}     {" "}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">
                Pilgrim Testimonials
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from those who've experienced spiritual transformation
              </p>
            </div>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(35%-1rem)] snap-center p-2"
                  >
                    <Card className="p-6 shadow-soft h-full flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-primary text-primary"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mb-6 italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                        <img
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Verified Pilgrim
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
