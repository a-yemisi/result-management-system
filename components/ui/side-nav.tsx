"use client";

import {
  HomeNavLink,
  RecordAcademicScoreNavLink,
  StudentSubjectNavLink,
  ViewResultNavLink,
  RecordNonAcademicScoreNavLink,
  StudentSubjectApprovalNavLink,
  DownloadStudentResultNavLink,
  GradesRangeNavLink,
  ApproveResultNavLink,
  UpdateStaffRolesNavLink,
  SignOutButton,
} from "@/components/ui/navigation-links";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SideNav() {
  const { data: session, status } = useSession();
  const [staffRolesNames, setStaffRolesNames] = useState<string[] | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffRoles = async () => {
      try {
        if (session?.user?.id) {
          const response = await fetch(
            `/api/fetch-staff-roles?userId=${session.user.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch staff roles");
          }
          const data = await response.json();
          setStaffRolesNames(data.roleNames);
        }
      } catch (err) {
        console.error("Error fetching staff roles:", err);
        setError("Failed to load staff roles");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchStaffRoles();
  }, [session]);

  if (status === "loading" || loadingRoles) {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <p>User not logged in.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!staffRolesNames) {
    return <p>Error: Unable to load roles data.</p>;
  }

  const isStudent = session.user.isStudent;
  const isTeacher = staffRolesNames.includes("Teacher");
  const isClassTeacher = staffRolesNames.includes("Class Teacher");
  const isPrincipal = staffRolesNames.includes("Principal");
  const isVicePrincipal = staffRolesNames.includes("Vice Principal");
  const isOwner = staffRolesNames.includes("Owner");
  const isAdministrator = staffRolesNames.includes("Administrator");

  return (
    <div className="relative">
      <div className="bg-white flex flex-col gap-2 w-[240px] fixed top-[60px]  left-0 h-full p-[15px] shadow-lg z-40">
        <p className="text-[11px] md:text-[13px] font-semibold text-[#5C7060] mb-1 mt-2">
          NAVIGATION
        </p>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2">
            <HomeNavLink />
            {isStudent && <StudentSubjectNavLink />}
            {isStudent && <ViewResultNavLink />}
            {isTeacher && <RecordAcademicScoreNavLink />}
            {isClassTeacher && <RecordNonAcademicScoreNavLink />}
            {(isClassTeacher || isVicePrincipal) && (
              <StudentSubjectApprovalNavLink />
            )}
            {(isClassTeacher || isVicePrincipal || isPrincipal) && (
              <DownloadStudentResultNavLink />
            )}
            {(isPrincipal || isOwner) && <GradesRangeNavLink />}
            {(isVicePrincipal || isPrincipal || isOwner) && (
              <ApproveResultNavLink />
            )}
            {(isVicePrincipal || isPrincipal || isOwner) && (
              <UpdateStaffRolesNavLink />
            )}
          </div>
          <div className="mb-[60px]">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
