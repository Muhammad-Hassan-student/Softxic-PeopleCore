"use client";

import {
  CardSkeleton,
  FullPageLoader,
  HorizontalLoader,
  SkeletonLoader,
  TableSkeleton,
} from "@/components/ui/loaders/loading";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HorizontalLoader />
      <SkeletonLoader />
      <CardSkeleton />
      <TableSkeleton />
      {/* <FullPageLoader /> */}
    </div>
  );
}
