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

export default function SideNav() {
  const isStudent = true;
  const isTeacher = isStudent ? false : true;
  const isClassTeacher = isTeacher ? true : false;
  const isPrincipal = false;
  const isVicePrincipal = false;
  const isOwner = false;

  return (
    <div className="relative">
      <div className="bg-white flex flex-col gap-2 w-[240px] fixed top-[60px]  left-0 h-full p-[15px] shadow-lg z-40">
        <p className="text-[11px] md:text-[13px] font-semibold text-[#5C7060] mb-1 mt-2">
          NAVIGATION
        </p>
        <div className=" flex flex-col justify-between h-full">
          <div>
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
