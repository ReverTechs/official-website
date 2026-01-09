import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="space-y-3">
          <div className="h-8 sm:h-10 md:h-12 bg-muted rounded-lg w-3/4" />
          <div className="h-4 sm:h-5 bg-muted rounded-lg w-1/2" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 md:p-6 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 bg-muted rounded-lg" />
              <div className="h-6 sm:h-7 md:h-8 w-12 bg-muted rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 sm:h-4 bg-muted rounded-lg w-2/3" />
              <div className="h-2 sm:h-3 bg-muted rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-6 md:p-8 rounded-xl border border-border bg-card"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 sm:h-6 bg-muted rounded-lg w-2/3" />
                  <div className="h-3 sm:h-4 bg-muted rounded-lg w-full" />
                  <div className="h-3 sm:h-4 bg-muted rounded-lg w-5/6" />
                </div>
                <div className="h-5 w-5 sm:h-6 sm:w-6 bg-muted rounded-lg flex-shrink-0 ml-2" />
              </div>
              <div className="h-9 sm:h-10 bg-muted rounded-lg w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
