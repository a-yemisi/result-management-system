"use client";

import { useSession } from "next-auth/react";
import NotAllowed from "@/components/not-allowed";
import StudentInformation from "@/components/home-pages/student";
import Tabs from "@/components/ui/tabbed-interface";
import useStaffRoles from "@/hooks/use-staff-roles";
import StaffInformation from "@/components/home-pages/staff-info";

export default function HomePage() {
  const { data: session, status } = useSession();
  const { staffRolesNames, loadingRoles, error } = useStaffRoles(session);
  if (!session) {
    return <NotAllowed />;
  }

  if (loadingRoles) {
    return <p className="text-center text-gray-500">Loading...</p>;
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

  const isStudent = session.user?.isStudent;
  const userFirstName = session.user?.firstName;
  const userLastName = session.user?.lastName;
  const userID = session.user?.id;
  const isTeacher = staffRolesNames.includes("Teacher");
  const isClassTeacher = staffRolesNames.includes("Class Teacher");
  const isPrincipal = staffRolesNames.includes("Principal");
  const isVicePrincipal = staffRolesNames.includes("Vice Principal");
  const isOwner = staffRolesNames.includes("Owner");
  const isAdministrator = staffRolesNames.includes("Administrator");

  return (
    <div className="p-3 md:p-4 lg:p-5 grid gap-6">
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
        Home page
      </h1>
      <div className="grid lg:grid-cols-[2fr_1.5fr] gap-5 lg:gap-10">
        {isStudent && (
          <StudentInformation
            studentUserID={userID}
            studentFirstName={userFirstName}
            studentLastName={userLastName}
          />
        )}
        {isTeacher && (
          <StaffInformation
            isClassTeacher={isClassTeacher}
            staffFirstName={userFirstName}
            staffLastName={userLastName}
            staffUserID={userID}
          />
        )}
        <Tabs />
        {isClassTeacher && <p>Students Overview goes here...</p>}
      </div>
    </div>
  );
}
