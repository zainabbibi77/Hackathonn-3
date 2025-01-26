// components/HeaderWrapper.tsx
"use client";  // This makes this a Client Component

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Check if we're in the Sanity Studio (adjust the path if needed)
  const isStudio = pathname?.startsWith("/studio");

  // Conditionally render Header
  if (isStudio) {
    return null; // Don't render the Header in the Studio
  }

  return <Header />;
}
