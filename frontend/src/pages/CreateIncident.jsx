import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { 
  Check, 
  ChevronDown, 
  AlertTriangle, 
  Activity, 
  User, 
  FileText,
  X,
  Zap
} from "lucide-react"; 

export default function CreateIncident() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    service: "Payments",
    severity: "SEV3",
    status: "OPEN",
    owner: "",
    summary: "",
  });

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/incidents", form);
      nav(`/incidents/${res.data._id}`);
    } catch (err) {
      alert("Failed to create incident");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic border color based on severity
  const getSevColor = (sev) => {
    if (sev === 'SEV1') return 'var(--red-500)';
    if (sev === 'SEV2') return 'var(--orange-500)';
    return 'var(--border)';
  };

  return (
    <div className="page-wrapper">
      {/* Background Ambient Glows */}
      <div className="glow-spot -top-left" />
      <div className="glow-spot -bottom-right" />

      <div className="incident-card animate-enter">
        <div className="card-header">
          <div className="header-icon">
            <Zap size={20} className="icon-pulse" />
          </div>
          <div className="header-text">
            <h1>New Incident</h1>
            <p>Report a system anomaly or outage</p>
          </div>
          <button type="button" className="close-btn" onClick={() => nav(-1)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="form-body">
          {/* Title */}
          <div className="input-group">
            <label>Title</label>
            <div className="input-wrapper">
              <input
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="e.g. High latency on Checkout API"
                autoFocus
                required
              />
              <div className="input-highlight" />
            </div>
          </div>

          {/* Grid Selectors */}
          <div className="grid-3">
            {/* Service */}
            <div className="input-group">
              <label>Service</label>
              <div className="select-container">
                <Activity size={14} className="field-icon" />
                <select
                  value={form.service}
                  onChange={(e) => onChange("service", e.target.value)}
                >
                  {["Payments", "Auth", "API Gateway", "Database", "Search", "Orders"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="chevron" />
              </div>
            </div>

            {/* Severity */}
            <div className="input-group">
              <label>Severity</label>
              <div className="select-container" style={{ borderColor: getSevColor(form.severity) }}>
                <AlertTriangle size={14} className="field-icon" style={{ color: getSevColor(form.severity) }} />
                <select
                  value={form.severity}
                  onChange={(e) => onChange("severity", e.target.value)}
                >
                  <option value="SEV1">SEV1 (Critical)</option>
                  <option value="SEV2">SEV2 (High)</option>
                  <option value="SEV3">SEV3 (Major)</option>
                  <option value="SEV4">SEV4 (Minor)</option>
                </select>
                <ChevronDown size={14} className="chevron" />
              </div>
            </div>

            {/* Status */}
            <div className="input-group">
              <label>Status</label>
              <div className="select-container">
                <div className={`status-dot ${form.status.toLowerCase()}`} />
                <select
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="MITIGATED">Mitigated</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <ChevronDown size={14} className="chevron" />
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className="input-group">
            <label>Owner <span className="sub-label">(Optional)</span></label>
            <div className="input-wrapper icon-left">
              <User size={16} className="input-icon" />
              <input
                value={form.owner}
                onChange={(e) => onChange("owner", e.target.value)}
                placeholder="Assign to..."
              />
            </div>
          </div>

          {/* Summary */}
          <div className="input-group">
            <label>Context</label>
            <div className="input-wrapper">
              <FileText size={16} className="input-icon text-area-icon" />
              <textarea
                value={form.summary}
                onChange={(e) => onChange("summary", e.target.value)}
                placeholder="Describe the impact and initial findings..."
                rows={4}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="form-footer">
            <button type="button" className="btn-ghost" onClick={() => nav(-1)}>
              Cancel
            </button>
            <button className="btn-hero" disabled={loading}>
              {loading ? <div className="spinner" /> : <Check size={16} />}
              <span>{loading ? "Creating..." : "Create Incident"}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        /* --- MODERN VARIABLES --- */
        :root {
          --bg: #09090b;
          --card: #121214;
          --border: #27272a;
          --border-hover: #3f3f46;
          --text-main: #ededef;
          --text-muted: #a1a1aa;
          
          --primary: #f8f8f8;
          --primary-bg: #fff;
          
          --accent: #6366f1; /* Indigo */
          --accent-glow: rgba(99, 102, 241, 0.15);
          
          --red-500: #ef4444;
          --orange-500: #f97316;
          --green-500: #10b981;
        }

        /* --- LAYOUT --- */
        .page-wrapper {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Ambient Background Glows */
        .glow-spot {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .-top-left { top: -200px; left: -200px; }
        .-bottom-right { bottom: -200px; right: -200px; background: radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%); }

        /* --- CARD --- */
        .incident-card {
          width: 100%;
          max-width: 580px;
          background: rgba(18, 18, 20, 0.8); /* Semi-transparent */
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 
            0 0 0 1px rgba(0,0,0,0.2), 
            0 20px 40px -12px rgba(0,0,0,0.5);
          z-index: 10;
          overflow: hidden;
        }

        .animate-enter {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* --- HEADER --- */
        .card-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #27272a, #18181b);
          border: 1px solid var(--border-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
        }

        .header-text h1 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
        .header-text p { margin: 2px 0 0; font-size: 0.85rem; color: var(--text-muted); }

        .close-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .close-btn:hover { background: var(--border); color: var(--text-main); }

        /* --- FORM --- */
        .form-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        .input-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .sub-label { font-weight: 400; opacity: 0.6; }

        /* Inputs & Textareas */
        .input-wrapper { position: relative; }
        
        input, textarea {
          width: 100%;
          background: #09090b;
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          box-sizing: border-box;
          outline: none;
        }
        
        /* Icon positioning inside input */
        .input-wrapper.icon-left input { padding-left: 38px; }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .text-area-icon { top: 14px; transform: none; }
        .input-wrapper.icon-left textarea { padding-left: 38px; }

        input:focus, textarea:focus, select:focus {
          border-color: var(--text-muted);
          box-shadow: 0 0 0 3px var(--border);
          background: #000;
        }

        input::placeholder, textarea::placeholder { color: #3f3f46; }

        textarea { min-height: 80px; resize: vertical; font-family: inherit; }

        /* Grid Layout */
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media(max-width: 500px) { .grid-3 { grid-template-columns: 1fr; } }

        /* Select Styling */
        .select-container {
          position: relative;
          background: #09090b;
          border: 1px solid var(--border);
          border-radius: 8px;
          transition: 0.2s;
          display: flex;
          align-items: center;
        }
        
        .select-container:hover { border-color: var(--border-hover); }

        select {
          appearance: none;
          background: transparent;
          border: none;
          color: var(--text-main);
          width: 100%;
          padding: 10px 32px 10px 32px; /* Space for icons */
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
        }

        .field-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }
        
        .chevron {
          position: absolute;
          right: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        /* Status Dots */
        .status-dot {
          position: absolute;
          left: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
        }
        .status-dot.open { background: var(--green-500); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
        .status-dot.mitigated { background: var(--orange-500); }
        .status-dot.resolved { background: var(--text-muted); }

        /* --- BUTTONS --- */
        .form-footer {
          margin-top: 10px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .btn-ghost {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 6px;
          transition: 0.2s;
        }
        .btn-ghost:hover { background: var(--border); color: var(--text-main); }

        .btn-hero {
          background: var(--text-main);
          color: black;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
        
        .btn-hero:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }
        .btn-hero:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Animation */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.1);
          border-left-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .icon-pulse { animation: pulse 3s infinite; color: #fbbf24; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}