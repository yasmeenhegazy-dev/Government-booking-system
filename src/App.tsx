import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// صفحاتك يا منة
import Dashboard from "./pages/employee/Dashboard";
import Analytics from "./pages/employee/Analytics";
import AppointmentDetails from "./pages/employee/AppointmentDetails";
import DailyReview from "./pages/employee/DailyReview";
import Profile from "./pages/employee/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* صفحات عبد الرحمن */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* صفحاتك إنتي */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/appointment/:id" element={<AppointmentDetails />} />
        <Route path="/daily-review" element={<DailyReview />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;