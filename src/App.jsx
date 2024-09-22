import Landpage from "./pages/Landpage";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MapComponent from "./components/MapComponent";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/" element={<Landpage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Mappy" element={<MapComponent/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
