"use-client";

import { useState } from "react";

type FullUserFormProps = {
  onClose: () => void;
  isStudentToDeactivate: boolean;
  userIdToDeactivate: string;
};

export default function DeactivateUserModal({
  onClose,
  isStudentToDeactivate,
  userIdToDeactivate,
}: FullUserFormProps) {
  const [graduated, setGraduationStatus] = useState(false);

  const deactivateUser = async () => {
    try {
      const finalBody = {
        user_id: userIdToDeactivate,
        graduation_status: graduated,
      };
      const response = await fetch("/api/deactivate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalBody),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Failed to deactivate user: ${data.error}`);
      }
      onClose();
    } catch (error) {
      console.error(`Error: ${error}`);
      alert("Error deactivating user");
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-[350px]">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Deactivate User
      </h2>
      <p className="text-gray-600 mb-4">
        Are you sure you want to deactivate this user?
      </p>

      {isStudentToDeactivate && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={graduated}
            id="graduated"
            onChange={(e) => setGraduationStatus(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="graduated" className="text-gray-700">
            Student has graduated
          </label>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          onClick={deactivateUser}
        >
          Deactivate
        </button>
      </div>
    </div>
  );
}
