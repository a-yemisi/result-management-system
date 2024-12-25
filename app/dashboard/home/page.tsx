import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You must log in to access this page.</p>;
  }
  return (
    <div>
      <h1>Home page</h1>
    </div>
  );
}
