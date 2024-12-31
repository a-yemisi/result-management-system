"use client";
import {
  MdOutlineCottage,
  MdOutlineLibraryBooks,
  MdOutlineBorderColor,
  MdOutlineChecklist,
  MdOutlineDonutSmall,
  MdOutlineDoneOutline,
  MdOutlineDownloadForOffline,
  MdOutlineHandyman,
  MdOutlineCloudDone,
  MdOutlineTipsAndUpdates,
  MdExitToApp,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

function NavLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClass =
    "flex gap-2 items-center w-full py-2 md:py-2.5 pl-2 md:pl-3 lg:pl-4 text-[11px] md:text-[12.5px] font-medium rounded-[8px]";
  const hoverClass = "text-white bg-[#2E6B39]";
  const defaultClass = "text-[#5C7060]  hover:bg-[#D6F5DC]";

  return (
    <Link
      href={href}
      className={`${baseClass} ${isActive ? hoverClass : defaultClass}`}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}

export function HomeNavLink() {
  return (
    <NavLink href="/dashboard/home" icon={MdOutlineCottage} label="Home" />
  );
}

export function StudentSubjectNavLink() {
  return (
    <NavLink
      href="/dashboard/student-subject"
      icon={MdOutlineLibraryBooks}
      label="Student Subjects"
    />
  );
}

export function ViewResultNavLink() {
  return (
    <NavLink
      href="/dashboard/view-result"
      icon={MdOutlineChecklist}
      label="View Result"
    />
  );
}

export function RecordAcademicScoreNavLink() {
  return (
    <NavLink
      href="/dashboard/record-academic-score"
      icon={MdOutlineBorderColor}
      label="Record Academic Scores"
    />
  );
}

export function RecordNonAcademicScoreNavLink() {
  return (
    <NavLink
      href="/dashboard/record-non-academic-score"
      icon={MdOutlineDonutSmall}
      label="Record Non Academic Scores"
    />
  );
}

export function StudentSubjectApprovalNavLink() {
  return (
    <NavLink
      href="/dashboard/student-subject-approval"
      icon={MdOutlineDoneOutline}
      label="Student Subject Approval"
    />
  );
}

export function DownloadStudentResultNavLink() {
  return (
    <NavLink
      href="/dashboard/download-student-result"
      icon={MdOutlineDownloadForOffline}
      label="Download Student Result"
    />
  );
}

export function GradesRangeNavLink() {
  return (
    <NavLink
      href="/dashboard/set-grades-range"
      icon={MdOutlineHandyman}
      label="Set Grades Range"
    />
  );
}

export function ApproveResultNavLink() {
  return (
    <NavLink
      href="/dashboard/approve-result"
      icon={MdOutlineCloudDone}
      label="Approve Term Result"
    />
  );
}

export function UpdateStaffRolesNavLink() {
  return (
    <NavLink
      href="/dashboard/update-staff-roles"
      icon={MdOutlineTipsAndUpdates}
      label="Update Staff Roles"
    />
  );
}

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex gap-2 items-center w-full py-2 md:py-2.5 pl-2 md:pl-3 lg:pl-4 text-[11px] md:text-[12px] font-medium rounded-[8px] text-[#5C7060] hover:bg-[#D6F5DC]"
    >
      <MdExitToApp size={20} /> Sign Out
    </button>
  );
}
