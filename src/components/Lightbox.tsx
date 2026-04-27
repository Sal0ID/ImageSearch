"use client";

import { useEffect, useCallback, useRef, useState, startTransition } from "react";
import Image from "next/image";

type ImageStatus = "loading" | "loaded" | "error";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (src) {
      startTransition(() => setStatus("loading"));
    }
  }, [src]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (src) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [src]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && src) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [src, handleClose]);

  const handleDownload = useCallback(async () => {
    if (!src) return;
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  }, [src]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  if (!src) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] m-auto w-full h-full max-w-full max-h-full bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
    >
      <div className="relative flex items-center justify-center w-full h-full sm:w-[min(85vw,85vh)] sm:h-[min(85vw,85vh)]">
        <div className="relative w-full h-full">
          {status === "loading" && (
            <div className="absolute inset-0 animate-shimmer rounded-xl" />
          )}

          {status !== "error" && (
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 85vw"
              className="object-contain sm:rounded-xl"
              onLoad={() => setStatus("loaded")}
              onError={() => setStatus("error")}
              style={{ opacity: status === "loaded" ? 1 : 0 }}
            />
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-lg">Failed to load image</p>
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close lightbox"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors sm:bottom-6 sm:right-6"
          aria-label="Download image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
