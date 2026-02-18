import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  service: z.string().min(2, "Service is required"),
  severity: z.enum(["SEV1", "SEV2", "SEV3", "SEV4"]),
  status: z.enum(["OPEN", "MITIGATED", "RESOLVED"]).optional(),
  owner: z.string().optional(),
  summary: z.string().optional(),
});

export const updateIncidentSchema = z.object({
  title: z.string().min(3).optional(),
  service: z.string().min(2).optional(),
  severity: z.enum(["SEV1", "SEV2", "SEV3", "SEV4"]).optional(),
  status: z.enum(["OPEN", "MITIGATED", "RESOLVED"]).optional(),
  owner: z.string().optional(),
  summary: z.string().optional(),
});
