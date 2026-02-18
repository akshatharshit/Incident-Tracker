import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import Pagination from "../components/Pagination";

export default function IncidentsPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalPages: 1 });

  const [loading, setLoading] = useState(false);

  // query states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [service, setService] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  // whenever filter changes -> reset page
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, status, severity, service, sortBy, sortOrder]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    if (debouncedQ) params.q = debouncedQ;
    if (status) params.status = status;
    if (severity) params.severity = severity;
    if (service) params.service = service;
    return params;
  }, [page, limit, sortBy, sortOrder, debouncedQ, status, severity, service]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/incidents", { params: queryParams });
      setItems(res.data.items);
      setMeta(res.data.meta);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // eslint-disable-next-line
  }, [queryParams]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const badge = (text) => <span className="badge">{text}</span>;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card">
        <h2 style={{ margin: 0, fontSize: 20 }}>Incidents</h2>
        <p style={{ marginTop: 6, marginBottom: 0, color: "#a8b3cf" }}>
          Server-side pagination + filters + sorting + search
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title/service/summary/owner..."
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          >
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="MITIGATED">MITIGATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          >
            <option value="">All Severity</option>
            <option value="SEV1">SEV1</option>
            <option value="SEV2">SEV2</option>
            <option value="SEV3">SEV3</option>
            <option value="SEV4">SEV4</option>
          </select>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0b1220",
              color: "white",
            }}
          >
            <option value="">All Services</option>
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
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />

          <Link className="btn" to="/incidents/new">
            + Create Incident
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <p style={{ margin: 0, color: "#a8b3cf" }}>Loading incidents...</p>
        ) : items.length === 0 ? (
          <p style={{ margin: 0, color: "#a8b3cf" }}>
            No incidents found. Try changing filters.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("title")}>
                  Title {sortBy === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("service")}>
                  Service{" "}
                  {sortBy === "service" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("severity")}>
                  Severity{" "}
                  {sortBy === "severity" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("status")}>
                  Status{" "}
                  {sortBy === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("createdAt")}>
                  Created{" "}
                  {sortBy === "createdAt"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="rowlink">
                  <td>
                    <Link to={`/incidents/${it._id}`} style={{ fontWeight: 700 }}>
                      {it.title}
                    </Link>
                  </td>
                  <td>{badge(it.service)}</td>
                  <td>{badge(it.severity)}</td>
                  <td>{badge(it.status)}</td>
                  <td style={{ color: "#a8b3cf" }}>
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
