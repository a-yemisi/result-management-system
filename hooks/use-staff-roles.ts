import { useState, useEffect } from "react";

const useStaffRoles = (session: { user?: { id: string } } | null) => {
  const [staffRolesNames, setStaffRolesNames] = useState<string[] | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffRoles = async () => {
      if (!session?.user?.id) return; // Ensure session is valid

      try {
        const response = await fetch(
          `/api/fetch-staff-roles?userId=${session.user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch staff roles");
        }

        const data = await response.json();
        setStaffRolesNames(data.roleNames);
      } catch (err) {
        setError(`${err}`);
        console.error("Error fetching staff roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchStaffRoles();
  }, [session]);

  return { staffRolesNames, loadingRoles, error };
};

export default useStaffRoles;
