import React from "react";

export default function MessagesLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border pb-3 sm:pb-4">
        <div className="space-y-2 mb-4">
          <div className="h-8 sm:h-10 md:h-12 bg-muted rounded-lg w-1/2" />
          <div className="h-4 sm:h-5 bg-muted rounded-lg w-2/3" />
        </div>
      </div>

      {/* Messages Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="h-6 bg-muted rounded-lg w-1/3 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-xl border border-border bg-card"
            >
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-lg w-2/3" />
                <div className="h-3 bg-muted rounded-lg w-full" />
                <div className="h-3 bg-muted rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          <div className="p-4 sm:p-5 md:p-6 rounded-xl border border-border bg-card">
            <div className="space-y-6">
              {/* Header */}
              <div className="pb-3 sm:pb-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-muted rounded-lg w-1/2" />
                    <div className="h-4 bg-muted rounded-lg w-2/3" />
                  </div>
                  <div className="h-8 w-8 bg-muted rounded-lg" />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-lg w-1/4" />
                <div className="h-6 bg-muted rounded-lg w-3/4" />
              </div>

              {/* Date */}
              <div className="h-4 bg-muted rounded-lg w-1/3" />

              {/* Message Content */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-lg w-1/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-lg w-full" />
                  <div className="h-3 bg-muted rounded-lg w-full" />
                  <div className="h-3 bg-muted rounded-lg w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
