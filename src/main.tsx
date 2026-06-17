import React from "react";
import { createRoot } from "react-dom/client";
import PortaslaskuriApp from "./PortaslaskuriApp";
import "./index.css";

// Kehityksessä StyleX tarjoaa tyylit virtuaalimoduulin kautta (CSS + HMR).
// Tuotannossa tyylit liitetään index.css-assettiin buildin aikana.
if (import.meta.env.DEV) {
  import("virtual:stylex:runtime");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PortaslaskuriApp />
  </React.StrictMode>
);
