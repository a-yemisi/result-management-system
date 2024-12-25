"use client";
import { MdOutlinePerson, MdOutlineKey, MdChevronRight } from "react-icons/md";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm({
  handleAlert,
}: {
  handleAlert: (message: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: true, // Redirect after login
      callbackUrl: "/dashboard/home", // Redirect to home
    });
    console.log(result);
  };
  return (
    <form
      className="border-2 rounded-[8px] p-[20px] min-w-[270px] w-[40vw] max-w-[370px] bg-white text-[#2E3830]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center my-[15px] gap-[5px]">
        <Image
          src="/dfc-logo.jpg"
          width={60}
          height={60}
          alt="An img of the school logo"
        ></Image>
        <h1 className="font-semibold text-[16px] text-[#061309]">
          DFC RESULT PORTAL
        </h1>
      </div>
      <div className="flex flex-col gap-[12px] text-[12px]">
        <p className="font-medium">Enter your username and password</p>

        <div>
          <label htmlFor="username">Username</label>
          <div className="relative w-full  mt-[10px]">
            <MdOutlinePerson
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter your username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-8 pr-2 py-1 border rounded-md w-full focus:outline-none focus:shadow-lg focus:ring-1 focus:ring-[#2E6B39]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="relative w-full mt-[10px]">
            <MdOutlineKey
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-8 pr-2 py-1 border rounded-md w-full focus:outline-none focus:shadow-lg focus:ring-1 focus:ring-[#2E6B39]"
            />
          </div>
        </div>
      </div>

      <div
        className="mt-[13px] text-[12px] font-medium hover:text-[#2E6B39] hover:cursor-pointer"
        onClick={() => handleAlert("Contact your adminstrator")}
      >
        <p>Forgot password?</p>
      </div>

      <div className="flex flex-col items-end">
        <button
          type="submit"
          className="flex gap-2 items-center bg-[#2E6B39] text-white px-[20px] py-[6px] justify-center rounded-[8px] mt-[15px] text-[12px] font-medium hover:bg-[#3D8F4C]"
        >
          Login <MdChevronRight color="white" />
        </button>
      </div>
    </form>
  );
}
