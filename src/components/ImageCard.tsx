"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

type CardStatus = "loading" | "loaded" | "unavailable";

interface ImageCardProps {
  src: string;
  onClick: () => void;
  forceShow: boolean;
  revealAll: boolean;
  onResolved: () => void;
}

export default function ImageCard({
  src,
  onClick,
  forceShow,
  revealAll,
  onResolved,
}: ImageCardProps) {
  const isEmptySrc = !src;

  const [status, setStatus] = useState<CardStatus>("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  const resolve = useCallback(
    (newStatus: CardStatus) => {
      if (resolvedRef.current) {
        return;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setStatus(newStatus);
      resolvedRef.current = true;
      onResolved();
    },
    [onResolved]
  );

  useEffect(() => {
    if (isEmptySrc) {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        onResolved();
      }
      return;
    }

    if (resolvedRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
      resolve("unavailable");
    }, 10000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isEmptySrc, resolve, onResolved]);

  const imageRevealed = status === "loaded" && (revealAll || forceShow);

  const handleClick = () => {
    if (status !== "unavailable" && !isEmptySrc) {
      onClick();
    }
  };

  const clickable = !isEmptySrc && status !== "unavailable";

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer select-none"
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {!imageRevealed && (
        <div className="absolute inset-0 animate-shimmer rounded-lg" />
      )}

      {!isEmptySrc && status !== "unavailable" && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-opacity duration-300"
          onLoad={() => resolve("loaded")}
          onError={() => resolve("unavailable")}
          loading="lazy"
          style={{ opacity: imageRevealed ? 1 : 0 }}
        />
      )}

      {status === "unavailable" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm font-medium">
          Image unavailable
        </div>
      )}
    </div>
  );
}
