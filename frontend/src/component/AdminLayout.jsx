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
      <aside className="adminSidebar">
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
