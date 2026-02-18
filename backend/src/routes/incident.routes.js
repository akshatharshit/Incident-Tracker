import express from "express";
import mongoose from "mongoose";
import Incident from "../models/Incident.js";
import {
  createIncidentSchema,
  updateIncidentSchema,
} from "../validators/incident.validators.js";

const router = express.Router();

/**
 * POST /api/incidents
 * Create incident with validation
 */
router.post("/", async (req, res) => {
  try {
    const parsed = createIncidentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const incident = await Incident.create(parsed.data);
    return res.status(201).json(incident);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/incidents
 * Server-side pagination + search + filter + sort
 *
 * Query params:
 * page=1
 * limit=10
 * q=timeout
 * status=OPEN
 * severity=SEV1
 * service=Payments
 * sortBy=createdAt | severity | status | service
 * sortOrder=asc | desc
 */
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10"), 1), 50);

    const q = (req.query.q || "").trim();
    const status = (req.query.status || "").trim();
    const severity = (req.query.severity || "").trim();
    const service = (req.query.service || "").trim();

    const sortBy = (req.query.sortBy || "createdAt").trim();
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // filters
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (service) filter.service = service;

    // search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { service: { $regex: q, $options: "i" } },
        { summary: { $regex: q, $options: "i" } },
        { owner: { $regex: q, $options: "i" } },
      ];
    }

    // allow only safe sorting fields
    const allowedSortFields = ["createdAt", "updatedAt", "severity", "status", "service", "title"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Incident.find(filter)
        .sort({ [safeSortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    return res.json({
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/incidents/:id
 * Get incident detail
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid incident id" });
    }

    const incident = await Incident.findById(id).lean();

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    return res.json(incident);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /api/incidents/:id
 * Update status / summary / owner / etc
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid incident id" });
    }

    const parsed = updateIncidentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const updated = await Incident.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Incident not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
