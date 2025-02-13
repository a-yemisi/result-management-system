"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import this hook
import SideNav from "@/components/ui/side-nav";
import Header from "@/components/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname(); // Get the current URL path
  const [isLargeScreen, setLargeScreen] = useState(false); // md breakpoint

  const updateNavState = () => {
    setLargeScreen(window.matchMedia("(min-width: 768px)").matches);
    setIsNavOpen(isLargeScreen);
  };

  useEffect(() => {
    updateNavState(); // Set initial state based on screen size

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", updateNavState);

    return () => {
      mediaQuery.removeEventListener("change", updateNavState);
    };
  }, []);

  // Reset nav when the pathname changes (new page loaded)
  useEffect(() => {
    updateNavState(); // Reset to default behavior
  }, [pathname]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className=" bg-[#F1F4F6] ">
      <div className="relative z-50">
        <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      </div>
      <div
        className={` ${isNavOpen ? "md:grid md:grid-cols-[240px_auto]" : ""}`}
      >
        {isNavOpen && (
          <div
            className={`${
              isLargeScreen
                ? ""
                : "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-40"
            }`}
            onClick={() => {
              console.log("Closeing nav barr...");
              setIsNavOpen(false);
            }}
          >
            <div>
              <SideNav />
            </div>
          </div>
        )}
        <div className="flex-1 min-h-screen ">
          <div className="h-[60px]"></div>
          <main className="p-3 ">{children}</main>
        </div>
      </div>
    </div>
  );
}
