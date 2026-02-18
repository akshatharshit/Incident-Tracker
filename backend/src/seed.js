import dotenv from "dotenv";
import mongoose from "mongoose";
import Incident from "./models/Incident.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const services = [
  "Payments",
  "Auth",
  "API Gateway",
  "Search",
  "Database",
  "Notifications",
  "Analytics",
  "Orders",
  "Billing",
];

const titles = [
  "API Timeout",
  "High Latency",
  "Database Connection Error",
  "Payment Failure",
  "Service Crash",
  "Memory Leak",
  "Login Issue",
  "500 Errors Spike",
  "Queue Backlog",
  "Cache Miss Storm",
];

const summaries = [
  "Customers reported intermittent failures in production.",
  "Observed elevated response times in multiple regions.",
  "Service health checks failing under load.",
  "Incident triggered by a new deployment.",
  "Root cause suspected to be database saturation.",
  "Temporary mitigation applied by scaling instances.",
];

const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
const statuses = ["OPEN", "MITIGATED", "RESOLVED"];

const owners = ["Akshat", "Ravi", "Priya", "Neha", "Arjun", "Sahil", ""];

// random helper
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const runSeed = async () => {
  await connectDB(process.env.MONGO_URI);

  console.log("🧹 Clearing old incidents...");
  await Incident.deleteMany({});

  console.log("🌱 Seeding 200 incidents...");
  const data = [];

  for (let i = 0; i < 200; i++) {
    data.push({
      title: `${pick(titles)} #${i + 1}`,
      service: pick(services),
      severity: pick(severities),
      status: pick(statuses),
      owner: pick(owners),
      summary: pick(summaries),
    });
  }

  await Incident.insertMany(data);

  console.log("✅ Seed complete: 200 incidents inserted");
  await mongoose.connection.close();
  process.exit(0);
};

runSeed();
