import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PrivateRoute.css";

export const Loading = () => {
  return (
    <div className="cube">
      <div className="cube_item cube_x" />
      <div className="cube_item cube_y" />
      <div className="cube_item cube_y" />
      <div className="cube_item cube_x" />
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="magic-loader-container">
        <Loading />
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
