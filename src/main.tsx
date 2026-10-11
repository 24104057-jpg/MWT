
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Test backend connection
  fetch('/api/test')
    .then((res) => res.json())
    .then((data) => console.log("Response from MongoDB backend:", data))
    .catch((err) => console.error("Error fetching data:", err));

  createRoot(document.getElementById("root")!).render(<App />);
  