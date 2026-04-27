"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ROW_SIZE = 4;

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const rows: string[][] = [];
  for (let i = 0; i < images.length; i += ROW_SIZE) {
    rows.push(images.slice(i, i + ROW_SIZE));
  }

  return (
    <div className="w-full max-w-6xl sm:mx-auto px-4">
      <div className="flex flex-col gap-8">
        {rows.map((row, rowIndex) => (
          <Row
            key={`${JSON.stringify(images)}-row-${rowIndex}`}
            rowImages={row}
            rowIndex={rowIndex}
            onImageClick={(colIndex) =>
              onImageClick(rowIndex * ROW_SIZE + colIndex)
            }
          />
        ))}
      </div>
    </div>
  );
}

interface RowProps {
  rowImages: string[];
  rowIndex: number;
  onImageClick: (colIndex: number) => void;
}

const ROW_TIMEOUT_MS = 5000;

function Row({ rowImages, rowIndex, onImageClick }: RowProps) {
  const [revealAll, setRevealAll] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const resolvedCountRef = useRef(0);

  const handleResolved = useCallback(() => {
    resolvedCountRef.current += 1;
    if (resolvedCountRef.current >= rowImages.length) {
      setRevealAll(true);
    }
  }, [rowImages.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShow(true);
    }, ROW_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {rowImages.map((src, colIndex) => (
        <div key={`${rowIndex}-${colIndex}`} className="w-full">
          <ImageCard
            src={src}
            revealAll={revealAll}
            forceShow={forceShow}
            onResolved={handleResolved}
            onClick={() => onImageClick(colIndex)}
          />
        </div>
      ))}
    </div>
  );
}
