import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Register from "./components/Register";
import "./index.css";
import Login from "./pages/Login";
import { AuthProvider } from "./auth/AuthContext";
import Protected from "./auth/Protected";
import UserProfilePage from "./pages/UserProfilePage";
import Vacancy from "./pages/VacancyPage";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import AdminUserPage from "./pages/AdminUserPage";

function About() {
  return <h2>О нас</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />

          <main className="flex-fill">
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
              <Route
                path="/admin"
                element={
                  <Protected>
                    <AdminPage />
                  </Protected>
                }
              />
              <Route
                path="/admin/users/:userId"
                element={
                  <Protected>
                    <AdminUserPage />
                  </Protected>
                }
              />
              <Route path="/vacancies/:vacancyId" element={<Vacancy />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
