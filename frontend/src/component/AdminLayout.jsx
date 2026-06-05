import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../service/api";
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  ClassesIcon,
  CoursesIcon,
  ChaptersIcon,
  VideosIcon,
  UsersIcon,
  LogoutIcon,
  LogoMark,
  MenuIcon,
  CloseIcon,
} from "./Icons";

const NAV_LINKS = [
  { label: "Tableau de bord", path: "/admin", end: true, Icon: DashboardIcon },
  { label: "Classes", path: "/admin/classes", Icon: ClassesIcon },
  { label: "Cours", path: "/admin/courses", Icon: CoursesIcon },
  { label: "Chapitres", path: "/admin/chapters", Icon: ChaptersIcon },
  { label: "Vidéos", path: "/admin/videos", Icon: VideosIcon },
  { label: "Documents", path: "/admin/resources", Icon: CoursesIcon },
  { label: "Utilisateurs", path: "/admin/users", Icon: UsersIcon },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { clear } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clear();
      navigate("/admin/login");
    }
  };

  return (
    <div className="adminShell">
      {/* Barre supérieure (mobile uniquement) avec bouton menu */}
      <header className="adminTopbar">
        <button
          className="adminMenuBtn"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          <MenuIcon />
        </button>
        <div className="adminSidebarBrand">
          <span className="adminBrandMark"><LogoMark /></span>
          <span>EduLearn</span>
        </div>
      </header>

      {/* Voile sombre derrière le tiroir (mobile) */}
      <div
        className={menuOpen ? "adminOverlay isOpen" : "adminOverlay"}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={menuOpen ? "adminSidebar isOpen" : "adminSidebar"}>
        <button
          className="adminSidebarClose"
          type="button"
          onClick={closeMenu}
          aria-label="Fermer le menu"
        >
          <CloseIcon />
        </button>
        <div className="adminSidebarBrand">
          <span className="adminBrandMark"><LogoMark /></span>
          <span>EduLearn</span>
        </div>
        <nav className="adminNav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "adminNavLink active" : "adminNavLink")}
            >
              <link.Icon className="adminNavIcon" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="adminBtn adminLogoutBtn" type="button" onClick={handleLogout}>
          <LogoutIcon className="adminNavIcon" />
          <span>Déconnexion</span>
        </button>
      </aside>
      <main className="adminMain">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
