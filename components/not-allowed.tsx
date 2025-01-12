import Link from "next/link";

export default function NotAllowed() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-2">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-[35vh]">
        Not Allowed!
      </h1>
      <p className="mt-2 text-gray-600 text-center text-sm md:text-base lg:text-lg">
        Oops! You are not allowed to access this page!
      </p>
      <Link
        href="/dashboard/home"
        className="mt-4 px-6 py-2 text-sm md:text-base lg:text-lg text-white bg-[#2E6B39] rounded hover:bg-[#3D8F4C]"
      >
        Go Back Home
      </Link>
    </div>
  );
}
