import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  console.log("ProtectedRoute check: isLoggedIn =", isLoggedIn); // <- DEBUG
  return isLoggedIn ? children : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;
