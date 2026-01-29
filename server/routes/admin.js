import { Router } from "express";
import { getAdminCredentials, signAdminToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { email: adminEmail, password: adminPassword } = getAdminCredentials();
  if (!adminEmail || !adminPassword) {
    return res.status(503).json({ error: "Admin login is not configured." });
  }
  if ((email || "").trim().toLowerCase() !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const token = signAdminToken(adminEmail);
  return res.json({
    token,
    admin: { email: adminEmail, name: "Admin", role: "admin", id: "admin" },
  });
});

export default router;
