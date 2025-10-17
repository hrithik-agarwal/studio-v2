import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/libs/constants";


// Placeholder for Home component - to be created
const Home = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Welcome to SkyStudio</h1>
    <p>Home Page - Dashboard coming soon</p>
  </div>
);

const MasterRoute = () => {
  return (
    <Routes>
      {/* Main home/dashboard route */}
      <Route path={ROUTES.HOME} element={<Home />} />

      {/* Catch-all route - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default MasterRoute;
