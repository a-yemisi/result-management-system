"use client";

import { useSession } from "next-auth/react";
import NotAllowed from "@/components/not-allowed";

export default function StudentSubject() {
  const { data: session, status } = useSession();
  const isStudent = session?.user.isStudent;

  if (!isStudent) return <NotAllowed />;
  return (
    <div>
      <h1>Students Subjects page</h1>
    </div>
  );
}
