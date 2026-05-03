import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SecondLayout from "../component/SecondLayout";
import { getCourseById, getChaptersByCourse } from "../service/classService";

const Chapitres = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);

        if (!courseId) {
          throw new Error("Cours introuvable.");
        }

        const [courseData, chaptersData] = await Promise.all([
          getCourseById(courseId),
          getChaptersByCourse(courseId),
        ]);

        setCourse(courseData);
        setChapters(chaptersData || []);
      } catch (err) {
        setError(err.message || "Impossible de charger les chapitres.");
        if (err.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, [courseId, navigate]);

  const openVideo = (chapterId) => {
    navigate(`/video/${chapterId}`);
  };

  const totalVideos = chapters.length;

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
              <button className="backButton" onClick={() => navigate("/matiere")}>← Retour aux matières</button>
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
            <button className="backButton" onClick={() => navigate("/matiere")}>← Retour aux matières</button>
            <h1 className="matiereTitle">{course?.title || "Cours"}</h1>
            <p className="matiereDescription">{course?.description || "Liste des chapitres associés à ce cours."}</p>

            <div className="matiereStats">
              <div className="statItem">
                <span className="statLabel">Nombre de chapitres:</span>
                <span className="statValue">{chapters.length} chapitres</span>
              </div>
              <div className="statItem">
                <span className="statLabel">Nombre de vidéos:</span>
                <span className="statValue">{totalVideos} vidéos</span>
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
                chapters
                  .slice()
                  .sort((left, right) => (left.chapterOrder || 0) - (right.chapterOrder || 0))
                  .map((chapitre, index) => (
                    <div key={chapitre.id} className="chapitreListItem" role="button" tabIndex={0} onClick={() => openVideo(chapitre.id)} onKeyDown={(event) => event.key === "Enter" && openVideo(chapitre.id)}>
                      <div className="chapitreNumber">{String(chapitre.chapterOrder || index + 1).padStart(2, "0")}</div>
                      <div className="chapitreListContent">
                        <h3 className="chapitreListName">{chapitre.title}</h3>
                        <span className="videosCount">Voir les vidéos</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SecondLayout>
  );
};

export default Chapitres;
