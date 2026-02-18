import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Save, 
  User, 
  FileText, 
  ShieldAlert, 
  Activity, 
  CheckCircle2,
  AlertCircle,
  Hash
} from "lucide-react"; 

export default function IncidentDetail() {
  const { id } = useParams();
  const nav = useNavigate();

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
      // In a real app, use a toast here
      console.error(err);
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
      alert("✅ Incident updated successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  // Helper for Badge Colors
  const getSevColor = (sev) => {
    if (sev === 'SEV1') return 'var(--red-500)';
    if (sev === 'SEV2') return 'var(--orange-500)';
    return 'var(--blue-500)';
  };

  const getStatusColor = (status) => {
    if (status === 'RESOLVED') return 'var(--green-500)';
    if (status === 'MITIGATED') return 'var(--yellow-500)';
    return 'var(--text-main)';
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loader-container">
          <div className="spinner-large" />
          <p>Loading incident details...</p>
        </div>
        <StyleBlock />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="page-wrapper">
        <div className="incident-card error-card">
          <AlertCircle size={48} color="var(--red-500)" />
          <h2>Incident Not Found</h2>
          <Link to="/incidents" className="btn-ghost">
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
        </div>
        <StyleBlock />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="glow-spot -top-right" />
      <div className="glow-spot -bottom-left" />

      <div className="incident-card animate-enter">
        {/* --- Header Navigation --- */}
        <div className="card-top-bar">
          <button onClick={() => nav("/incidents")} className="back-link">
            <ArrowLeft size={16} /> 
            <span>All Incidents</span>
          </button>
          <div className="id-badge">
            <Hash size={12} /> {id.slice(-6).toUpperCase()}
          </div>
        </div>

        {/* --- Title & Meta Header --- */}
        <div className="card-header-hero">
          <h1 className="hero-title">{incident.title}</h1>
          
          <div className="badge-row">
            <div className="badge" style={{ borderColor: getSevColor(incident.severity), color: getSevColor(incident.severity) }}>
              <ShieldAlert size={14} />
              {incident.severity}
            </div>
            
            <div className="badge service-badge">
              <Activity size={14} />
              {incident.service}
            </div>

            <div className="meta-dates">
              <span title="Created At"><Calendar size={12} /> {new Date(incident.createdAt).toLocaleDateString()}</span>
              <span className="dot">•</span>
              <span title="Last Updated"><Clock size={12} /> {new Date(incident.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* --- Edit Form Section --- */}
        <div className="form-section">
          <h3 className="section-label">Incident Management</h3>
          
          <div className="grid-2">
            {/* Status Select */}
            <div className="input-group">
              <label>Current Status</label>
              <div className="select-wrapper" style={{ borderColor: getStatusColor(form.status) }}>
                <div className="status-indicator" style={{ background: getStatusColor(form.status) }} />
                <select 
                  value={form.status} 
                  onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="MITIGATED">MITIGATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>

            {/* Owner Input */}
            <div className="input-group">
              <label>Assignee</label>
              <div className="input-wrapper icon-left">
                <User size={16} className="input-icon" />
                <input
                  value={form.owner}
                  onChange={(e) => setForm(p => ({ ...p, owner: e.target.value }))}
                  placeholder="Unassigned"
                />
              </div>
            </div>
          </div>

          {/* Summary Textarea */}
          <div className="input-group">
            <label>Live Situation Report</label>
            <div className="input-wrapper">
              <FileText size={16} className="input-icon text-area-icon" />
              <textarea
                value={form.summary}
                onChange={(e) => setForm(p => ({ ...p, summary: e.target.value }))}
                placeholder="No summary provided yet..."
                rows={6}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="action-footer">
            <button className="btn-save" disabled={saving} onClick={update}>
              {saving ? <div className="spinner-small" /> : <Save size={16} />}
              {saving ? "Saving Changes..." : "Update Incident"}
            </button>
          </div>
        </div>
      </div>
      <StyleBlock />
    </div>
  );
}

// Extracted Style Component for cleanliness
const StyleBlock = () => (
  <style>{`
    /* --- THEME VARIABLES --- */
    :root {
      --bg: #09090b;
      --card-bg: rgba(24, 24, 27, 0.6);
      --border: #27272a;
      --border-hover: #3f3f46;
      --text-main: #f4f4f5;
      --text-muted: #a1a1aa;
      --accent: #6366f1;
      
      --red-500: #ef4444;
      --orange-500: #f97316;
      --yellow-500: #eab308;
      --green-500: #10b981;
      --blue-500: #3b82f6;
    }

    /* --- PAGE STRUCTURE --- */
    .page-wrapper {
      min-height: 100vh;
      background: var(--bg);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text-main);
      position: relative;
      overflow: hidden;
    }

    .glow-spot {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
      pointer-events: none;
      z-index: 0;
    }
    .-top-right { top: -100px; right: -100px; background: var(--blue-500); }
    .-bottom-left { bottom: -100px; left: -100px; background: var(--accent); }

    /* --- CARD --- */
    .incident-card {
      width: 100%;
      max-width: 650px;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      z-index: 10;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .animate-enter { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* --- TOP BAR --- */
    .card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .back-link {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--text-main); }

    .id-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      background: rgba(255,255,255,0.05);
      padding: 4px 8px;
      border-radius: 6px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* --- HERO HEADER --- */
    .card-header-hero {
      padding: 32px 24px;
      background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
    }

    .hero-title {
      margin: 0 0 16px 0;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 99px;
      border: 1px solid var(--border);
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(0,0,0,0.2);
    }
    
    .service-badge { color: var(--text-main); background: rgba(255,255,255,0.05); }

    .meta-dates {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .dot { opacity: 0.3; }

    .divider { height: 1px; background: var(--border); width: 100%; }

    /* --- FORM SECTION --- */
    .form-section { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    
    .section-label {
      margin: 0;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media(max-width: 500px) { .grid-2 { grid-template-columns: 1fr; } }

    .input-group label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .input-wrapper { position: relative; }
    .input-wrapper.icon-left input, .input-wrapper.icon-left textarea { padding-left: 36px; }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #52525b;
      pointer-events: none;
    }
    .text-area-icon { top: 14px; transform: none; }

    input, textarea, select {
      width: 100%;
      background: #121215;
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s;
      outline: none;
      box-sizing: border-box;
    }

    input:focus, textarea:focus, select:focus {
      border-color: var(--text-muted);
      background: #000;
      box-shadow: 0 0 0 1px var(--text-muted);
    }
    
    textarea { resize: vertical; min-height: 100px; line-height: 1.5; }

    /* Select Customization */
    .select-wrapper { position: relative; display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px; background: #121215; }
    .select-wrapper:hover { border-color: var(--border-hover); }
    .select-wrapper select { border: none; background: transparent; padding-left: 32px; cursor: pointer; }
    
    .status-indicator {
      position: absolute;
      left: 12px;
      width: 8px; height: 8px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
      pointer-events: none;
    }

    /* --- FOOTER & BUTTONS --- */
    .action-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
    }

    .btn-save {
      background: var(--text-main);
      color: black;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.1s, box-shadow 0.2s;
    }
    .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,255,255,0.2); }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

    /* --- LOADING & ERROR --- */
    .loader-container, .error-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: var(--text-muted);
    }
    .error-card { padding: 48px; text-align: center; }
    
    .spinner-large {
      width: 32px; height: 32px;
      border: 3px solid rgba(255,255,255,0.1);
      border-left-color: var(--accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .spinner-small {
      width: 16px; height: 16px;
      border: 2px solid rgba(0,0,0,0.1);
      border-left-color: #000;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `}</style>
);