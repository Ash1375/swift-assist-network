const BASE = import.meta.env.VITE_API_URL || "";

export function getTechnicianToken(): string | null {
  return localStorage.getItem("resqnow_technician_token");
}

export function getAdminToken(): string | null {
  return localStorage.getItem("resqnow_admin_token");
}

export async function apiFetch(
  path: string,
  options: RequestInit & { admin?: boolean; technician?: boolean } = {}
): Promise<Response> {
  const { admin, technician, headers = {}, ...rest } = options;
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  if (admin) {
    const t = getAdminToken();
    if (t) h.set("Authorization", `Bearer ${t}`);
  }
  if (technician) {
    const t = getTechnicianToken();
    if (t) h.set("Authorization", `Bearer ${t}`);
  }
  return fetch(`${BASE}${path}`, { ...rest, headers: h });
}

export function setTechnicianToken(token: string | null) {
  if (token) localStorage.setItem("resqnow_technician_token", token);
  else localStorage.removeItem("resqnow_technician_token");
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem("resqnow_admin_token", token);
  else localStorage.removeItem("resqnow_admin_token");
}
