import { toast } from "@/components/ui/sonner";
import { RegisterFormValues } from "@/types/technician-registration";
import { resumeService } from "@/services/resumeService";

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

export const submitTechnicianApplication = async (
  data: RegisterFormValues,
  resumeFile: File | null,
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    region: string,
    district: string,
    state: string,
    locality: string,
    serviceAreaRange: number,
    experience: number,
    specialties: string[],
    pricing: Record<string, number>
  ) => Promise<unknown>,
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

    const technician = await register(
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

    if (resumeFile && technician && typeof technician === "object" && "id" in technician) {
      try {
        await resumeService.uploadResume((technician as { id: string }).id, resumeFile);
      } catch (uploadErr) {
        console.warn("[TechnicianRegister] Resume upload failed (registration succeeded):", uploadErr);
        toast.warning("Registration successful, but document upload failed. You can add it later.");
      }
    }

    toast.success("Registered successfully. You will receive an email after admin approval.");
    onSuccess();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
    console.error("[TechnicianRegister] Submission error:", error);
    toast.error(message);
  }
};
