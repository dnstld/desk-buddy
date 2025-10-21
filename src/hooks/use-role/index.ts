import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/src/lib/supabase";
import { UserRole } from "@/src/types/user";
import { useEffect, useState } from "react";

interface UseRoleReturn {
  isOwner: boolean;
  isManager: boolean;
  isMember: boolean;
  role: UserRole | null;
  loading: boolean;
}

export function useRole(): UseRoleReturn {
  const { user, session } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
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
          setRole(userData.role);
        } else {
          setRole(null);
        }
      } catch (error) {
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
