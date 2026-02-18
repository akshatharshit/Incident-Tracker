import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["SEV1", "SEV2", "SEV3", "SEV4"], required: true },
    status: { type: String, enum: ["OPEN", "MITIGATED", "RESOLVED"], default: "OPEN" },
    owner: { type: String, default: "" },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

IncidentSchema.index({ title: "text", service: "text", summary: "text" });
IncidentSchema.index({ severity: 1, status: 1, createdAt: -1 });

export default mongoose.model("Incident", IncidentSchema);
