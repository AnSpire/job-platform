import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/Register";
import "./index.css";
import Login from "./pages/Login";
import { AuthProvider } from "./auth/AuthContext";
import Protected from "./auth/Protected";
import UserProfilePage from "./pages/UserProfilePage";
import Vacancy from "./components/Vacancy";
function About() {
  return <h2>О нас</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="/app/me"
            element={
              <Protected>
                <UserProfilePage />
              </Protected>
            }
          />
          <Route path="/vacancies/:vacancyId" element={<Vacancy />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
