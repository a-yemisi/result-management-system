"use client";

import { useState, useEffect } from "react";
import UserForm from "@/components/user-form";
import StudentDetailsForm from "@/components/studentdetails-form";
import StaffDetailsForm from "@/components/staffdetails-form";
import { useSession } from "next-auth/react";
import useStaffRoles from "@/hooks/use-staff-roles";
import NotAllowed from "@/components/not-allowed";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const { staffRolesNames } = useStaffRoles(session);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const [studentDetails, setStudentDetails] = useState({
    classId: 0,
    subClassId: 0,
    parentEmail: "",
  });
  const [staffDetails, setStaffDetails] = useState({
    hireDate: "",
    roles: [],
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [message, setMessage] = useState("");

  const isPrincipal = staffRolesNames?.includes("Principal");
  const isVicePrincipal = staffRolesNames?.includes("Vice Principal");
  const isOwner = staffRolesNames?.includes("Owner");
  const isAdministrator = staffRolesNames?.includes("Administrator");

  if (!(isPrincipal || isVicePrincipal || isOwner || isAdministrator))
    return <NotAllowed />;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/available-roles"); // Adjust the API endpoint to match your backend route
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setAvailableRoles(data.roles); // Assuming the response contains a `roles` array
      } catch (error) {
        console.error("Error fetching roles:", error);
        setMessage("Error fetching roles. Please try again later.");
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = () => {
    console.log({
      firstName,
      lastName,
      username,
      password,
      isStudent,
      details: isStudent ? studentDetails : staffDetails,
    });
  };

  const goBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 text-sm">
      <h1 className="text-base font-bold mb-6">User Management</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      {step === 1 && (
        <UserForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          isStudent={isStudent}
          setIsStudent={setIsStudent}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && isStudent && (
        <StudentDetailsForm
          studentDetails={studentDetails}
          setStudentDetails={setStudentDetails}
          onSubmit={handleSubmit}
          onBack={goBack}
        />
      )}
      {step === 2 && !isStudent && (
        <StaffDetailsForm
          staffDetails={staffDetails}
          setStaffDetails={setStaffDetails}
          availableRoles={availableRoles}
          onSubmit={handleSubmit}
          onBack={goBack}
        />
      )}
    </div>
  );
}
