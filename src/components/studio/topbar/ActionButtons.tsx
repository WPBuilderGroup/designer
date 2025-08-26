"use client";

import { Undo, Redo, Eye, Code, Rocket } from "lucide-react";

interface ActionButtonsProps {
  onPublish?: () => void;
}

export default function ActionButtons({ onPublish }: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Undo/Redo */}
      <button
        className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Undo last action"
        title="Undo"
      >
        <Undo size={16} aria-hidden="true" />
      </button>
      <button
        className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Redo last undone action"
        title="Redo"
      >
        <Redo size={16} aria-hidden="true" />
      </button>

      <div
        className="w-px h-6 bg-border mx-2"
        role="separator"
        aria-orientation="vertical"
      />

      {/* Preview/Code */}
      <button
        className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Preview design"
        title="Preview"
      >
        <Eye size={16} aria-hidden="true" />
      </button>
      <button
        className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="View code"
        title="Code"
      >
        <Code size={16} aria-hidden="true" />
      </button>

      <div
        className="w-px h-6 bg-border mx-2"
        role="separator"
        aria-orientation="vertical"
      />

      {/* Publish Button */}
      <button
        onClick={onPublish}
        className="flex items-center space-x-2 rounded-md px-2.5 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Publish project"
      >
        <Rocket size={16} aria-hidden="true" />
        <span>Publish</span>
      </button>
    </div>
  );
}
