import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { login, logout } from "../service/api";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isAdminAccount, setIsAdminAccount] = useState(false);
  // Message informatif transmis par une autre page (ex : après inscription).
  const notice = location.state?.notice;

  const canSubmit = useMemo(() => email.trim() && password, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNeedsVerification(false);
    setIsAdminAccount(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("L'email et le mot de passe sont obligatoires.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email: normalizedEmail, password });
      // Interface réservée aux étudiants : un compte admin doit passer par l'espace admin.
      // On annule la session ouverte par erreur (symétrique à AdminLogin).
      if (user?.role === "ADMIN") {
        await logout();
        setError("Cette interface est réservée aux étudiants.");
        setIsAdminAccount(true);
        return;
      }
      setAuthenticated(user);
      navigate("/profile");
    } catch (err) {
      if (err.status === 404) {
        navigate("/signup", { state: { email: normalizedEmail } });
        return;
      }
      const message = err.message || "Échec de la connexion.";
      setError(message);
      // Email non vérifié : on propose de renvoyer le lien d'activation.
      if (/vérifier votre adresse/i.test(message)) {
        setNeedsVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Content de vous revoir</p>
            <h1>Poursuivez votre apprentissage</h1>
            <p className="authBody">
              Connectez-vous avec votre email et votre mot de passe. Pas encore de compte ?
              Nous vous guiderons vers l'inscription.
            </p>
            <div className="authHighlights">
              <div className="authBadge">Cours vidéo</div>
              <div className="authBadge">Parcours personnalisé</div>
              <div className="authBadge">Accès 24/7</div>
            </div>
          </div>

          <div className="authCard">
            <h2>Connexion</h2>
            <p className="authSubtitle">Utilisez l'email avec lequel vous vous êtes inscrit.</p>

            {notice && <p className="authNotice">{notice}</p>}

            <form className="authForm" onSubmit={handleSubmit}>
              <label className="authField">
                <span>Email</span>
                <input
                  className="authInput"
                  type="email"
                  placeholder="vous@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="authField">
                <span>Mot de passe</span>
                <input
                  className="authInput"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {error && <p className="authError">{error}</p>}
              {needsVerification && (
                <p className="authFooter">
                  <Link to="/resend-verification" state={{ email: email.trim().toLowerCase() }}>
                    Renvoyer l'email de vérification
                  </Link>
                </p>
              )}
              {isAdminAccount && (
                <p className="authFooter">
                  <Link to="/admin/login">Aller à l'espace administrateur</Link>
                </p>
              )}

              <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="authFooter">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </p>
            <p className="authFooter">
              Nouveau ici ? <Link to="/signup">Créer un compte</Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SignIn;
