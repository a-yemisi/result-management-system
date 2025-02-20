import React, { useState, useEffect } from "react";
import type { Classes, SubClasses } from "@prisma/client";

interface StudentDetailsFormProps {
  studentDetails: {
    classId: number | null;
    subClassId: number | null;
    parentEmail: string | null;
  };
  setStudentDetails: (details: {
    classId: number | null;
    subClassId: number | null;
    parentEmail: string | null;
  }) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({
  studentDetails,
  setStudentDetails,
  onSubmit,
  onBack,
}) => {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [subClasses, setSubClasses] = useState<SubClasses[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState("");
  const [loadingSubClasses, setLoadingSubClasses] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const response = await fetch("/api/fetch-classes");
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setClasses(data.classes);
      } catch (error) {
        setError("Error fetching classes");
        console.error("Error fetching classes:", error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSubClasses = async () => {
      if (!studentDetails.classId) {
        setSubClasses([]); // Clear sub-classes if no class is selected
        return;
      }

      setLoadingSubClasses(true);
      try {
        const response = await fetch(
          `/api/fetch-subclasses?classId=${studentDetails.classId}`
        );
        if (!response.ok) throw new Error("Failed to fetch sub-classes");
        const data = await response.json();
        setSubClasses(data.subClasses);
      } catch (error) {
        setError("Error fetching sub-classes");
        console.error("Error fetching sub-classes:", error);
      } finally {
        setLoadingSubClasses(false);
      }
    };

    fetchSubClasses();
  }, [studentDetails.classId]); // Dependency added

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (error !== "") {
    alert(error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Class Selector */}
      <div>
        <label className="block mb-1 font-medium">Class</label>
        <select
          className="border rounded w-full p-2"
          value={studentDetails.classId || 0}
          onChange={(e) =>
            setStudentDetails({
              ...studentDetails,
              classId: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          required
        >
          <option value={0} disabled>
            -- Select your class --
          </option>
          {classes.map((classItem) => (
            <option key={classItem.class_id} value={classItem.class_id}>
              {classItem.class_name}
            </option>
          ))}
        </select>
        {loadingClasses && <p>Loading classes...</p>}
      </div>

      {/* Sub-Class ID */}
      <div>
        <label className="block mb-1 font-medium">Sub Class</label>
        <select
          className="border rounded w-full p-2"
          value={studentDetails.subClassId || 0}
          onChange={(e) =>
            setStudentDetails({
              ...studentDetails,
              subClassId: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          required
        >
          <option value={0} disabled>
            -- Select your sub class --
          </option>
          {subClasses.map((subClassItem) => (
            <option
              key={subClassItem.subclass_id}
              value={subClassItem.subclass_id}
            >
              {subClassItem.subclass_name}
            </option>
          ))}
        </select>
        {loadingSubClasses && <p>Loading sub classes...</p>}
      </div>

      {/* Parent Email */}
      <div>
        <label className="block mb-1 font-medium">Parent Email</label>
        <input
          type="email"
          className="border rounded w-full p-2"
          value={studentDetails.parentEmail || ""}
          onChange={(e) =>
            setStudentDetails({
              ...studentDetails,
              parentEmail: e.target.value,
            })
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-[#2E6B39] text-white py-2 px-4 rounded hover:bg-[#3D8F4C]"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default StudentDetailsForm;
