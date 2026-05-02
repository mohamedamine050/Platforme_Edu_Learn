import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../service/auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still redirect to signin even if logout call fails
      navigate("/signin");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebarNav">
        <NavLink to="/" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon">🏠</span>
          <span className="linkText">Accueil</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon">👤</span>
          <span className="linkText">Profil</span>
        </NavLink>
        <NavLink to="/offers" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon">💎</span>
          <span className="linkText">Offres</span>
        </NavLink>
        <NavLink to="/matiere" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon">📖</span>
          <span className="linkText">Matières</span>
        </NavLink>
       
        <NavLink to="/assistance" className={({ isActive }) => `sidebarLink ${isActive ? "active" : ""}`}>
          <span className="linkIcon">💬</span>
          <span className="linkText">Support</span>
        </NavLink>

        <button className="sidebarLink signOutBtn" onClick={handleLogout}>
          <span className="linkIcon">🚪</span>
          <span className="linkText">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
