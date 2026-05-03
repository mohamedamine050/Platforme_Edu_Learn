import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecondLayout from "../component/SecondLayout";
import { me } from "../service/auth";
import { getCoursesByClass } from "../service/classService";

const Matiere = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatiere = async () => {
      try {
        setLoading(true);
        const currentUser = await me();
        setUser(currentUser);

        if (!currentUser?.classId) {
          throw new Error("Aucune classe associée à ce compte.");
        }

        const classCourses = await getCoursesByClass(currentUser.classId);
        setCourses(classCourses || []);
      } catch (err) {
        setError(err.message || "Impossible de charger les matières.");
        if (err.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMatiere();
  }, [navigate]);

  const getCourseIcon = (title = "") => {
    const normalized = title.toLowerCase();

    if (normalized.includes("math")) return "🧮";
    if (normalized.includes("fran")) return "📖";
    if (normalized.includes("science")) return "🧪";
    if (normalized.includes("anglais")) return "🌍";
    if (normalized.includes("arabe")) return "ع";
    if (normalized.includes("info")) return "💻";
    if (normalized.includes("histoire") || normalized.includes("géographie") || normalized.includes("geographie")) return "🗺️";
    if (normalized.includes("chimie")) return "⚗️";
    return "📘";
  };

  const handleOpenCourse = (courseId) => {
    navigate(`/chapitres/${courseId}`);
  };

  if (loading) {
    return (
      <SecondLayout>
        <section className="matiere">
          <div className="matiereHeader">
            <h1>Matières</h1>
            <p>Chargement des matières de votre classe...</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  if (error) {
    return (
      <SecondLayout>
        <section className="matiere">
          <div className="matiereHeader">
            <h1>Matières</h1>
            <p className="profileError">{error}</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  const classLabel = user?.classTitle ? `${user.classTitle}${user.level ? ` - ${user.level}` : ""}` : "Votre classe";

  return (
    <SecondLayout>
      <section className="matiere">
        <div className="matiereHeader">
          <h1>Matières</h1>
          <p>{classLabel}</p>
        </div>

        <div className="matieresGrid">
          {courses.length === 0 ? (
            <div className="matiereCard">
              <div className="matiereContent">
                <h3>Aucun cours disponible</h3>
                <p>Votre classe n’a pas encore de contenus publiés.</p>
              </div>
            </div>
          ) : (
            courses.map((course) => (
            <div key={course.id} className="matiereCard" role="button" tabIndex={0} onClick={() => handleOpenCourse(course.id)} onKeyDown={(event) => event.key === "Enter" && handleOpenCourse(course.id)}>
              <div className="matiereIconBox">
                <span className="matiereIcon">{getCourseIcon(course.title)}</span>
              </div>
              <div className="matiereContent">
                <h3>{course.title}</h3>
                <p>{course.description || "Cliquez pour voir les chapitres"}</p>
              </div>
            </div>
            ))
          )}
        </div>
      </section>
    </SecondLayout>
  );
};

export default Matiere;
