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
  const [studentClass, setStudentClass] = useState("na");
  const [staffRole, setStaffRole] = useState("na");
  const [activeTermAndSession, setActiveTermAndSession] = useState("na");

  useEffect(() => {
    if (session && session.user) {
      setStudentClass(session.user.studentClass);
      setStaffRole(session.user.staffRole);
    }
  }, [session]);

  // Check if session is loaded and if user data exists
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <p>User not logged in.</p>;
  }

  // Now safely access session.user.firstName
  const userName = session.user.firstName;

  const userType = session.user.isStudent
    ? `STUDENT | ${studentClass.toUpperCase()}`
    : staffRole.toUpperCase();
  return (
    <div className="p-[15px] lg:px-[25px] flex gap-[15px] lg:gap-[25px] items-center text-[#2E3830] bg-white fixed w-full h-[60px] shadow-lg ">
      <button onClick={toggleNav} className="text-[#2E3830] focus:outline-none">
        {isNavOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3">
          <div className="hidden md:block">
            <Image
              src="/dfc-logo.jpg"
              width={30}
              height={30}
              alt="An img of the school logo"
              className=""
            />
          </div>
          <p className="hidden md:block md:text-[15px] font-medium">
            DIVINE FULFILMENT COLLEGE, OTA
          </p>
        </div>

        <div>
          <p className="text-[10px] md:text-[12px] font-medium">Active Term</p>
          <p className="text-[8px] md:text-[10px]">
            {activeTermAndSession.toUpperCase()}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center">
            <MdOutlinePerson2 size={30} />
            <MdOutlineArrowDropDown size={15} />
          </div>
          <div>
            <p className="text-[10px] md:text-[12px] font-medium">
              {userName.toUpperCase()}
            </p>
            <p className="text-[8px] md:text-[10px]">{userType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
