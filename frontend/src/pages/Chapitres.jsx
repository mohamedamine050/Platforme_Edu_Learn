import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SecondLayout from "../component/SecondLayout";
import Pagination from "../component/Pagination";
import { getCourseById, getChaptersByCourse } from "../service/api";
import { useListQuery } from "../hooks/useListQuery";
import { ArrowLeftIcon, ChevronRightIcon } from "../component/Icons";

const PAGE_SIZE = 10;

const Chapitres = () => {
  const navigate = useNavigate();
  const { classId, courseId } = useParams();
  const { page, setParams } = useListQuery();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;
    let active = true;
    (async () => {
      try {
        const [courseData, chaptersRes] = await Promise.all([
          getCourseById(courseId),
          getChaptersByCourse(courseId, { page: page - 1, size: PAGE_SIZE }),
        ]);
        if (active) {
          setCourse(courseData);
          setChapters(chaptersRes.content ?? []);
          setTotal(chaptersRes.totalElements);
          setTotalPages(chaptersRes.totalPages);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Impossible de charger les chapitres.");
          if (err.status === 401) navigate("/signin");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [courseId, page, navigate]);

  const openVideo = (chapterId) => {
    navigate(`/classes/${classId}/courses/${courseId}/chapters/${chapterId}`);
  };

  if (loading) {
    return (
      <SecondLayout>
        <div className="matiereDetailContainer">
          <div className="matiereDetailGrid">
            <div className="matiereInfoCard">Chargement des chapitres...</div>
          </div>
        </div>
      </SecondLayout>
    );
  }

  if (error) {
    return (
      <SecondLayout>
        <div className="matiereDetailContainer">
          <div className="matiereDetailGrid">
            <div className="matiereInfoCard">
              <p className="profileError">{error}</p>
              <button className="backButton" onClick={() => navigate(`/classes/${classId}/courses`)}><ArrowLeftIcon className="backIcon" /> Retour aux matières</button>
            </div>
          </div>
        </div>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <div className="matiereDetailContainer">
        <div className="matiereDetailGrid">
          <div className="matiereInfoCard">
            <nav className="breadcrumb">
              <Link className="breadcrumbLink" to={`/classes/${classId}/courses`}>Matières</Link>
              {course?.classTitle && <><span className="breadcrumbSep">›</span><span>{course.classTitle}</span></>}
              <span className="breadcrumbSep">›</span>
              <span className="breadcrumbCurrent">{course?.title || "Cours"}</span>
            </nav>
            <button className="backButton" onClick={() => navigate(`/classes/${classId}/courses`)}><ArrowLeftIcon className="backIcon" /> Retour aux matières</button>
            <h1 className="matiereTitle">{course?.title || "Cours"}</h1>
            <p className="matiereDescription">{course?.description || "Liste des chapitres associés à ce cours."}</p>

            <div className="matiereStats">
              <div className="statItem">
                <span className="statLabel">Nombre de chapitres:</span>
                <span className="statValue">{total} chapitres</span>
              </div>
            </div>
          </div>

          <div className="chapitresListCard">
            <div className="chapitresList">
              {chapters.length === 0 ? (
                <div className="chapitreListItem">
                  <div className="chapitreListContent">
                    <h3 className="chapitreListName">Aucun chapitre disponible</h3>
                    <span className="videosCount">Ce cours n’a pas encore de chapitres publiés.</span>
                  </div>
                </div>
              ) : (
                chapters.map((chapitre, index) => (
                  <div key={chapitre.id} className="chapitreListItem" role="button" tabIndex={0} onClick={() => openVideo(chapitre.id)} onKeyDown={(event) => event.key === "Enter" && openVideo(chapitre.id)}>
                    <div className="chapitreNumber">{String(chapitre.chapterOrder || index + 1).padStart(2, "0")}</div>
                    <div className="chapitreListContent">
                      <h3 className="chapitreListName">{chapitre.title}</h3>
                      <span className="videosCount">Voir les vidéos</span>
                    </div>
                    <ChevronRightIcon className="chapitreChevron" />
                  </div>
                ))
              )}
            </div>

            <Pagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1 })} />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
};

export default Chapitres;
