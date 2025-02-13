"use client";

import { useState, useEffect } from "react";
import { MdOutlineClose as CloseIcon } from "react-icons/md";
import UserForm from "@/components/user-form";
import StudentDetailsForm from "@/components/studentdetails-form";
import StaffDetailsForm from "@/components/staffdetails-form";
import type { Users, Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";

type FullUserFormProps = {
  onClose: () => void;
  isCreateMode: boolean;
  selectedUser?: Prisma.UsersGetPayload<{
    include: { StudentDetails: true; StaffDetails: true };
  }> | null;
};

export default function FullUserForm({
  onClose,
  isCreateMode,
  selectedUser,
}: FullUserFormProps) {
  const [staffRolesIDs, setStaffRolesIDs] = useState<number[]>([]);

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState(selectedUser?.first_name || "");
  const [lastName, setLastName] = useState(selectedUser?.last_name || "");
  const [username, setUsername] = useState(selectedUser?.username || "");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(selectedUser?.is_student ?? true);
  const [studentDetails, setStudentDetails] = useState({
    classId: selectedUser?.StudentDetails?.class_id || 0,
    subClassId: selectedUser?.StudentDetails?.subclass_id || 0,
    parentEmail: selectedUser?.StudentDetails?.parent_email || "",
  });
  const [staffDetails, setStaffDetails] = useState({
    hireDate: selectedUser?.StaffDetails?.hire_date || null,
    roles: staffRolesIDs || [],
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    const fetchStaffUserRoles = async () => {
      try {
        if (!selectedUser?.user_id || !selectedUser?.StaffDetails) {
          setStaffRolesIDs([]);
        } else {
          const response = await fetch(
            `/api/fetch-staff-roles?userId=${selectedUser.user_id}`
          );

          if (!response.ok) throw new Error("Failed to fetch roles");

          const data = await response.json();
          setStaffRolesIDs(data.roleIDs);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setMessage("Error fetching roles. Please try again later.");
      }
    };

    fetchStaffUserRoles();
  }, []);

  useEffect(() => {
    setStaffDetails((prevDetails) => ({
      ...prevDetails,
      roles: staffRolesIDs,
    }));
  }, [staffRolesIDs]);

  const handleSubmit = async () => {
    let finalBody;
    const userData = {
      username: username,
      password: password,
      is_student: isStudent,
      first_name: firstName,
      last_name: lastName,
    };
    if (isStudent) {
      const studentData = {
        parent_email: studentDetails.parentEmail,
        class_id: studentDetails.classId,
        subclass_id: Number(studentDetails.subClassId) || null,
      };
      finalBody = { ...userData, ...studentData };
    } else {
      const staffData = {
        hire_date: new Date(staffDetails.hireDate),
        staff_roles: staffDetails.roles,
      };
      finalBody = { ...userData, ...staffData };
    }

    try {
      if (isCreateMode) {
        const response = await fetch("/api/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalBody),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(`Failed to create new user: ${data.error}`);
        }
      } else {
        const userIDOnly = { user_id: selectedUser?.user_id };
        finalBody = { ...userIDOnly, ...finalBody };
        console.log(finalBody);
        const response = await fetch("/api/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalBody),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(`Failed to update user: ${data.error}`);
        }
      }
      onClose();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const goBack = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-lg shadow-lg relative w-full text-sm md:text-base lg:text-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base md:text-lg lg:text-xl font-semibold">
          {isCreateMode ? "Create User" : "Edit User"}
        </h1>
        <button className=" text-gray-600" onClick={onClose}>
          <CloseIcon size={20} />
        </button>
      </div>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {step === 1 && (
        <UserForm
          firstName={firstName}
          setFirstName={setFirstName}
          isCreateMode={isCreateMode}
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
