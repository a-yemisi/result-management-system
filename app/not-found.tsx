import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
        Page Not Found
      </h1>
      <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        href="/dashboard/home"
        className="mt-4 px-6 py-2 text-white bg-[#2E6B39] rounded hover:bg-[#3D8F4C] text-sm md:text-base lg:text-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}
