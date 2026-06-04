import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { LogoMark } from "../../component/Icons";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim() && password, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Email et mot de passe requis.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email: normalizedEmail, password });
      if (user?.role !== "ADMIN") {
        // Mauvais rôle : on annule la session ouverte par erreur (cookie JWT + sessionId).
        await logout();
        setError("Accès réservé aux administrateurs.");
        return;
      }
      setAuthenticated(user);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Connexion échouée.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="adminLoginPage">
      <div className="adminLoginCard">
        <div className="adminLoginBrand">
          <span className="adminBrandMark"><LogoMark /></span>
          <span>EduLearn Admin</span>
        </div>
        <h1>Espace administrateur</h1>
        <p className="adminLoginSubtitle">Connectez-vous pour gérer la plateforme.</p>

        <form className="adminForm" onSubmit={handleSubmit}>
          <label className="adminField">
            <span>Email</span>
            <input
              className="adminInput"
              type="email"
              placeholder="admin@edulearn.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="adminField">
            <span>Mot de passe</span>
            <input
              className="adminInput"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="adminError">{error}</p>}

          <button className="adminBtn adminBtnPrimary" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
