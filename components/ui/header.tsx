"use client";

import {
  MdOutlinePerson2,
  MdOutlineArrowDropDown,
  MdOutlineMenu as MenuIcon,
  MdOutlineClose as CloseIcon,
} from "react-icons/md";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface HeaderProps {
  isNavOpen: boolean;
  toggleNav: () => void;
}

export default function Header({ isNavOpen, toggleNav }: HeaderProps) {
  const { data: session, status } = useSession();
  const [studentClass, setStudentClass] = useState("NA");
  const [staffRole, setStaffRole] = useState("NA");
  const [activeTermAndSession, setActiveTermAndSession] = useState("NA");

  useEffect(() => {
    if (session?.user) {
      setStudentClass(session.user.studentClass || "NA");
      setStaffRole(session.user.staffRole || "NA");
    }
  }, [session]);

  if (status === "loading") return <p className="text-center">Loading...</p>;
  if (!session?.user) return <p className="text-center">User not logged in.</p>;

  const userName = session.user.firstName || "User";
  const userType = session.user.isStudent
    ? `STUDENT | ${studentClass.toUpperCase()}`
    : staffRole.toUpperCase();

  return (
    <header className="p-4 lg:px-8 flex items-center text-[#2E3830] bg-white fixed w-full h-16 shadow-md">
      {/* Mobile Menu Toggle */}
      <button onClick={toggleNav} className="text-[#2E3830] focus:outline-none">
        {isNavOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      <div className="flex items-center justify-between w-full">
        {/* School Logo & Name */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Image
              src="/dfc-logo.jpg"
              width={35}
              height={35}
              alt="School Logo"
              className="rounded-md shadow-sm"
            />
          </div>
          <p className="hidden md:block text-base font-semibold tracking-wide">
            DIVINE FULFILMENT COLLEGE, OTA
          </p>
        </div>

        {/* Active Term & Session */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Active Term</p>
          <p className="text-xs font-semibold text-[#2E6B39] uppercase">
            {activeTermAndSession}
          </p>
        </div>

        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center cursor-pointer group">
            <MdOutlinePerson2 size={34} className="text-[#2E6B39]" />
            <MdOutlineArrowDropDown size={20} className="text-gray-500" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {userName.toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase">
              {userType}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
