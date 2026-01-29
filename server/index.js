import "./loadEnv.js";

import express from "express";
import cors from "cors";
import techniciansRouter from "./routes/technicians.js";
import adminRouter from "./routes/admin.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/technicians", techniciansRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  try {
    const { ensureTechniciansTable } = await import("./db.js");
    await ensureTechniciansTable();
  } catch (err) {
    console.error("DB init:", err?.message || err);
  }
  console.log(`Server listening on port ${PORT}`);
});
