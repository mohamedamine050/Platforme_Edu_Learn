import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogoMark, MenuIcon } from "./Icons";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "Offres", path: "/offers" },
  { label: "Matières", path: "/matiere" },
  { label: "Sign In", path: "/signin" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navInner">
        <div className="logo">
          <div className="logoIcon"><LogoMark /></div>
          <span className="logoText">EduLearn</span>
        </div>

        <ul className="navList">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                className={({ isActive }) => isActive ? "navLink active" : "navLink"}
                to={link.path}
              >
                <span className="navLabel">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="mobileMenuBtn" onClick={() => setOpen(!open)} aria-label="Menu"><MenuIcon /></button>
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
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;