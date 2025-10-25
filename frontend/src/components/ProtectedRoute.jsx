// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/login" }) => {
  // usage: <Route element={<ProtectedRoute isAllowed={!!user} />}> ... </Route>
  return isAllowed ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
