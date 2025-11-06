"use client";

import { useRef, useState } from "react";

export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: -500, y: -500 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className={className}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary)/0.12), transparent 40%)`,
        }}
      />
    </div>
  );
}


