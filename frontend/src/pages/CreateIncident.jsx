import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function CreateIncident() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    service: "Payments",
    severity: "SEV3",
    status: "OPEN",
    owner: "",
    summary: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/incidents", form);
      nav(`/incidents/${res.data._id}`);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          JSON.stringify(err?.response?.data?.errors || {}) ||
          "Failed to create incident"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Create Incident</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Incident title..."
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
          }}
        />

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}>
          <select
            value={form.service}
            onChange={(e) => onChange("service", e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          >
            <option value="Payments">Payments</option>
            <option value="Auth">Auth</option>
            <option value="API Gateway">API Gateway</option>
            <option value="Search">Search</option>
            <option value="Database">Database</option>
            <option value="Notifications">Notifications</option>
            <option value="Analytics">Analytics</option>
            <option value="Orders">Orders</option>
            <option value="Billing">Billing</option>
          </select>

          <select
            value={form.severity}
            onChange={(e) => onChange("severity", e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          >
            <option value="SEV1">SEV1</option>
            <option value="SEV2">SEV2</option>
            <option value="SEV3">SEV3</option>
            <option value="SEV4">SEV4</option>
          </select>

          <select
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
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
        </div>

        <input
          value={form.owner}
          onChange={(e) => onChange("owner", e.target.value)}
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
          onChange={(e) => onChange("summary", e.target.value)}
          placeholder="Summary (optional)"
          rows={5}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0b1220",
            color: "white",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => nav("/incidents")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
