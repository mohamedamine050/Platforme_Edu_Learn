import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { HomeIcon, UserIcon, OffersIcon, BookIcon, ChatIcon, LogoutIcon } from "./Icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const { clear } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Vide l'état d'auth partagé puis redirige (même si l'appel échoue).
      clear();
      navigate("/signin");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebarNav">
        <NavLink to="/" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><HomeIcon /></span>
          <span className="linkText">Accueil</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><UserIcon /></span>
          <span className="linkText">Profil</span>
        </NavLink>
        <NavLink to="/offers" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><OffersIcon /></span>
          <span className="linkText">Offres</span>
        </NavLink>
        <NavLink to="/matiere" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><BookIcon /></span>
          <span className="linkText">Matières</span>
        </NavLink>

        <NavLink to="/assistance" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><ChatIcon /></span>
          <span className="linkText">Support</span>
        </NavLink>

        <button className="sidebarLink signOutBtn" onClick={handleLogout}>
          <span className="linkIcon"><LogoutIcon /></span>
          <span className="linkText">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
