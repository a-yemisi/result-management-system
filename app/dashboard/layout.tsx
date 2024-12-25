"use client";

import { useState, useEffect } from "react";
import SideNav from "@/components/ui/side-nav";
import Header from "@/components/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const updateNavState = () => {
    const isLargeScreen = window.matchMedia("(min-width: 768px)").matches; // md breakpoint
    setIsNavOpen(isLargeScreen);
  };

  useEffect(() => {
    // Check the screen size on initial render
    updateNavState();

    // Listen for screen size changes
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", updateNavState);

    return () => {
      mediaQuery.removeEventListener("change", updateNavState);
    };
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="bg-[#F1F4F6] h-screen">
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div
        className={`${isNavOpen ? "md:grid md:grid-cols-[240px_auto]" : ""}`}
      >
        <div className="">{isNavOpen && <SideNav />}</div>
        <div className="flex-1">
          <div className="h-[60px]"></div>
          <main className="">{children}</main>
        </div>
      </div>
    </div>
  );
}
