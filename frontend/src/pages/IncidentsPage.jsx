import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Pagination from "../components/Pagination";
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Layers
} from "lucide-react";

export default function IncidentsPage() {
  const navigate = useNavigate();
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

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, status, severity, service, sortBy, sortOrder]);

  const queryParams = useMemo(() => {
    const params = { page, limit, sortBy, sortOrder };
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
      console.error(err);
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

  // --- Visual Helpers ---
  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'SEV1': return { color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.1)' };
      case 'SEV2': return { color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.1)' };
      case 'SEV3': return { color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', bg: 'rgba(234,179,8,0.1)' };
      default: return { color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', bg: 'rgba(59,130,246,0.1)' };
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <div className="sort-placeholder" />;
    return sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div className="page-wrapper">
      <div className="glow-bg" />
      
      <div className="content-container">
        {/* --- Header --- */}
        <div className="page-header">
          <div>
            <h1>Incidents</h1>
            <p className="subtitle">Monitor, track, and resolve system anomalies.</p>
          </div>
          <Link to="/incidents/new" className="btn-primary">
            <Plus size={16} /> Create Incident
          </Link>
        </div>

        {/* --- Toolbar --- */}
        <div className="toolbar">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input 
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search incidents..." 
            />
          </div>

          <div className="filters">
            <Filter size={14} className="filter-icon" />
            
            <div className="select-wrap">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="MITIGATED">Mitigated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div className="select-wrap">
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="">All Severity</option>
                <option value="SEV1">SEV1 (Critical)</option>
                <option value="SEV2">SEV2 (High)</option>
                <option value="SEV3">SEV3 (Major)</option>
              </select>
            </div>

            <div className="select-wrap">
              <select value={service} onChange={(e) => setService(e.target.value)}>
                <option value="">All Services</option>
                <option value="Payments">Payments</option>
                <option value="Auth">Auth</option>
                <option value="Database">Database</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Table --- */}
        <div className="table-card">
          <table className="modern-table">
            <thead>
              <tr>
                <th className="th-sortable" onClick={() => toggleSort("title")}>
                  <div className="th-content">Title {renderSortIcon("title")}</div>
                </th>
                <th className="th-sortable" onClick={() => toggleSort("service")}>
                  <div className="th-content">Service {renderSortIcon("service")}</div>
                </th>
                <th className="th-sortable" onClick={() => toggleSort("severity")}>
                  <div className="th-content">Severity {renderSortIcon("severity")}</div>
                </th>
                <th className="th-sortable" onClick={() => toggleSort("status")}>
                  <div className="th-content">Status {renderSortIcon("status")}</div>
                </th>
                <th className="th-sortable" onClick={() => toggleSort("createdAt")}>
                  <div className="th-content">Created {renderSortIcon("createdAt")}</div>
                </th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton Loading Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="skeleton-row">
                    <td><div className="skeleton-bar" style={{ width: '60%' }} /></td>
                    <td><div className="skeleton-bar" style={{ width: '80px' }} /></td>
                    <td><div className="skeleton-bar" style={{ width: '40px' }} /></td>
                    <td><div className="skeleton-bar" style={{ width: '50px' }} /></td>
                    <td><div className="skeleton-bar" style={{ width: '100px' }} /></td>
                    <td></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <Layers size={48} />
                    <p>No incidents found matching your filters.</p>
                    <button onClick={() => {setQ(""); setStatus(""); setSeverity(""); setService("")}} className="btn-link">
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                items.map((it) => {
                  const sevStyle = getSeverityStyle(it.severity);
                  return (
                    <tr 
                      key={it._id} 
                      onClick={() => navigate(`/incidents/${it._id}`)}
                      className="data-row"
                    >
                      <td className="title-cell">
                        <span className="row-title">{it.title}</span>
                        {it.summary && <span className="row-summary">{it.summary.substring(0, 40)}...</span>}
                      </td>
                      <td>
                        <div className="chip">
                          <Activity size={12} /> {it.service}
                        </div>
                      </td>
                      <td>
                        <span className="badge-sev" style={{ 
                          color: sevStyle.color, 
                          border: sevStyle.border,
                          backgroundColor: sevStyle.bg
                        }}>
                          {it.severity === 'SEV1' && <AlertTriangle size={10} />}
                          {it.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`status-text ${it.status.toLowerCase()}`}>
                          {it.status === 'RESOLVED' && <CheckCircle2 size={12} />}
                          {it.status}
                        </span>
                      </td>
                      <td className="meta-cell">
                        <Clock size={12} />
                        {new Date(it.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="action-cell">
                        <MoreHorizontal size={16} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          
          {/* Footer / Pagination */}
          {!loading && items.length > 0 && (
            <div className="table-footer">
              <div className="meta-info">
                Showing page {meta.page} of {meta.totalPages}
              </div>
              <div className="pagination-wrap">
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* --- CORE VARIABLES --- */
        :root {
          --bg: #09090b;
          --card: #121214;
          --border: #27272a;
          --border-light: #3f3f46;
          --text-main: #ededef;
          --text-muted: #a1a1aa;
          --accent: #6366f1;
        }

        /* --- LAYOUT --- */
        .page-wrapper {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-main);
          padding: 32px;
          position: relative;
        }

        .glow-bg {
          position: absolute;
          top: -20%; left: 20%;
          width: 60%; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .content-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* --- HEADER --- */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        h1 { font-size: 1.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
        .subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 0.9rem; }

        .btn-primary {
          background: var(--text-main);
          color: #000;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.2s;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,255,255,0.2); }

        /* --- TOOLBAR --- */
        .toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-bar {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-bar input {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          color: white;
          padding: 10px 12px 10px 36px;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: 0.2s;
          box-sizing: border-box;
        }
        .search-bar input:focus { border-color: var(--border-light); }

        .filters {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .filter-icon { color: var(--text-muted); margin-right: 4px; }

        .select-wrap select {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
        }
        .select-wrap select:hover { border-color: var(--border-light); color: var(--text-main); }

        /* --- TABLE CARD --- */
        .table-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        thead {
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border);
        }

        th {
          text-align: left;
          padding: 12px 16px;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .th-sortable { cursor: pointer; transition: color 0.2s; }
        .th-sortable:hover { color: var(--text-main); }
        .th-content { display: flex; align-items: center; gap: 6px; }
        .sort-placeholder { width: 12px; height: 12px; }

        .data-row {
          border-bottom: 1px solid var(--border);
          transition: background 0.1s;
          cursor: pointer;
        }
        .data-row:last-child { border-bottom: none; }
        .data-row:hover { background: rgba(255,255,255,0.03); }

        td { padding: 16px; vertical-align: middle; }

        /* Cell Specifics */
        .title-cell { display: flex; flex-direction: column; gap: 4px; max-width: 300px; }
        .row-title { font-weight: 600; color: var(--text-main); }
        .row-summary { font-size: 0.8rem; color: #71717a; }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .badge-sev {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .status-text.resolved { color: #10b981; }
        .status-text.mitigated { color: #f97316; }
        .status-text.open { color: var(--text-main); }

        .meta-cell { color: #71717a; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; }
        .action-cell { color: #52525b; text-align: right; }
        .data-row:hover .action-cell { color: var(--text-main); }

        /* --- STATES --- */
        .empty-state {
          text-align: center;
          padding: 60px;
          color: var(--text-muted);
        }
        .empty-state svg { opacity: 0.2; margin-bottom: 12px; }
        .btn-link { background: none; border: none; color: var(--accent); cursor: pointer; text-decoration: underline; }

        /* Skeleton */
        .skeleton-row td { padding: 20px 16px; }
        .skeleton-bar {
          height: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }

        /* --- FOOTER --- */
        .table-footer {
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meta-info { font-size: 0.8rem; color: #52525b; }
      `}</style>
    </div>
  );
}