import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import TherapyCards from "./Pages/TherapyCards"; // Import TherapyCards
import { useAuth } from "./contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AccessibleMeditation from "./Pages/Meditation";
import AccessExerciseHub from "./Pages/ExerciseHub";
import GamesSelectionPage from "./Pages/GamesSelectionPage";
import MemoryMatchGame from "./games/MemoryMatchGame";
import WhackMole from "./games/WhackMole";
import MoodLogger from "./Pages/MoodLogger";
import JournalApp from "./Pages/Journal";
import ThreeJSComponent from "./Pages/ThreeJSComponent";

const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />} // Always show the Dashboard first
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/therapycards"
          element={<TherapyCards />} // Remove authentication check for this route
        />
        <Route
          path="/three"
          element={<ThreeJSComponent />} // Remove authentication check for this route
        />
        <Route
          path="/meditate"
          element={<AccessibleMeditation />} // Remove authentication check for this route
        />

        <Route path="/exercise" element={<AccessExerciseHub />} />
        <Route path="/games" element={<GamesSelectionPage />} />
        {/* <Route path="/games/focus" element={<FocusExerciseGame />} /> 
        <Route path="/games/collect" element={<CollectAndCalmGame />} /> */}
        <Route path="/games/memory-match" element={<MemoryMatchGame />} />
        <Route path="/games/whack-mole" element={<WhackMole />} />
        <Route path="/mood" element={<MoodLogger />} />
        <Route path="/journal" element={<JournalApp />} />
      </Routes>
    </Router>
  );
};

export default App;
