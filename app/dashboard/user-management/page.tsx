"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import useStaffRoles from "@/hooks/use-staff-roles";
import NotAllowed from "@/components/not-allowed";
import type { Users, Prisma, Classes } from "@prisma/client";
import { fetchClasses } from "@/hooks/get-all-classes";
import {
  MdOutlineDiversity3,
  MdOutlineSchool,
  MdOutlineDiversity1,
  MdOutlineCreate,
  MdOutlineDeleteForever,
  MdOutlinePersonAddAlt,
} from "react-icons/md";
import FullUserForm from "@/components/full-user-form";
import DeactivateUserModal from "@/components/deactivate-user-modal";

export default function UserManagementPage() {
  const { data: session } = useSession();
  const { staffRolesNames } = useStaffRoles(session);
  const [counts, setCounts] = useState({
    usersCount: 0,
    studentsCount: 0,
    staffsCount: 0,
  });

  const [users, setUsers] = useState<
    Prisma.UsersGetPayload<{
      include: {
        StudentDetails: true;
        StaffDetails: true;
      };
    }>[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivatedModalOpen] = useState(false);
  const [userIdToDeactivate, setUserIdToDeactivate] = useState("");
  const [isStudentToDeactivate, setIsStudentToDeactivate] = useState(true);
  const [selectedEditUser, setSelectedEditUser] =
    useState<Prisma.UsersGetPayload<{
      include: {
        StudentDetails: true;
        StaffDetails: true;
      };
    }> | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [toFilterIsStudent, setToFilterIsStudent] = useState<boolean>();
  const [toFilterClassID, setToFilterClassID] = useState<number>();
  const [toShowAllUserType, setToShowAllUserType] = useState<boolean>();
  const [toShowAllStudents, setToShowAllStudents] = useState<boolean>();
  // const [selectedClassID, setSelectedClassID] = useState<number>();
  const [classes, setClasses] = useState<Classes[]>([]);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/fetch-classes");
        const data = await response.json();
        setClasses(data.classes);
      } catch (error) {
        console.error(`Error fetching classes: ${error}`);
      }
    };
    fetchClasses();
  }, [fetchClasses]);

  const fetchData = useCallback(async () => {
    try {
      if (toShowAllUserType) setToFilterIsStudent(undefined);
      if (toShowAllStudents) setToFilterClassID(undefined);
      const fetchUsersParameters = {
        is_student: toFilterIsStudent,
        class_id: toFilterClassID,
      };
      const [countsResponse, usersResponse] = await Promise.all([
        fetch("/api/fetch-counts"),
        fetch("/api/fetch-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fetchUsersParameters),
        }),
      ]);

      if (!countsResponse.ok || !usersResponse.ok)
        throw new Error("Failed to fetch data");

      const countsData = await countsResponse.json();
      const usersData = await usersResponse.json();

      setCounts(countsData.counts);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [
    toFilterIsStudent,
    toFilterClassID,
    toShowAllStudents,
    toShowAllUserType,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function closeModal() {
    setIsModalOpen(false);
    setSelectedEditUser(null);
    fetchData();
  }

  function closeDeactivateModal() {
    setIsDeactivatedModalOpen(false);
    setUserIdToDeactivate("");
    fetchData();
  }

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const isAuthorized = [
    "Principal",
    "Vice Principal",
    "Owner",
    "Administrator",
  ].some((role) => staffRolesNames?.includes(role));
  if (!isAuthorized) return <NotAllowed />;

  return (
    session && (
      <div className="p-3 md:p-4 lg:p-5 grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
            User Management
          </h1>
          <button
            className="bg-green-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:bg-green-800"
            onClick={() => {
              setIsModalOpen(true);
              setIsCreateMode(true);
            }}
          >
            <MdOutlinePersonAddAlt size={24} />
            <span>Add User</span>
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-50"
            onClick={() => closeModal()}
          >
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-2xl z-50 w-[90%] max-w-[350px] md:max-w-[400px] lg:max-w-[450px]"
              onClick={(e) => e.stopPropagation()}
            >
              <FullUserForm
                onClose={() => closeModal()}
                selectedUser={selectedEditUser}
                isCreateMode={isCreateMode}
              />
            </div>
          </div>
        )}

        {/* Deactivate User Modal */}
        {isDeactivateModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-50"
            onClick={() => closeDeactivateModal()}
          >
            <div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-2xl z-50 w-[90%] max-w-[350px] md:max-w-[400px] lg:max-w-[450px]"
              onClick={(e) => e.stopPropagation()}
            >
              <DeactivateUserModal
                onClose={closeDeactivateModal}
                isStudentToDeactivate={isStudentToDeactivate}
                userIdToDeactivate={userIdToDeactivate}
              />
            </div>
          </div>
        )}

        {/* Count Cards */}
        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-3">
          {[
            {
              label: "Total Users",
              count: counts.usersCount,
              icon: (
                <MdOutlineDiversity3 size={30} className="text-green-700" />
              ),
            },
            {
              label: "Staff Users",
              count: counts.staffsCount,
              icon: (
                <MdOutlineDiversity1 size={30} className="text-green-700" />
              ),
            },
            {
              label: "Student Users",
              count: counts.studentsCount,
              icon: <MdOutlineSchool size={30} className="text-green-700" />,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 bg-white border-l-4 border-green-700 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.label}
                </p>
                <h1 className="text-2xl font-bold text-gray-900">
                  {item.count}
                </h1>
              </div>
              {item.icon}
            </div>
          ))}
        </div>

        {/* Filter Users */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Users
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* User Type Filter */}
            <div className="flex flex-col">
              <label htmlFor="user-type" className="text-gray-600 text-sm mb-1">
                User Type
              </label>
              <select
                id="user-type"
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={
                  toShowAllUserType
                    ? "all"
                    : toFilterIsStudent == undefined
                    ? ""
                    : toFilterIsStudent
                    ? "student"
                    : "staff"
                }
                onChange={(e) => {
                  const value = e.target.value;

                  setToShowAllUserType(value === "all");
                  setToFilterIsStudent(
                    value === "student"
                      ? true
                      : value === "staff"
                      ? false
                      : undefined
                  );
                }}
              >
                <option value="" disabled>
                  -- Select User Type --
                </option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* Student Class Filter (Conditional) */}
            {toFilterIsStudent && (
              <div className="flex flex-col">
                <label
                  htmlFor="student-class"
                  className="text-gray-600 text-sm mb-1"
                >
                  By Student Class
                </label>
                <select
                  id="student-class"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={
                    toShowAllStudents
                      ? "all"
                      : toFilterClassID == undefined
                      ? ""
                      : toFilterClassID
                  }
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "all") {
                      setToShowAllStudents(true);
                      setToFilterClassID(undefined);
                    } else {
                      setToShowAllStudents(false);
                      setToFilterClassID(Number(value));
                    }
                  }}
                >
                  <option value="" disabled>
                    -- Select Class --
                  </option>
                  {classes.map((classItem) => (
                    <option key={classItem.class_id} value={classItem.class_id}>
                      {classItem.class_name}
                    </option>
                  ))}
                  <option value="all">All</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="text-white bg-green-700">
              <tr>
                <th className="py-3 px-5">S/N</th>
                <th className="py-3 px-5">First Name</th>
                <th className="py-3 px-5">Last Name</th>
                <th className="py-3 px-5">User Type</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {displayedUsers.map((user, index) => (
                <tr key={user.user_id} className="border-t border-gray-200">
                  <td className="py-3 px-5">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-5">{user.first_name}</td>
                  <td className="py-3 px-5">{user.last_name}</td>
                  <td className="py-3 px-5">
                    {user.is_student ? "Student" : "Staff"}
                  </td>
                  <td className="py-3 px-5 flex justify-center gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsCreateMode(false);
                        setSelectedEditUser(user);
                      }}
                    >
                      <MdOutlineCreate size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setIsDeactivatedModalOpen(true);
                        setUserIdToDeactivate(user.user_id);
                        setIsStudentToDeactivate(
                          user.is_student ? true : false
                        );
                      }}
                    >
                      <MdOutlineDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-green-100  text-green-700 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    )
  );
}
