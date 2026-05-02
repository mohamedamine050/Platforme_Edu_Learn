import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerSection">
          <div className="footerLogo">
            <div className="logoIcon">📖</div>
            <span className="logoText">EduLearn</span>
          </div>
          <p className="footerDesc">
            Apprenez avec les meilleurs cours en ligne de qualité
          </p>
        </div>

        <div className="footerSection">
          <h3 className="footerTitle">Navigation</h3>
          <ul className="footerLinks">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/offers">Offres</Link></li>
            <li><Link to="/matiere">Matières</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footerSection">
          <h3 className="footerTitle">Ressources</h3>
          <ul className="footerLinks">
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Conditions</a></li>
          </ul>
        </div>

        <div className="footerSection">
          <h3 className="footerTitle">Suivez-nous</h3>
          <div className="socialLinks">
            <a href="#" className="socialLink">Facebook</a>
            <a href="#" className="socialLink">Twitter</a>
            <a href="#" className="socialLink">LinkedIn</a>
            <a href="#" className="socialLink">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <p>&copy; 2024 EduLearn. Tous les droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
