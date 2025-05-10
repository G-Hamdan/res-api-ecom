import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If there's no token, redirect to login page
    return <Navigate to="/login" />;
  }

  return children; // Allow access to the children if token exists
};

export default PrivateRoute;
