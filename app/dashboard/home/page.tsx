"use client";

import { useSession } from "next-auth/react";
import NotAllowed from "@/components/not-allowed";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (!session) {
    return <NotAllowed />;
  }

  return (
    <div>
      <h1>Home page</h1>
    </div>
  );
}
