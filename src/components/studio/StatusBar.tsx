"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function StatusBar() {
  const [zoom, setZoom] = useState(100);
  const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState(false);

  const canvasSize = { width: 1200, height: 800 };
  const zoomOptions = [50, 75, 100, 125, 150, 175, 200];

  return (
    <div className="h-7 bg-background border-t border-border flex items-center justify-between px-4 text-xs">
      {/* Left Section - Canvas Size */}
      <div className="flex items-center space-x-4">
        <span className="text-muted-foreground">
          {canvasSize.width} × {canvasSize.height}px
        </span>
      </div>

      {/* Right Section - Zoom & Status */}
      <div className="flex items-center space-x-4">
        {/* Zoom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsZoomDropdownOpen(!isZoomDropdownOpen)}
            className="flex items-center space-x-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <span>{zoom}%</span>
            <ChevronDown
              size={12}
              className={`transition-transform ${
                isZoomDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isZoomDropdownOpen && (
            <div className="absolute bottom-full mb-1 right-0 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[80px]">
              {zoomOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setZoom(option);
                    setIsZoomDropdownOpen(false);
                  }}
                  className={`w-full text-left rounded-md px-2.5 py-1.5 text-xs hover:bg-accent first:rounded-t-md last:rounded-b-md ${
                    zoom === option
                      ? "bg-primary/10 text-primary"
                      : "text-popover-foreground"
                  }`}
                >
                  {option}%
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-border" />

        {/* Save Status */}
        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
          <Check size={12} />
          <span>Saved</span>
        </div>
      </div>
    </div>
  );
}
