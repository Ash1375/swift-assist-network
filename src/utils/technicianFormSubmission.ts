import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
import { technicianAuthService } from "@/services/technicianAuthService";

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

export const submitTechnicianApplication = async (
  data: RegisterFormValues,
  _resumeFile: File | null,
  onSuccess: () => void
) => {
  try {
    const p: RegisterFormValues["pricing"] = data.pricing ?? {
      towing: 0, tireChange: 0, jumpStart: 0, fuelDelivery: 0, lockout: 0, winching: 0
    };
    const formattedPricing: Record<string, number> = {
      towing: toNumber(p.towing),
      tireChange: toNumber(p.tireChange),
      jumpStart: toNumber(p.jumpStart),
      fuelDelivery: toNumber(p.fuelDelivery),
      lockout: toNumber(p.lockout),
      winching: toNumber(p.winching)
    };

    await technicianAuthService.register(
      (data.name || "").trim(),
      (data.email || "").trim().toLowerCase(),
      data.password,
      (data.phone || "").trim(),
      (data.address || "").trim(),
      (data.region || "").trim(),
      (data.district || "").trim(),
      (data.state || "").trim(),
      (data.locality || "").trim(),
      toNumber(data.serviceAreaRange) || 10,
      toNumber(data.experience),
      Array.isArray(data.specialties) ? data.specialties : [],
      formattedPricing
    );

    toast.success("Registered successfully. You will get a confirmation mail once admin reviews your application.");
    onSuccess();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
    toast.error(message);
    throw error;
  }
};
