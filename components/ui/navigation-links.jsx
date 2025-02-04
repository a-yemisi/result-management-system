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
  MdOutlinePersonAddAlt,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

function NavLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 py-3 pl-4 rounded-lg text-sm md:text-base transition-all duration-200 ${
        isActive
          ? "bg-[#2E6B39] text-white shadow-md"
          : "text-[#333] hover:bg-[#D6F5DC] hover:text-green-700"
      }`}
    >
      <Icon size={22} className="min-w-[24px]" />
      <span>{label}</span>
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

export function UserManagement() {
  return (
    <NavLink
      href="/dashboard/user-management"
      icon={MdOutlinePersonAddAlt}
      label="User Management"
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
      className="flex items-center gap-3 py-3 pl-4 text-sm rounded-lg text-[#5C7060] hover:bg-[#D6F5DC] transition-all duration-200"
    >
      <MdExitToApp size={22} className="min-w-[24px]" /> Sign Out
    </button>
  );
}
