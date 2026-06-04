import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { getOffers } from "../service/api";
import { CollegeIcon, LyceeIcon, VideosIcon, SchoolIcon, PdfIcon, MobileIcon } from "../component/Icons";

// Configuration d'affichage par niveau (ordre, libellé, icône, mise en avant).
const LEVEL_CONFIG = [
  { level: "COLLEGE", label: "Collège", Icon: CollegeIcon, featured: false },
  { level: "LYCEE", label: "Lycée", Icon: LyceeIcon, featured: true },
  { level: "UNIV", label: "Université", Icon: LyceeIcon, featured: false },
];

// Points forts réels de la plateforme (pas de chiffres inventés).
const HIGHLIGHTS = [
  { Icon: SchoolIcon, title: "Du collège au bac", text: "Collège, lycée et université réunis au même endroit." },
  { Icon: VideosIcon, title: "Cours en vidéo", text: "Chaque chapitre expliqué pas à pas, à revoir autant de fois que tu veux." },
  { Icon: PdfIcon, title: "Fiches à télécharger", text: "Des documents PDF par chapitre pour réviser et t'entraîner." },
  { Icon: MobileIcon, title: "À ton rythme, 24/7", text: "Apprends quand tu veux, où tu veux, depuis ton téléphone." },
];

const Home = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getOffers()
      .then((res) => { if (!cancelled) setClasses(res ?? []); })
      .catch(() => { /* page publique : on ignore l'erreur, la section reste vide */ });
    return () => { cancelled = true; };
  }, []);

  // Catégories à afficher : uniquement les niveaux ayant au moins une classe.
  const categories = useMemo(() => {
    return LEVEL_CONFIG
      .map((cfg) => ({ ...cfg, items: classes.filter((c) => c.level === cfg.level) }))
      .filter((cat) => cat.items.length > 0);
  }, [classes]);

  // ≤ 3 catégories : affichage fixe. > 3 : défilement (carrousel).
  const isMarquee = categories.length > 3;

  const renderCard = (cat, key) => (
    <div key={key} className={`courseCategory${cat.featured ? " featured" : ""}`}>
      <div className="categoryIcon"><cat.Icon /></div>
      <div className="categoryName">{cat.label}</div>
      <ul className="courseLevels">
        {cat.items.map((cls) => (
          <li key={cls.id} className="levelItem">
            <span className="levelNumber">{cls.title}</span>
            <Link className="levelBtn" to="/signin">Accéder</Link>
          </li>
        ))}
      </ul>
      <Link className={`categoryBtn${cat.featured ? " featured-btn" : ""}`} to="/offers">
        Explorer {cat.label}
      </Link>
    </div>
  );

  return (
    <MainLayout>
      <section className="hero">
        <span className="heroGlow heroGlow1" aria-hidden="true" />
        <span className="heroGlow heroGlow2" aria-hidden="true" />
        <div className="heroInner">
          <span className="heroEyebrow">Cours vidéo · du collège au bac · programme tunisien</span>
          <h1 className="heroTitle">Réussis ton année,<br /> un chapitre à la fois.</h1>
          <p className="heroSubtitle">
            Des cours vidéo clairs, classés par matière et par chapitre, avec des fiches
            à télécharger. Apprends à ton rythme, où tu veux.
          </p>
          <div className="heroActions">
            <Link className="heroBtn" to="/offers">Explorer les cours</Link>
            <Link className="heroBtnGhost" to="/signup">Créer un compte</Link>
          </div>
        </div>
      </section>

      <section className="highlights">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="highlightCard">
            <span className="highlightIcon"><item.Icon /></span>
            <h3 className="highlightTitle">{item.title}</h3>
            <p className="highlightText">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="subscriptions">
        <div className="subscriptionHeader">
          <h2>Nos Offres d'Abonnement</h2>
          <p>Choisissez votre niveau d'études</p>
        </div>

        <div className={`subscriptionCards${isMarquee ? " isMarquee" : ""}`}>
          {categories.length === 0 ? (
            <p>Aucune classe disponible pour le moment.</p>
          ) : isMarquee ? (
            <div className="subscriptionTrack">
              {/* Cartes dupliquées (x2) pour un défilement en boucle sans couture. */}
              {[...categories, ...categories].map((cat, index) => renderCard(cat, `${cat.level}-${index}`))}
            </div>
          ) : (
            categories.map((cat) => renderCard(cat, cat.level))
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
