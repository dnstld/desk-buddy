import { useToast } from "@/providers/ToastProvider";
import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SetManagerParams {
  userId: string;
  companyId: string;
}

export function useSetManager() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async ({ userId, companyId }: SetManagerParams) => {
      const { data, error } = await supabase.functions.invoke(
        "set-company-manager",
        {
          body: { userId, companyId },
        }
      );

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to set manager");

      return data;
    },
    onSuccess: (_data, variables) => {
      showSuccess("Manager role assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.companyId] });
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to set manager");
    },
  });
}
