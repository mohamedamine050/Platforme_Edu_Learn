import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecondLayout from "../component/SecondLayout";
import Pagination from "../component/Pagination";
import { getCoursesByClass } from "../service/api";
import { useListQuery } from "../hooks/useListQuery";
import { MathIcon, BookIcon, FlaskIcon, LanguageIcon, ComputerIcon, MapIcon, ChevronRightIcon } from "../component/Icons";

const PAGE_SIZE = 9;

const Matiere = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { get, page, setParams } = useListQuery();
  const search = get("search");

  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Champ de recherche local, poussé dans l'URL avec un debounce.
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(search);
  }, [search]);
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => setParams({ search: searchInput }, { resetPage: true, replace: true }), 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, setParams]);

  useEffect(() => {
    if (!classId) return;
    let active = true;
    (async () => {
      try {
        const res = await getCoursesByClass(classId, { search, page: page - 1, size: PAGE_SIZE });
        if (active) { setCourses(res.content ?? []); setTotalPages(res.totalPages); setError(""); }
      } catch (err) {
        if (active) setError(err.message || "Impossible de charger les matières.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [classId, search, page]);

  const getCourseIcon = (title = "") => {
    const normalized = title.toLowerCase();
    if (normalized.includes("math")) return MathIcon;
    if (normalized.includes("fran")) return BookIcon;
    if (normalized.includes("science")) return FlaskIcon;
    if (normalized.includes("anglais")) return LanguageIcon;
    if (normalized.includes("arabe")) return LanguageIcon;
    if (normalized.includes("info")) return ComputerIcon;
    if (normalized.includes("histoire") || normalized.includes("géographie") || normalized.includes("geographie")) return MapIcon;
    if (normalized.includes("chimie")) return FlaskIcon;
    return BookIcon;
  };

  const handleOpenCourse = (courseId) => {
    navigate(`/classes/${classId}/courses/${courseId}/chapters`);
  };

  if (loading) {
    return (
      <SecondLayout>
        <section className="matiere">
          <div className="matiereWrap">
            <header className="matiereHeader">
              <h1>Matières</h1>
              <p className="matiereMuted">Chargement des matières de votre classe...</p>
            </header>
          </div>
        </section>
      </SecondLayout>
    );
  }

  if (error) {
    return (
      <SecondLayout>
        <section className="matiere">
          <div className="matiereWrap">
            <header className="matiereHeader"><h1>Matières</h1></header>
            <p className="profileError">{error}</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  // Libellé de la classe dérivé des cours chargés (qui portent classTitle/classLevel).
  const first = courses[0];
  const classLabel = first?.classTitle ? `${first.classTitle}${first.classLevel ? ` · ${first.classLevel}` : ""}` : "Votre classe";

  return (
    <SecondLayout>
      <section className="matiere">
        <div className="matiereWrap">
          <header className="matiereHeader">
            <h1>Matières</h1>
            <span className="matiereClass">{classLabel}</span>
          </header>

          <input
            className="matiereSearch"
            type="search"
            placeholder="Rechercher une matière…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {courses.length === 0 ? (
            <div className="matiereEmpty">
              {search ? (
                <>
                  <h3>Aucun résultat</h3>
                  <p>Aucune matière ne correspond à « {search} ».</p>
                </>
              ) : (
                <>
                  <h3>Aucun cours disponible</h3>
                  <p>Votre classe n’a pas encore de contenus publiés.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="matieresGrid">
                {courses.map((course) => {
                  const CourseIcon = getCourseIcon(course.title);
                  return (
                    <div
                      key={course.id}
                      className="matiereCard"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenCourse(course.id)}
                      onKeyDown={(event) => event.key === "Enter" && handleOpenCourse(course.id)}
                    >
                      <div className="matiereIconBox"><CourseIcon /></div>
                      <div className="matiereContent">
                        <h3>{course.title}</h3>
                        <p>{course.description || "Voir les chapitres de cette matière"}</p>
                      </div>
                      <span className="matiereGo">
                        Voir les chapitres
                        <ChevronRightIcon className="matiereGoIcon" />
                      </span>
                    </div>
                  );
                })}
              </div>

              <Pagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />
            </>
          )}
        </div>
      </section>
    </SecondLayout>
  );
};

export default Matiere;
