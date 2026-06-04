import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Point d'entrée "/matiere" : redirige l'étudiant vers l'URL REST canonique
// /classes/{sa classe}/courses. Les liens de navigation pointent vers /matiere
// (pas besoin de connaître le classId à l'avance).
const MatiereRedirect = () => {
  const { user, status } = useAuth();

  if (status === "loading") return <span aria-live="polite">Chargement...</span>;
  if (!user?.classId) return <Navigate to="/profile" replace />;
  return <Navigate to={`/classes/${user.classId}/courses`} replace />;
};

export default MatiereRedirect;
