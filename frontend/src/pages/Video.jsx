import SecondLayout from "../component/SecondLayout";
import Pagination from "../component/Pagination";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getChapterById, getVideosByChapter, getResourcesByChapter } from "../service/api";
import { useListQuery } from "../hooks/useListQuery";
import { BookIcon, PlayIcon, ArrowLeftIcon, PdfIcon, DownloadIcon, LockIcon } from "../component/Icons";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 8;

const Video = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classId, courseId, chapterId } = useParams();
  const { get, page, setParams } = useListQuery();
  const selectedVideoId = get("v");

  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Convertit une URL YouTube/Drive en URL embarquable.
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
    return url;
  };

  // Miniature de la vidéo.
  const getThumbnail = (url) => {
    if (!url) return "";
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`;
    const drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w320`;
    return "";
  };

  useEffect(() => {
    if (!chapterId) return;
    let active = true;
    (async () => {
      try {
        const [chapterData, videosRes, resourcesRes] = await Promise.all([
          getChapterById(chapterId),
          getVideosByChapter(chapterId, { page: page - 1, size: PAGE_SIZE }),
          getResourcesByChapter(chapterId, { size: 1000 }),
        ]);
        if (active) {
          setChapter(chapterData);
          setVideos(videosRes.content ?? []);
          setResources(resourcesRes.content ?? []);
          setTotalPages(videosRes.totalPages);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Impossible de charger les vidéos.");
          if (err.status === 401) navigate("/signin");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [chapterId, page, navigate]);

  // Vidéo sélectionnée dérivée de l'URL (?v=). Défaut : la 1re de la page.
  const selectedIndex = Math.max(0, videos.findIndex((v) => v.id === selectedVideoId));
  const selectedVideo = videos[selectedIndex] || null;

  // Contenu verrouillé tant qu'aucun abonnement actif ne couvre la classe du chapitre.
  // L'info vient du backend (chapter.accessGranted) : admin ou abonnement actif = déverrouillé.
  const locked = user?.role === "STUDENT" && chapter != null && !chapter.accessGranted;

  if (loading) {
    return (
      <SecondLayout>
        <div className="videoPageContainer">
          <p>Chargement des vidéos...</p>
        </div>
      </SecondLayout>
    );
  }

  if (error) {
    return (
      <SecondLayout>
        <div className="videoPageContainer">
          <p className="profileError">{error}</p>
          <button className="backButton" onClick={() => navigate("/matiere")}>
            <ArrowLeftIcon className="backIcon" /> Retour aux matières
          </button>
        </div>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <div className="videoPageContainer">
        <nav className="breadcrumb">
          <Link className="breadcrumbLink" to={`/classes/${classId}/courses`}>Matières</Link>
          <span className="breadcrumbSep">›</span>
          <Link className="breadcrumbLink" to={`/classes/${classId}/courses/${courseId}/chapters`}>
            {chapter?.courseTitle || "Cours"}
          </Link>
          <span className="breadcrumbSep">›</span>
          <span className="breadcrumbCurrent">{chapter?.title || "Chapitre"}</span>
        </nav>

        <button className="backButton" onClick={() => navigate(`/classes/${classId}/courses/${courseId}/chapters`)}>
          <ArrowLeftIcon className="backIcon" /> Retour aux chapitres
        </button>

        <div className="videoGrid">
          {/* ================= LEFT ================= */}
          <div className="videoSection">
            <div className="videoPlayer">
              {locked ? (
                <div className="videoLock">
                  <span className="videoLockIcon"><LockIcon /></span>
                  <p className="videoLockTitle">
                    Prêt à commencer à apprendre ? Débloque ce cours dès aujourd'hui.
                  </p>
                  <Link className="videoLockLink" to="/assistance">Déverrouiller l'accès complet</Link>
                </div>
              ) : selectedVideo?.videoUrl ? (
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  src={convertToEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <div className="playButton">
                    <PlayIcon />
                  </div>
                  <p className="videoPlaceholder">
                    {selectedVideo ? selectedVideo.title : chapter?.title || "Lecteur vidéo"}
                  </p>
                  <p className="videoSubtext">
                    {selectedVideo?.description || chapter?.description || "Sélectionnez une vidéo"}
                  </p>
                </>
              )}
            </div>

            <div className="courseInfoBox">
              <h1 className="courseTitle">{chapter?.title || "Chapitre"}</h1>

              <div className="courseStats">
                <span className="statChip"><BookIcon className="statIcon" /> {videos.length} vidéos</span>
                <span>•</span>
                <span className="statChip">
                  <PlayIcon className="statIcon" /> {selectedIndex + 1} / {videos.length || 1}
                </span>
                <span>•</span>
                <span>Chapitre {chapter?.chapterOrder || "N/A"}</span>
              </div>

              <p className="courseDescription">
                {chapter?.description || "Sélectionnez une vidéo dans la liste."}
              </p>

              {!locked && resources.length > 0 && (
                <div className="resourcesBox">
                  <h3 className="resourcesTitle">Documents du chapitre</h3>
                  <ul className="resourcesList">
                    {resources.map((res) => (
                      <li key={res.id}>
                        <a className="resourceLink" href={res.fileUrl} target="_blank" rel="noreferrer">
                          <PdfIcon className="resourceIcon" />
                          <span className="resourceName">{res.name}</span>
                          <DownloadIcon className="resourceDownload" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="contentSection">
            <div className="contentHeader">
              <h2>Vidéos du chapitre</h2>
            </div>

            <div className="contentList">
              {videos.length === 0 ? (
                <div className="contentItem">
                  <p>Aucune vidéo disponible</p>
                </div>
              ) : (
                videos.map((item) => (
                  <div
                    key={item.id}
                    className={`contentItem ${item.id === selectedVideo?.id ? "current" : ""} ${locked ? "isLocked" : ""}`}
                    {...(locked
                      ? {}
                      : {
                          role: "button",
                          tabIndex: 0,
                          onClick: () => setParams({ v: item.id }),
                          onKeyDown: (event) => event.key === "Enter" && setParams({ v: item.id }),
                        })}
                  >
                    <div className="itemThumb">
                      {!locked && getThumbnail(item.videoUrl) && (
                        <img
                          className="itemThumbImg"
                          src={getThumbnail(item.videoUrl)}
                          alt=""
                          loading="lazy"
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                      )}
                      <span className="itemThumbOverlay">
                        {locked ? <LockIcon className="itemPlayIcon" /> : <PlayIcon className="itemPlayIcon" />}
                      </span>
                    </div>

                    <div className="itemContent">
                      <p className="itemTitle">{item.title}</p>
                      <span className="itemDuration">
                        {locked ? "Verrouillé" : (item.description || item.videoUrl)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Pagination page={page - 1} totalPages={totalPages} onChange={(p) => setParams({ page: p + 1, v: null })} />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
};

export default Video;
