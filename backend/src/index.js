import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import incidentRoutes from "./routes/incident.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Incident Tracker API running" });
});

app.use("/api/incidents", incidentRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
