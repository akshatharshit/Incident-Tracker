import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/api";

export default function IncidentDetail() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    status: "",
    owner: "",
    summary: "",
  });

  const fetchIncident = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/incidents/${id}`);
      setIncident(res.data);

      setForm({
        status: res.data.status || "OPEN",
        owner: res.data.owner || "",
        summary: res.data.summary || "",
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load incident");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
    // eslint-disable-next-line
  }, [id]);

  const update = async () => {
    try {
      setSaving(true);
      const res = await api.patch(`/api/incidents/${id}`, form);
      setIncident(res.data);
      alert("✅ Updated!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ margin: 0, color: "#a8b3cf" }}>Loading incident...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>Incident not found.</p>
        <Link to="/incidents" className="btn" style={{ marginTop: 12, display: "inline-block" }}>
          Back
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <Link to="/incidents" style={{ color: "#a8b3cf" }}>
          ← Back to incidents
        </Link>

        <h2 style={{ marginBottom: 6 }}>{incident.title}</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="badge">{incident.service}</span>
          <span className="badge">{incident.severity}</span>
          <span className="badge">{incident.status}</span>
        </div>

        <p style={{ color: "#a8b3cf", marginTop: 10 }}>
          Created: {new Date(incident.createdAt).toLocaleString()} <br />
          Updated: {new Date(incident.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Update Incident</h3>

        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
          }}
        >
          <option value="OPEN">OPEN</option>
          <option value="MITIGATED">MITIGATED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <input
          value={form.owner}
          onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
          placeholder="Owner (optional)"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
          }}
        />

        <textarea
          value={form.summary}
          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
          placeholder="Summary (optional)"
          rows={6}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
            resize: "vertical",
          }}
        />

        <button className="btn" disabled={saving} onClick={update}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
