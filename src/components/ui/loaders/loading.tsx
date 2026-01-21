"use client";

import React, { useEffect, useState } from "react";

export function HorizontalLoader() {
  // Hydration fix: Pehle check karein ke component mount ho chuka hai
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[400px] h-2 bg-gray-200" />;

  return (
    <div className="w-[400px] h-2 bg-gray-200 overflow-hidden relative">
      <div
        className="absolute inset-0 bg-blue-600 animate-shimmer"
        style={{
          width: "50%",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />

      {/* CSS logic for the animation without styled-jsx */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </div>
  );
}

export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-300 rounded h-4 mb-2"></div>
      <div className="bg-gray-300 rounded h-4 w-3/4"></div>
    </div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {[...Array(6)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(6)].map((_, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Full Page Loader
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
