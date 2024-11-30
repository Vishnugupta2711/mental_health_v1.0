import "./App.css";
import InteractiveRoom3D from "./components/InteractiveRoom3D";

function App() {
  const allowedHost = "localhost:3002";

  // Validate host and port
  if (window.location.host !== allowedHost) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <h1>Access Denied</h1>
        <p>
          You can only access this application from{" "}
          <strong>{allowedHost}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <InteractiveRoom3D />
    </div>
  );
}

export default App;
