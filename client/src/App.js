import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/Landing";
import HostelLoginPage from "./pages/hostel/Login";
import HostelDashboardPage from "./pages/hostel/Dashboard";
import HostelRoomsPage from "./pages/hostel/Rooms";
import HostelStudentsPage from "./pages/hostel/Students";
import HostelParentsPage from "./pages/hostel/Parents";
import HostelComplaintsPage from "./pages/hostel/Complaints";
import HostelCheckinPage from "./pages/hostel/Checkin";
import HostelMenusPage from "./pages/hostel/Menus";
import LoginPage from "./pages/student-parent/Login";
import HomePage from "./pages/student-parent/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* hostel */}
        <Route path="/hostel/login" element={<HostelLoginPage />} />
        <Route path="/hostel/dashboard" element={<HostelDashboardPage />} />
        <Route path="/hostel/rooms" element={<HostelRoomsPage />} />
        <Route path="/hostel/students" element={<HostelStudentsPage />} />
        <Route path="/hostel/parents" element={<HostelParentsPage />} />
        <Route path="/hostel/menus" element={<HostelMenusPage />} />
        <Route path="/hostel/complaints" element={<HostelComplaintsPage />} />
        <Route path="/hostel/checkins" element={<HostelCheckinPage />} />
        {/* student-parent */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;