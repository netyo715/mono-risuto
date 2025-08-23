import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { hc } from "hono/client";
import type { AppType } from "../../backend/src/index";

const client = hc<AppType>(
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8787"
);

function App() {
  const [text, setText] = useState("");

  const fetchData = async () => {
    const response = await client.index.$get();
    if (!response.ok) {
      setText("Error fetching data");
      return;
    }
    const data = await response.text();
    setText(data);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {text && <p>{text}</p>}
        <button onClick={fetchData}>fetch</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
