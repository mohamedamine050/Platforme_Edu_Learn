import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Accueil", path: "/", icon: "" },
  { label: "Offres", path: "/offers", icon: "" },
  { label: "Matières", path: "/matiere", icon: "" },
  { label: "Sign In", path: "/signin", icon: "" },
  { label: "About", path: "/about", icon: "" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navInner">
        <div className="logo">
          <div className="logoIcon">📖</div>
          <span className="logoText">EduLearn</span>
        </div>

        <ul className="navList">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink 
                className={({ isActive }) => isActive ? "navLink active" : "navLink"}
                to={link.path}
              >
                <span className="navIcon">{link.icon}</span>
                <span className="navLabel">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="mobileMenuBtn" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="mobileMenu">
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={({ isActive }) => isActive ? "mobileLink active" : "mobileLink"}
              onClick={() => setOpen(false)}
            >
              <span className="navIcon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;