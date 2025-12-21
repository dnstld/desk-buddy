import { useToast } from "@/providers/ToastProvider";
import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteUserParams {
  userId: string;
  companyId: string;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ userId }: DeleteUserParams) => {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });

      if (error) throw error;
      if (!data?.success)
        throw new Error(data?.error || "Failed to delete user");

      return data;
    },
    onSuccess: (_data, variables) => {
      showSuccess("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({
        queryKey: ["users", variables.companyId],
      });
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to delete user");
    },
  });
}
