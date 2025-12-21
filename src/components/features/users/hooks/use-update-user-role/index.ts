import { useToast } from "@/providers/ToastProvider";
import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserRoleParams {
  userId: string;
  newRole: "member" | "manager";
}

interface UpdateUserRoleResponse {
  success: boolean;
  error?: string;
}

async function updateUserRole(
  params: UpdateUserRoleParams
): Promise<UpdateUserRoleResponse> {
  const { data, error } = await supabase.functions.invoke("update-user-role", {
    body: {
      userId: params.userId,
      newRole: params.newRole,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to update user role");
  }

  if (!data?.success) {
    throw new Error(data?.error || "Failed to update user role");
  }

  return data;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (_, variables) => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      const roleName = variables.newRole === "manager" ? "Manager" : "Member";
      showSuccess(`User role updated to ${roleName}`);
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to update user role");
    },
  });
}
