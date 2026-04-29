"use client";

import { useRef, FormEvent } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  isLoading: boolean;
}

export default function Header({ onSearch, onImageSearch, isLoading }: HeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = inputRef.current?.value.trim();
    if (query) {
      onSearch(query);
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onImageSearch(file);
    fileInputRef.current!.value = "";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search images..."
          disabled={isLoading}
          aria-label="Search images"
          className="w-full h-10 pl-4 pr-20 rounded-lg border border-gray-300 bg-gray-50 text-sm outline-none transition-colors focus:border-gray-400 focus:bg-white disabled:opacity-50"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image to search"
        />
        <button
          type="button"
          disabled={isLoading}
          aria-label="Search by image"
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Submit search"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </header>
  );
}
