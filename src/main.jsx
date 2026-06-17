import React from "react";
import { createRoot } from "react-dom/client";
import PortaslaskuriApp from "./PortaslaskuriApp.jsx";

const reset = document.createElement("style");
reset.textContent = "*{box-sizing:border-box;margin:0;padding:0}html,body,#root{height:100%}";
document.head.appendChild(reset);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PortaslaskuriApp />
  </React.StrictMode>
);
