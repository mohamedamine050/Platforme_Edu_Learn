import SecondLayout from "../component/SecondLayout";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  // Profil rendu sous <PrivateRoute> : l'utilisateur est déjà chargé dans le contexte,
  // pas besoin de rappeler me() ici.
  const { user, status } = useAuth();

  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Mon Profil" : "Mon Profil";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.trim() || "MP"
    : "MP";
  const roleLabel = user?.role === "ADMIN" ? "Administrateur" : "Étudiant";

  if (status === "loading") {
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
        <div className="profileWrap">
          <header className="profilePageHead">
            <h1>Mon profil</h1>
            <p>Vos informations personnelles</p>
          </header>

          <div className="profileHeader">
            <div className="profileBanner" />
            <div className="profileHeaderRow">
              <div className="profileAvatar" aria-hidden="true">{initials}</div>
              <div className="profileHeaderInfo">
                <h2>{fullName}</h2>
                <p>{user.email}</p>
              </div>
              <div className="profileHeaderMeta">
                <span className="profileRoleBadge">{roleLabel}</span>
                <span className={`profileStatus ${user.isActive ? "isActive" : "isInactive"}`}>
                  <span className="profileStatusDot" />
                  {user.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          </div>

          <div className="profileGrid">
            <section className="profilePanel">
              <h3 className="profilePanelTitle">Coordonnées</h3>
              <div className="profileFields">
                <div className="profileField">
                  <span className="profileFieldLabel">Email</span>
                  <span className="profileFieldValue">{user.email || "—"}</span>
                </div>
                <div className="profileField">
                  <span className="profileFieldLabel">Téléphone</span>
                  <span className="profileFieldValue">{user.phoneNumber || "—"}</span>
                </div>
              </div>
            </section>

            <section className="profilePanel">
              <h3 className="profilePanelTitle">Scolarité</h3>
              <div className="profileFields">
                <div className="profileField">
                  <span className="profileFieldLabel">Niveau</span>
                  <span className="profileFieldValue">{user.level || "—"}</span>
                </div>
                <div className="profileField">
                  <span className="profileFieldLabel">Classe</span>
                  <span className="profileFieldValue">{user.classTitle || "Non assignée"}</span>
                </div>
              </div>
            </section>

            <section className="profilePanel">
              <h3 className="profilePanelTitle">Identité</h3>
              <div className="profileFields">
                <div className="profileField">
                  <span className="profileFieldLabel">Date de naissance</span>
                  <span className="profileFieldValue">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="profileField">
                  <span className="profileFieldLabel">Genre</span>
                  <span className="profileFieldValue">{user.gender || "—"}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </SecondLayout>
  );
};

export default Profile;
