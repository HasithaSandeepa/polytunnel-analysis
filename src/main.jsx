import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PolytunnelAnalysis from "./PolytunnelAnalysis.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PolytunnelAnalysis />
  </StrictMode>
);
