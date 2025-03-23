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
import RoomsPage from "./pages/student-parent/Rooms";
import MenusPage from "./pages/student-parent/Menus";
import ComplaintsPage from "./pages/student-parent/Complaints";
import HostelLandingPage from "./pages/hostel/Landing";
import HostelRegisterPage from "./pages/hostel/Register";
import HostelForgotPasswordPage from "./pages/hostel/ForgotPassword";
import AttendancePage from "./pages/student-parent/Attendance";
import MyRoomPage from "./pages/student-parent/MyRoom";
import ProfilePage from "./pages/student-parent/Profile";
import ForgotPasswordPage from "./pages/student-parent/ForgotPassword";
import ChangePasswordPage from "./pages/student-parent/ChangePassword";
import HostelEntryExitPage from "./pages/hostel/EntryExit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* hostel */}
        <Route path="/hostel/landing" element={<HostelLandingPage />} />
        <Route path="/hostel/register" element={<HostelRegisterPage />} />
        <Route path="/hostel/login" element={<HostelLoginPage />} />
        <Route path="/hostel/forgot-password" element={<HostelForgotPasswordPage />} />
        <Route path="/hostel/dashboard" element={<HostelDashboardPage />} />
        <Route path="/hostel/rooms" element={<HostelRoomsPage />} />
        <Route path="/hostel/students" element={<HostelStudentsPage />} />
        <Route path="/hostel/parents" element={<HostelParentsPage />} />
        <Route path="/hostel/menus" element={<HostelMenusPage />} />
        <Route path="/hostel/complaints" element={<HostelComplaintsPage />} />
        <Route path="/hostel/checkins" element={<HostelCheckinPage />} />
        <Route path="/hostel/entryexits" element={<HostelEntryExitPage />} />
        {/* student-parent */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/rooms" element={<RoomsPage />} /> */}
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        {/* <Route path="/my-room" element={<MyRoomPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;