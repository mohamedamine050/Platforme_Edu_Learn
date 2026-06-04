import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUsers, getClasses } from "../../service/api";
import { UsersIcon, ClassesIcon, CoursesIcon, ChaptersIcon, VideosIcon } from "../../component/Icons";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    // size:1 suffit : on n'utilise que les totaux (totalElements) renvoyés par la pagination.
    Promise.all([
      getUsers({ role: "STUDENT", size: 1 }),
      getUsers({ role: "ADMIN", size: 1 }),
      getClasses({ size: 1 }),
    ])
      .then(([students, admins, classes]) => {
        if (cancelled) return;
        setStats({
          students: students.totalElements,
          admins: admins.totalElements,
          classes: classes.totalElements,
        });
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Chargement des statistiques impossible."); });
    return () => { cancelled = true; };
  }, []);

  const cards = [
    {
      label: "Utilisateurs",
      path: "/admin/users",
      Icon: UsersIcon,
      count: stats ? stats.students + stats.admins : null,
      desc: stats ? `${stats.students} étudiants · ${stats.admins} admins` : "Comptes et rôles",
    },
    {
      label: "Classes",
      path: "/admin/classes",
      Icon: ClassesIcon,
      count: stats ? stats.classes : null,
      desc: "Niveaux et intitulés",
    },
    { label: "Cours", path: "/admin/courses", Icon: CoursesIcon, desc: "Matières par classe" },
    { label: "Chapitres", path: "/admin/chapters", Icon: ChaptersIcon, desc: "Chapitres par cours" },
    { label: "Vidéos", path: "/admin/videos", Icon: VideosIcon, desc: "Vidéos par chapitre" },
    { label: "Documents", path: "/admin/resources", Icon: CoursesIcon, desc: "PDF par chapitre" },
  ];

  return (
    <div className="adminPage">
      <header className="adminPageHeader">
        <div>
          <h1>Tableau de bord</h1>
          <p>Gérez le contenu pédagogique et les comptes de la plateforme.</p>
        </div>
      </header>

      {error && <p className="adminError">{error}</p>}

      <div className="adminCards">
        {cards.map((card) => (
          <NavLink key={card.path} to={card.path} className="adminCard">
            <div className="adminCardTop">
              <span className="adminCardIcon"><card.Icon /></span>
              {card.count != null && <span className="adminCardCount">{card.count}</span>}
            </div>
            <h3>{card.label}</h3>
            <p>{card.desc}</p>
            <span className="adminCardLink">Gérer</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
