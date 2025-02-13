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
  UserManagement,
} from "@/components/ui/navigation-links";
import { useSession } from "next-auth/react";
import useStaffRoles from "@/hooks/use-staff-roles";

export default function SideNav() {
  const { data: session, status } = useSession();
  const { staffRolesNames, loadingRoles, error } = useStaffRoles(session);

  if (status === "loading" || loadingRoles) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session || !session.user) {
    return <></>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!staffRolesNames) {
    return (
      <p className="text-red-500 text-center">
        Error: Unable to load roles data.
      </p>
    );
  }

  const isStudent = session.user.isStudent;
  const isTeacher = staffRolesNames.includes("Teacher");
  const isClassTeacher = staffRolesNames.includes("Class Teacher");
  const isPrincipal = staffRolesNames.includes("Principal");
  const isVicePrincipal = staffRolesNames.includes("Vice Principal");
  const isOwner = staffRolesNames.includes("Owner");
  const isAdministrator = staffRolesNames.includes("Administrator");

  return (
    <div
      className="flex-1 min-h-screen bg-white w-60 p-4 shadow-xl border-r border-gray-200 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-[64px]"></div>
      <div className="flex flex-col gap-4 flex-1">
        <p className="text-sm font-semibold text-gray-600 mb-3">NAVIGATION</p>
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-3 flex-1">
            <HomeNavLink />
            {isStudent && <StudentSubjectNavLink />}
            {isStudent && <ViewResultNavLink />}
            {isTeacher && <RecordAcademicScoreNavLink />}
            {isClassTeacher && <RecordNonAcademicScoreNavLink />}
            {(isClassTeacher || isVicePrincipal) && (
              <StudentSubjectApprovalNavLink />
            )}
            {(isClassTeacher ||
              isVicePrincipal ||
              isPrincipal ||
              isAdministrator) && <DownloadStudentResultNavLink />}
            {(isPrincipal || isOwner || isAdministrator) && (
              <GradesRangeNavLink />
            )}
            {(isVicePrincipal || isPrincipal || isOwner) && (
              <ApproveResultNavLink />
            )}
            {(isVicePrincipal || isPrincipal || isOwner || isAdministrator) && (
              <UpdateStaffRolesNavLink />
            )}
            {(isAdministrator || isOwner || isPrincipal || isVicePrincipal) && (
              <UserManagement />
            )}
          </div>
          <div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
