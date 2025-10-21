import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";
import { useAuth } from "./AuthProvider";

interface UseRoleReturn {
  isOwner: boolean;
  isManager: boolean;
  isMember: boolean;
  role: "owner" | "manager" | "member" | null;
  loading: boolean;
}

export function useRole(): UseRoleReturn {
  const { user, session } = useAuth();
  const [role, setRole] = useState<"owner" | "manager" | "member" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user || !session) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data: userData, error } = await supabase
          .from("user")
          .select("role")
          .or(`id.eq.${user.id},auth_id.eq.${user.id}`)
          .single();

        if (error) {
          setRole(null);
          return;
        }

        if (userData?.role) {
          setRole(userData.role as "owner" | "manager" | "member");
        } else {
          setRole(null);
        }
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user, session]);

  const isOwner = role === "owner";
  const isManager = role === "manager";
  const isMember = role === "member";

  return {
    isOwner,
    isManager,
    isMember,
    role,
    loading,
  };
}
