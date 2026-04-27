"use client";

import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import Header from "@/components/Header";
import ImageGrid from "@/components/ImageGrid";
import Lightbox from "@/components/Lightbox";

interface ImageData {
  images: string[];
}

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchRandomImages = useCallback(async () => {
    startTransition(() => {
      setLoading(true);
      setError(false);
    });
    try {
      const res = await fetch("/api/random_images");
      if (!res.ok) throw new Error("API error");
      const data: ImageData = await res.json();
      startTransition(() => setImages(data.images));
    } catch {
      startTransition(() => setError(true));
    } finally {
      startTransition(() => setLoading(false));
    }
  }, []);

  const searchImages = useCallback(async (query: string) => {
    startTransition(() => {
      setLoading(true);
      setError(false);
    });
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("API error");
      const data: ImageData = await res.json();
      startTransition(() => setImages(data.images));
    } catch {
      startTransition(() => setError(true));
    } finally {
      startTransition(() => setLoading(false));
    }
  }, []);

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchRandomImages();
    }
  }, [fetchRandomImages]);

  const handleImageClick = (index: number) => {
    if (images[index]) {
      setLightboxIndex(index);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header onSearch={searchImages} isLoading={loading} />

      <main className="flex-1 flex flex-col sm:justify-center pt-20 pb-8">
        {error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Sorry, try again later.</p>
          </div>
        ) : loading ? (
          <ImageGrid
            images={Array(8).fill("")}
            onImageClick={() => {}}
          />
        ) : (
          <ImageGrid images={images} onImageClick={handleImageClick} />
        )}
      </main>

      <Lightbox
        src={lightboxIndex !== null ? images[lightboxIndex] : null}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
