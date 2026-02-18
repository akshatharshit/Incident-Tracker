import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    severity: {
      type: String,
      required: true,
      enum: ["SEV1", "SEV2", "SEV3", "SEV4"],
    },
    status: {
      type: String,
      enum: ["OPEN", "MITIGATED", "RESOLVED"],
      default: "OPEN",
    },
    owner: { type: String, default: "", trim: true },
    summary: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// search index
IncidentSchema.index({ title: "text", service: "text", summary: "text" });

// filtering + sorting index
IncidentSchema.index({ status: 1, severity: 1, service: 1, createdAt: -1 });

export default mongoose.model("Incident", IncidentSchema);
