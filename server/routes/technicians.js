import { Router } from "express";
import bcrypt from "bcryptjs";
import * as db from "../db.js";
import * as mail from "../mail.js";
import { verifyTechnician, verifyAdmin, signTechnicianToken } from "../middleware/auth.js";

const router = Router();

function rowToTechnician(row) {
  const status = (row.status || "pending").toLowerCase();
  const verification_status = status === "approved" ? "verified" : status === "rejected" ? "rejected" : "pending";
  let specialties = [];
  let pricing = {};
  try {
    if (row.specialties) specialties = typeof row.specialties === "string" ? JSON.parse(row.specialties) : row.specialties;
  } catch {}
  try {
    if (row.pricing) pricing = typeof row.pricing === "string" ? JSON.parse(row.pricing) : row.pricing;
  } catch {}
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    address: row.address || "",
    region: row.region || "",
    district: row.district || "",
    state: row.state || "",
    locality: row.locality || "",
    serviceAreaRange: row.service_area_range ?? 0,
    experience: row.experience ?? 0,
    specialties: Array.isArray(specialties) ? specialties : [],
    pricing: pricing && typeof pricing === "object" ? pricing : {},
    verification_status,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, region, district, state, locality, serviceAreaRange, experience, specialties, pricing } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();
    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const service_type = Array.isArray(specialties) && specialties.length > 0 ? specialties[0] : "general";
    const location = (locality || address || "").trim() || "—";
    const specialtiesJson = JSON.stringify(Array.isArray(specialties) ? specialties : []);
    const pricingJson = JSON.stringify(pricing && typeof pricing === "object" ? pricing : {});

    await db.query(
      `INSERT INTO technicians (name, email, phone, service_type, location, status, password_hash, address, region, district, state, locality, service_area_range, experience, specialties, pricing)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trimmedName,
        normalizedEmail,
        (phone || "").trim(),
        service_type,
        location,
        password_hash,
        (address || "").trim(),
        (region || "").trim(),
        (district || "").trim(),
        (state || "").trim(),
        (locality || "").trim(),
        Number(serviceAreaRange) || 10,
        Number(experience) || 0,
        specialtiesJson,
        pricingJson,
      ]
    );
    const pool = await db.getPool();
    const [rows] = await pool.execute("SELECT LAST_INSERT_ID() AS id");
    const id = rows[0]?.id;
    try {
      await mail.sendMail({
        to: normalizedEmail,
        subject: "Application Received – ResQNow",
        html: `Hello ${trimmedName},<br><br>We have received your technician application. You will get a confirmation email once an admin reviews it.<br><br>Regards,<br>ResQNow Team`,
      });
    } catch (mailErr) {
      console.error("[Registration confirmation email failed]", mailErr?.message || mailErr);
    }
    return res.status(201).json({
      id: String(id),
      name: trimmedName,
      email: normalizedEmail,
      message: "Registered successfully. You will get a confirmation mail once admin reviews your application.",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY" || err.message?.includes("Duplicate")) {
      return res.status(409).json({ error: "This email is already registered. Please log in or use a different email." });
    }
    return res.status(500).json({ error: err.message || "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const rows = await db.query("SELECT * FROM technicians WHERE email = ? LIMIT 1", [normalizedEmail]);
    const row = rows[0];
    if (!row) {
      return res.status(401).json({ error: "Email not registered as a technician. Please use the technician registration page." });
    }
    const valid = await bcrypt.compare(password, row.password_hash || "");
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const status = (row.status || "pending").toLowerCase();
    if (status === "rejected") {
      return res.status(403).json({ error: "Your application was not approved. Please contact support for more information." });
    }
    if (status !== "approved") {
      return res.status(403).json({ error: "Your application is under review. You will receive an email after admin approval." });
    }
    const technician = rowToTechnician(row);
    const token = signTechnicianToken(row.id, row.email);
    return res.json({ token, technician });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Login failed." });
  }
});

router.get("/me", verifyTechnician, async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM technicians WHERE id = ? LIMIT 1", [req.technicianId]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "Technician not found." });
    return res.json(rowToTechnician(row));
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch profile." });
  }
});

router.get("/pending", verifyAdmin, async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM technicians WHERE status = 'pending' ORDER BY created_at DESC");
    return res.json(rows.map(rowToTechnician));
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch applications." });
  }
});

router.get("/list", verifyAdmin, async (req, res) => {
  try {
    const status = (req.query.status || "").toLowerCase();
    let rows;
    if (status === "pending" || status === "approved" || status === "rejected") {
      rows = await db.query("SELECT * FROM technicians WHERE status = ? ORDER BY created_at DESC", [status]);
    } else {
      rows = await db.query("SELECT * FROM technicians ORDER BY created_at DESC");
    }
    return res.json(rows.map(rowToTechnician));
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch technicians." });
  }
});

router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query("SELECT * FROM technicians WHERE id = ? LIMIT 1", [id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: "Technician not found." });
    return res.json(rowToTechnician(row));
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch technician." });
  }
});

router.patch("/:id/approve", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await db.getPool();
    const [rows] = await pool.execute("UPDATE technicians SET status = 'approved' WHERE id = ?", [id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: "Technician not found." });
    }
    const techRows = await db.query("SELECT name, email FROM technicians WHERE id = ?", [id]);
    const tech = techRows[0];
    if (tech?.email) {
      try {
        await mail.sendMail({
          to: tech.email,
          subject: "Application Approved – ResQNow",
          html: `Hello ${tech.name || "there"},<br><br>Your technician application has been approved.<br>You can now log in to the ResQNow Technician Portal.<br><br>Regards,<br>ResQNow Team`,
        });
      } catch (mailErr) {
        console.error("[Approval email failed]", mailErr?.message || mailErr);
      }
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to approve." });
  }
});

router.post("/create", verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, address, region, district, state, locality, serviceAreaRange, experience, specialties, pricing, status } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const trimmedName = (name || "").trim();
    if (!trimmedName || !normalizedEmail) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const tempPassword = password && String(password).length >= 8 ? password : null;
    const password_hash = tempPassword ? await bcrypt.hash(tempPassword, 10) : await bcrypt.hash("ChangeMe123!", 10);
    const service_type = Array.isArray(specialties) && specialties.length > 0 ? specialties[0] : "general";
    const location = (locality || address || "").trim() || "—";
    const specialtiesJson = JSON.stringify(Array.isArray(specialties) ? specialties : []);
    const pricingJson = JSON.stringify(pricing && typeof pricing === "object" ? pricing : {});
    const appStatus = status === "pending" ? "pending" : "approved";

    await db.query(
      `INSERT INTO technicians (name, email, phone, service_type, location, status, password_hash, address, region, district, state, locality, service_area_range, experience, specialties, pricing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trimmedName,
        normalizedEmail,
        (phone || "").trim(),
        service_type,
        location,
        appStatus,
        password_hash,
        (address || "").trim(),
        (region || "").trim(),
        (district || "").trim(),
        (state || "").trim(),
        (locality || "").trim(),
        Number(serviceAreaRange) || 10,
        Number(experience) || 0,
        specialtiesJson,
        pricingJson,
      ]
    );
    const pool = await db.getPool();
    const [rows] = await pool.execute("SELECT LAST_INSERT_ID() AS id");
    const id = rows[0]?.id;
    return res.status(201).json({ id: String(id), message: "Technician added successfully." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY" || err.message?.includes("Duplicate")) {
      return res.status(409).json({ error: "This email is already registered." });
    }
    return res.status(500).json({ error: err.message || "Failed to add technician." });
  }
});

router.patch("/:id/reject", verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await db.getPool();
    const [rows] = await pool.execute("UPDATE technicians SET status = 'rejected' WHERE id = ?", [id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ error: "Technician not found." });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to reject." });
  }
});

export default router;
