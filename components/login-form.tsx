"use client";
import { MdOutlinePerson, MdOutlineKey, MdChevronRight } from "react-icons/md";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({
  handleAlert,
}: {
  handleAlert: (message: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before starting the login process

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Disable automatic redirect
      callbackUrl: "/dashboard/home",
    });

    // Check if login failed and display error
    if (result?.error) {
      setErrorMessage("Incorrect username or password");
    } else {
      setErrorMessage("");
    }

    if (result?.ok) {
      router.push(result.url || "/dashboard/home");
    }

    setLoading(false); // Set loading to false after the process is done
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
        />
        <h1 className="font-semibold text-[16px] text-[#061309]">
          DFC RESULT PORTAL
        </h1>
      </div>
      <div className="flex flex-col gap-[12px] text-[12px]">
        <p className="font-medium">Enter your username and password</p>

        <div>
          <label htmlFor="username">Username</label>
          <div className="relative w-full mt-[10px]">
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

      {/* Display the error message here if there's an incorrect login */}
      {errorMessage && (
        <p className="text-red-500 text-[12px] mt-2">{errorMessage}</p>
      )}

      <div
        className="mt-[13px] text-[12px] font-medium hover:text-[#2E6B39] hover:cursor-pointer"
        onClick={() => handleAlert("Contact your administrator")}
      >
        <p>Forgot password?</p>
      </div>

      {/* Loading Spinner or Text */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-[4px] border-solid border-[#2E6B39] border-t-transparent rounded-full" />
          <p className="ml-2 text-[#2E6B39]">Loading...</p>
        </div>
      )}

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
