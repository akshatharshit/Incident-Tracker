import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import IncidentsPage from "./pages/IncidentsPage";
import CreateIncident from "./pages/CreateIncident";
import IncidentDetail from "./pages/IncidentDetail";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/incidents" />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/new" element={<CreateIncident />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </div>
    </div>
  );
}
