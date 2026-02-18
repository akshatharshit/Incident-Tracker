import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const navStyle = ({ isActive }) => ({
    padding: "10px 14px",
    borderRadius: 12,
    background: isActive ? "#1e293b" : "transparent",
    border: "1px solid #334155",
  });

  return (
    <div style={{ borderBottom: "1px solid #22304a", padding: 14 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link to="/incidents" style={{ fontWeight: 800, fontSize: 18 }}>
          🚨 Incident Tracker
        </Link>

        <div style={{ display: "flex", gap: 10 }}>
          <NavLink to="/incidents" style={navStyle}>
            Incidents
          </NavLink>
          <NavLink to="/incidents/new" style={navStyle}>
            + Create
          </NavLink>
        </div>
      </div>
    </div>
  );
}
