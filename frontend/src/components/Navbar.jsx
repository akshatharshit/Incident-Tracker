import { Link, NavLink } from "react-router-dom";
import { Zap, LayoutGrid, Plus, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        
        {/* --- Logo Section --- */}
        <Link to="/incidents" className="brand">
          <div className="logo-icon">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="brand-name">IncidentOS</span>
        </Link>

        {/* --- Middle Navigation --- */}
        <div className="nav-links">
          <NavLink to="/incidents" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <LayoutGrid size={16} />
            <span>Dashboard</span>
          </NavLink>
          
          {/* Example of a disabled/future link */}
          <div className="nav-item disabled">
            <span>Analytics</span>
            <span className="badge-soon">Soon</span>
          </div>
        </div>

        {/* --- Right Actions --- */}
        <div className="nav-actions">
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          
          <div className="divider-v" />

          <Link to="/incidents/new" className="create-btn">
            <Plus size={16} />
            <span>New Incident</span>
          </Link>
          
          <div className="user-avatar">
            <User size={16} />
          </div>
        </div>
      </div>

      <style>{`
        /* --- VARIABLES --- */
        :root {
          --bg: #09090b;
          --nav-bg: rgba(9, 9, 11, 0.8);
          --border: #27272a;
          --text-main: #ededef;
          --text-muted: #a1a1aa;
          --accent: #6366f1;
        }

        /* --- LAYOUT --- */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          height: 64px;
          border-bottom: 1px solid var(--border);
          background: var(--nav-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .nav-content {
          max-width: 1100px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        /* --- BRAND --- */
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-main);
          transition: opacity 0.2s;
        }
        .brand:hover { opacity: 0.8; }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }

        .brand-name {
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.02em;
        }

        /* --- LINKS --- */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .nav-item:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .nav-item.disabled {
          opacity: 0.5;
          cursor: default;
        }

        .badge-soon {
          font-size: 0.65rem;
          background: #27272a;
          padding: 2px 6px;
          border-radius: 4px;
          color: #a1a1aa;
        }

        /* --- ACTIONS --- */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .icon-btn:hover { color: var(--text-main); background: rgba(255,255,255,0.05); }

        .divider-v {
          width: 1px;
          height: 20px;
          background: var(--border);
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--text-main);
          color: black;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          background: #27272a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          border: 1px solid var(--border);
          margin-left: 4px;
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          .nav-links { display: none; } /* Hide middle links on small screens */
          .brand-name { display: none; }
        }
      `}</style>
    </nav>
  );
}