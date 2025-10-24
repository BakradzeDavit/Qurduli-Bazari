import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";   // must also be in src/
import "./index.css";          // Tailwind + custom CSS
import 'bootstrap/dist/css/bootstrap.min.css';
const root = createRoot(document.getElementById("root"));
root.render(<App />);
