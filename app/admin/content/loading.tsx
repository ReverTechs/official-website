import React from "react";

export default function ContentLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border pb-3 sm:pb-4">
        <div className="space-y-2 mb-4">
          <div className="h-8 sm:h-10 md:h-12 bg-muted rounded-lg w-1/2" />
          <div className="h-4 sm:h-5 bg-muted rounded-lg w-2/3" />
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl overflow-hidden bg-card"
          >
            {/* Section Header */}
            <div className="p-4 sm:p-5 border-b flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 sm:h-6 bg-muted rounded-lg w-1/4" />
              </div>
              <div className="h-5 w-5 bg-muted rounded-lg flex-shrink-0" />
            </div>

            {/* Section Content (expanded state) */}
            <div className="p-4 sm:p-5 space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-muted rounded-lg w-1/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-lg w-full" />
                    <div className="h-3 bg-muted rounded-lg w-4/5" />
                  </div>
                </div>
              ))}
              <div className="h-10 bg-muted rounded-lg w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
