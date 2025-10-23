"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PublicLayout } from "@/components/public/PublicLayout";

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [page, setPage] = useState<number>(1);
  const limit = 6;
  const [totalItems, setTotalItems] = useState<number>(0);

  const categories = ["All", "Iran", "Iraq"];

  const fetchGallery = async () => {
    setLoading(true);

    let query = supabase.from("destinations").select("*", { count: "exact" });

    if (selectedCategory !== "All") {
      query = query.eq("categories", selectedCategory);
    }

    

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Sort featured first
    query = query.order("featured", { ascending: false });

    const { data, count, error } = await query;
    if (error) console.error("Supabase fetch error:", error);
    else {
      setGalleryItems(data || []);
      setTotalItems(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory, page]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <PublicLayout>
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">
              {selectedCategory !== "All"
                ? `${selectedCategory} Gallery`
                : "Gallery"}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore the spiritual beauty of pilgrimages
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center gap-3 mb-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-medium border transition ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <Card
                  key={item._id}
                  className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group rounded-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {item.imagebase64 ? (
                      <img
                        src={item.imagebase64}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">🕌</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-semibold text-lg">{item.title}</p>
                    </div>
                    {item.featured && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No images found for this category.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-md font-medium border transition ${
                    p === page
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
