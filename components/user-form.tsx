import React from "react";

interface UserFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  isCreateMode: boolean;
  lastName: string;
  setLastName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isStudent: boolean;
  setIsStudent: (value: boolean) => void;
  onNext: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  firstName,
  setFirstName,
  isCreateMode,
  lastName,
  setLastName,
  username,
  setUsername,
  password,
  setPassword,
  isStudent,
  setIsStudent,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Username</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          pattern="[^@]+\.[^@]+"
          title="Must contain a dot (.)"
        />
      </div>
      {isCreateMode && (
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="border rounded w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            maxLength={20}
            title="Must be between 6 and 20 characters long"
            required
          />
        </div>
      )}
      <div>
        <label className="block mb-1 font-medium">User Type</label>
        <select
          className="border rounded w-full p-2"
          value={isStudent ? "student" : "staff"}
          onChange={(e) => setIsStudent(e.target.value === "student")}
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-[#2E6B39] text-white py-2 px-4 rounded hover:bg-[#3D8F4C]"
      >
        Next
      </button>
    </form>
  );
};

export default UserForm;
