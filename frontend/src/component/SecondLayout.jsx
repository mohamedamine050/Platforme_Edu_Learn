import { useState } from "react";
import Sidebar from "./Sidebar";
import { LogoMark, MenuIcon } from "./Icons";

const SecondLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="secondLayout">
      {/* Barre supérieure (mobile uniquement) avec bouton menu */}
      <header className="studentTopbar">
        <button
          className="studentMenuBtn"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          <MenuIcon />
        </button>
        <div className="studentTopbarBrand">
          <span className="studentBrandMark"><LogoMark /></span>
          <span>EduLearn</span>
        </div>
      </header>

      {/* Voile sombre derrière le tiroir (mobile) */}
      <div
        className={menuOpen ? "sidebarOverlay isOpen" : "sidebarOverlay"}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <Sidebar open={menuOpen} onNavigate={closeMenu} />
      <div className="mainContent">
        {children}
      </div>
    </div>
  );
};

export default SecondLayout;
