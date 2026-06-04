import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { getOffers } from "../service/api";
import { BookIcon } from "../component/Icons";

const formatPrice = (price) =>
  price == null || Number(price) === 0 ? "Gratuit" : `${Number(price).toFixed(2)} DT`;

const Offers = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getOffers()
      .then((res) => { if (!cancelled) setClasses(res ?? []); })
      .catch((err) => { if (!cancelled) setError(err.message || "Impossible de charger les offres."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const collegeClasses = useMemo(() => classes.filter((c) => c.level === "COLLEGE"), [classes]);
  const lyceeClasses = useMemo(() => classes.filter((c) => c.level === "LYCEE"), [classes]);
  const univClasses = useMemo(() => classes.filter((c) => c.level === "UNIV"), [classes]);

  // Carte compacte d'une classe, réutilisée par les classes sans section (Collège, Lycée, Université).
  const renderClassCard = (cls) => (
    <div key={cls.id} className="collegeLevelCard">
      <div className="collegeLevelIcon"><BookIcon /></div>
      <h3>{cls.title}</h3>
      <div>
        {cls.sections?.length > 0 && (
          <p className="collegeDescription">{cls.sections.map((s) => s.name).join(" · ")}</p>
        )}
        <div className="collegeLevelStats">
          <span className="sectionPrice">{formatPrice(cls.price)}</span>
        </div>
        <Link className="viewCoursesBtn" to="/signin">Voir les cours</Link>
      </div>
    </div>
  );

  // Une classe AVEC sections -> une sous-section avec une carte par section.
  const renderGrade = (cls) => {
    const sections = cls.sections?.length ? cls.sections : [null];
    return (
      <div key={cls.id} className="levelSection">
        <div className="classSubHeader">
          <h3 className="classTitle">{cls.title}</h3>
        </div>
        <div className="sectionsGrid">
          {sections.map((section, index) => (
            <div key={section ? section.name : index} className="sectionCard">
              <div className="sectionLevel">{section ? `${cls.title} - ${section.name}` : cls.title}</div>
              <div className="sectionIcon"><BookIcon /></div>
              <h3>{section ? section.name : cls.title}</h3>
              <div className="sectionStats">
                <span className="sectionPrice">{formatPrice(section ? section.price : cls.price)}</span>
              </div>
              <Link className="viewCoursesBtn" to="/signin">Voir les cours</Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Rendu d'un niveau : classes sans section en grille compacte, classes avec sections
  // en sous-sections (comme le Bac). Utilisé pour Collège, Lycée et Université.
  const renderLevel = (title, list) => {
    if (!list.length) return null;
    const withSections = list.filter((c) => c.sections?.length > 0);
    const withoutSections = list.filter((c) => !c.sections?.length);
    return (
      <div className="collegeSection">
        <div className="levelSectionHeader">
          <h2 className="levelTitle">{title}</h2>
        </div>
        {withoutSections.length > 0 && (
          <div className="collegeLevelsGrid">
            {withoutSections.map(renderClassCard)}
          </div>
        )}
        {withSections.map(renderGrade)}
      </div>
    );
  };

  return (
    <MainLayout>
      <section className="offers">
        <div className="offersHeader">
          <h1>Nos Offres d'Abonnement</h1>
          <p>Explorez nos cours par niveau et section</p>
        </div>

        {loading && (
          <div className="sectionsGrid" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sectionCard offerSkeleton">
                <div className="skel skelBadge" />
                <div className="skel skelIcon" />
                <div className="skel skelTitle" />
                <div className="skel skelPrice" />
                <div className="skel skelBtn" />
              </div>
            ))}
          </div>
        )}
        {error && <p className="adminError">{error}</p>}
        {!loading && !error && classes.length === 0 && <p>Aucune classe disponible pour le moment.</p>}

        {/* Un bloc par niveau : Collège, Lycée, Université */}
        {renderLevel("Collège", collegeClasses)}
        {renderLevel("Lycée", lyceeClasses)}
        {renderLevel("Université", univClasses)}
      </section>
    </MainLayout>
  );
};

export default Offers;
