"use client";

import { useState } from "react";

export default function UserManagementPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          is_student: isStudent,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setMessage("User created successfully");
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      setMessage(err.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleCreateUser} className="space-y-4">
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
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="border rounded w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
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
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
