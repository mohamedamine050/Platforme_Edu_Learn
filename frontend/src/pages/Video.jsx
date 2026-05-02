import SecondLayout from "../component/SecondLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getChapterById, getVideosByChapter } from "../service/classService";

const Video = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Convert YouTube URL -> embed
  // =========================
  const convertToEmbedUrl = (url) => {
    if (!url) return "";

    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );

    const videoId = match ? match[1] : null;

    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : url;
  };

  // =========================
  // FETCHING (NE PAS TOUCHER)
  // =========================
  useEffect(() => {
    const loadVideoPage = async () => {
      try {
        setLoading(true);

        if (!chapterId) {
          throw new Error("Chapitre introuvable.");
        }

        const [chapterData, videosData] = await Promise.all([
          getChapterById(chapterId),
          getVideosByChapter(chapterId),
        ]);

        const sortedVideos = (videosData || [])
          .slice()
          .sort((a, b) => (a.videoOrder || 0) - (b.videoOrder || 0));

        setChapter(chapterData);
        setVideos(sortedVideos);
        setSelectedVideoIndex(0);
      } catch (err) {
        setError(err.message || "Impossible de charger les vidéos.");
        if (err.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    loadVideoPage();
  }, [chapterId, navigate]);

  const selectedVideo = videos[selectedVideoIndex] || null;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <SecondLayout>
        <div className="videoPageContainer">
          <p>Chargement des vidéos...</p>
        </div>
      </SecondLayout>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <SecondLayout>
        <div className="videoPageContainer">
          <p className="profileError">{error}</p>
          <button className="backButton" onClick={() => navigate("/matiere")}>
            ← Retour aux matières
          </button>
        </div>
      </SecondLayout>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <SecondLayout>
      <div className="videoPageContainer">
        <button className="backButton" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="videoGrid">
          {/* ================= LEFT ================= */}
          <div className="videoSection">
            <div className="videoPlayer">
              {selectedVideo?.videoUrl ? (
                <iframe
                  width="100%"
                  height="400"
                  src={convertToEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <div className="playButton">
                    <span>▶</span>
                  </div>
                  <p className="videoPlaceholder">
                    {selectedVideo
                      ? selectedVideo.title
                      : chapter?.title || "Lecteur vidéo"}
                  </p>
                  <p className="videoSubtext">
                    {selectedVideo?.description ||
                      chapter?.description ||
                      "Sélectionnez une vidéo"}
                  </p>
                </>
              )}
            </div>

            <div className="courseInfoBox">
              <h1 className="courseTitle">
                {chapter?.title || "Chapitre"}
              </h1>

              <div className="courseStats">
                <span>📘 {videos.length} vidéos</span>
                <span>•</span>
                <span>
                  ▶ {selectedVideoIndex + 1} / {videos.length || 1}
                </span>
                <span>•</span>
                <span>
                  Chapitre {chapter?.chapterOrder || "N/A"}
                </span>
              </div>

              <p className="courseDescription">
                {chapter?.description ||
                  "Sélectionnez une vidéo dans la liste."}
              </p>
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
                videos.map((item, index) => (
                  <div
                    key={item.id}
                    className={`contentItem ${
                      index === selectedVideoIndex ? "current" : ""
                    }`}
                    onClick={() => setSelectedVideoIndex(index)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        index === selectedVideoIndex
                          ? "#ede9fe"
                          : "transparent",
                    }}
                  >
                    <div className="itemIcon">
                      {index === selectedVideoIndex ? "▶" : "•"}
                    </div>

                    <div className="itemContent">
                      <p className="itemTitle">{item.title}</p>
                      <span className="itemDuration">
                        {item.description || item.videoUrl}
                      </span>
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

export default Video;