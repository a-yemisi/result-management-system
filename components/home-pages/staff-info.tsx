import { fetchData } from "next-auth/client/_utils";
import { useEffect, useState } from "react";

interface StaffInformationProps {
  isClassTeacher: boolean;
  staffFirstName: string;
  staffLastName: string;
  staffUserID: string;
}

export default function StaffInformation({
  isClassTeacher,
  staffFirstName,
  staffLastName,
  staffUserID,
}: StaffInformationProps) {
  // We need list of classes taking
  // const [classesTeaching, setClassesTeaching] = useState([]);
  // useEffect(() => {}, []);

  // We need list of subjects taking
  const [subjectsTaking, setSubjectsTaking] = useState([]);
  useEffect(() => {
    const fetchStaffSubjects = async () => {
      const res = await fetch(
        `/api/fetch-staff-subjects?userId=${staffUserID}`
      );
      if (!res.ok) throw new Error("Failed to fetch roles");
      const result = await res.json();
      setSubjectsTaking(result.subjectNames);
    };

    fetchStaffSubjects();
  }, []);

  console.log(subjectsTaking);

  return (
    <div className="bg-white p-6 w-full rounded-xl shadow-md border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        Staff Information
      </h2>

      {/* Teacher Profile Section */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 border-2 border-gray-400 rounded-full overflow-hidden">
          <img
            src="#"
            alt="Teacher Image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-800">
            {staffFirstName} {staffLastName}
          </p>

          {/* <div className="flex flex-wrap items-center gap-2 text-gray-700 text-sm">
            <span className="font-medium">Classes Teaching:</span>
            <span className="px-3 py-1 bg-gray-200 rounded-lg">JSS2</span>
            <span className="px-3 py-1 bg-gray-200 rounded-lg">SS2</span>
          </div> */}

          <div className="flex flex-wrap gap-2">
            {isClassTeacher && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                Class Teacher
              </span>
            )}
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg">
              Subject Teacher
            </span>
          </div>
        </div>
      </div>

      {/* Subjects Teaching */}
      <div className="mt-6">
        <p className="text-gray-700 font-medium mb-2">Subjects Teaching:</p>
        <ul className="text-gray-600 text-sm list-disc ml-5 space-y-1">
          {!subjectsTaking.length && <li>N/A</li>}
          {subjectsTaking.map((subject, index) => (
            <li key={index}>
              {subject.subject_name} [{subject.Classes.class_name}]
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button className="w-full bg-green-700 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition">
          Record Student's Result
        </button>
      </div>
    </div>
  );
}
