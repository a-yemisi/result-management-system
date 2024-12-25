"use client";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  const handleAlert = (message: string) => {
    alert(message);
  };
  return (
    <div className="relative h-screen bg-[#2E6B39]">
      <div className="absolute inset-0 bg-[url('/loginpage-bg.jpg')] bg-cover bg-center opacity-25"></div>
      <div className="relative z-10 grid h-full place-content-center">
        <LoginForm handleAlert={handleAlert} />
      </div>
    </div>
  );
}
