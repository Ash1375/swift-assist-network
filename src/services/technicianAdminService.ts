import { apiFetch } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const BASE = "/api/technicians";

export const technicianAdminService = {
  approveTechnician: async (technicianId: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`${BASE}/${technicianId}/approve`, {
        method: "PATCH",
        admin: true,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || "Failed to approve technician");
        return false;
      }
      return true;
    } catch {
      toast.error("Failed to approve technician");
      return false;
    }
  },

  rejectTechnician: async (technicianId: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`${BASE}/${technicianId}/reject`, {
        method: "PATCH",
        admin: true,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || "Failed to reject technician");
        return false;
      }
      return true;
    } catch {
      toast.error("Failed to reject technician");
      return false;
    }
  },
};
