import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../service/api";
import { useAuth } from "../context/AuthContext";
import { HomeIcon, UserIcon, OffersIcon, BookIcon, ChatIcon, LogoutIcon, CloseIcon } from "./Icons";

const Sidebar = ({ open = false, onNavigate = () => {} }) => {
  const navigate = useNavigate();
  const { clear } = useAuth();

  const handleLogout = async () => {
    onNavigate();
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
    <aside className={open ? "sidebar isOpen" : "sidebar"}>
      <button className="sidebarClose" type="button" onClick={onNavigate} aria-label="Fermer le menu">
        <CloseIcon />
      </button>
      <div className="sidebarNav">
        <NavLink to="/" onClick={onNavigate} className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><HomeIcon /></span>
          <span className="linkText">Accueil</span>
        </NavLink>
        <NavLink to="/profile" onClick={onNavigate} className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><UserIcon /></span>
          <span className="linkText">Profil</span>
        </NavLink>
        <NavLink to="/offers" onClick={onNavigate} className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><OffersIcon /></span>
          <span className="linkText">Offres</span>
        </NavLink>
        <NavLink to="/matiere" onClick={onNavigate} className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon"><BookIcon /></span>
          <span className="linkText">Matières</span>
        </NavLink>

        <NavLink to="/assistance" onClick={onNavigate} className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
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
