import React, { useState } from "react";

interface StaffDetailsFormProps {
  staffDetails: {
    hireDate: string;
    roles: number[];
  };
  setStaffDetails: (details: { hireDate: string; roles: number[] }) => void;
  availableRoles: { role_id: number; role_name: string }[];
  onSubmit: () => void;
  onBack: () => void;
}

const StaffDetailsForm: React.FC<StaffDetailsFormProps> = ({
  staffDetails,
  setStaffDetails,
  availableRoles,
  onSubmit,
  onBack,
}) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffDetails.roles.length === 0) {
      setMessage("Select teacher's roles");
      return;
    }
    setMessage("");
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Hire Date</label>
        <input
          type="date"
          className="border rounded w-full p-2"
          value={staffDetails.hireDate}
          onChange={(e) =>
            setStaffDetails({ ...staffDetails, hireDate: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Roles</label>
        {availableRoles.map((role) => (
          <div key={role.role_id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${role.role_id}`}
              checked={staffDetails.roles.includes(role.role_id)}
              onChange={(e) => {
                const newRoles = e.target.checked
                  ? [...staffDetails.roles, role.role_id]
                  : staffDetails.roles.filter((r) => r !== role.role_id);
                setStaffDetails({ ...staffDetails, roles: newRoles });
                setStaffDetails({ ...staffDetails, roles: newRoles });
                if (newRoles.length > 0) {
                  setMessage("");
                }
              }}
            />
            <label htmlFor={`${role.role_id}`}>{role.role_name}</label>
          </div>
        ))}
      </div>
      {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
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

export default StaffDetailsForm;
