// src/routes/AppRoutes.jsx

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Complaints from "../pages/Complaints";
import ComplaintDetails from "../pages/ComplaintDetails";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import CreateComplaint from "../pages/CreateComplaint";

const AppRoutes = () => {
  const user = useSelector((s) => s.auth.user);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/complaints" element={<Complaints />} />
      <Route path="/complaints/:id" element={<ComplaintDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected - requires login */}
      <Route element={<ProtectedRoute isAllowed={!!user} redirectTo="/login" />}>
        <Route path="/create-complaint" element={<CreateComplaint />} />
        <Route path="/my-complaints" element={<Complaints />} />
      </Route>

      {/* admin protected */}
      <Route element={<ProtectedRoute isAllowed={!!user && user.role === "admin"} redirectTo="/login" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
