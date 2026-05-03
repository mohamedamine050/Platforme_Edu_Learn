import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecondLayout from "../component/SecondLayout";
import { me } from "../service/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Mon Profil" : "Mon Profil";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.trim() || "MP"
    : "MP";
  const profileSubtitle = user ? "Gérez vos informations et votre parcours d’apprentissage" : "Chargement de votre espace personnel";

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await me();
        setUser(userData);
      } catch (err) {
        setError(err.message || "Failed to load profile.");
        // Redirect to signin if unauthorized
        if (err.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <SecondLayout>
        <section className="profilePage">
          <div className="profileContainer profileStateCard">
            <p>Chargement du profil...</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  if (error) {
    return (
      <SecondLayout>
        <section className="profilePage">
          <div className="profileContainer profileStateCard">
            <p className="profileError">{error}</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  if (!user) {
    return (
      <SecondLayout>
        <section className="profilePage">
          <div className="profileContainer profileStateCard">
            <p>Aucune donnée utilisateur trouvée.</p>
          </div>
        </section>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <section className="profilePage">
        <div className="profileContainer">
          <div className="profileHero">
            <div>
              <span className="profileEyebrow">Espace personnel</span>
              <h1>{fullName}</h1>
              <p className="profileSubtitle">{profileSubtitle}</p>
            </div>

            <div className="profileAvatar" aria-hidden="true">
              {initials}
            </div>
          </div>

          <div className="profileHighlights">
            <div className="profileHighlightCard">
              <span>Statut</span>
              <strong>{user.isActive ? "Actif" : "Inactif"}</strong>
            </div>
            <div className="profileHighlightCard">
              <span>Niveau</span>
              <strong>{user.level || "N/A"}</strong>
            </div>
            <div className="profileHighlightCard">
              <span>Classe</span>
              <strong>{user.classTitle || "Non assignée"}</strong>
            </div>
          </div>

          <div className="profileContent">
            <div className="profileCard">
              <div className="profileCardHeader">
                <h2>Informations personnelles</h2>
                <p>Détails de votre compte et de votre identité.</p>
              </div>

              <div className="profileFieldGrid">
                <div className="profileField">
                  <label>Prénom</label>
                  <p>{user.firstName || "N/A"}</p>
                </div>
                <div className="profileField">
                  <label>Nom</label>
                  <p>{user.lastName || "N/A"}</p>
                </div>
                <div className="profileField profileFieldWide">
                  <label>Email</label>
                  <p>{user.email || "N/A"}</p>
                </div>
                <div className="profileField">
                  <label>Téléphone</label>
                  <p>{user.phoneNumber || "N/A"}</p>
                </div>
                <div className="profileField">
                  <label>Date de naissance</label>
                  <p>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="profileField">
                  <label>Genre</label>
                  <p>{user.gender || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="profileCard">
              <div className="profileCardHeader">
                <h2>Information de classe</h2>
                <p>Votre progression scolaire actuelle.</p>
              </div>

              <div className="profileFieldGrid compact">
                <div className="profileField">
                  <label>Niveau</label>
                  <p>{user.level || "N/A"}</p>
                </div>
                <div className="profileField">
                  <label>Classe</label>
                  <p>{user.classTitle || "Non assignée"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SecondLayout>
  );
};

export default Profile;
