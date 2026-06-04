import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { resetPassword } from "../service/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => password && confirm, [password, confirm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Lien invalide : token manquant.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate("/signin", {
        state: { notice: "Votre mot de passe a été réinitialisé. Vous pouvez vous connecter." },
      });
    } catch (err) {
      setError(err.message || "Lien invalide ou expiré.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Nouveau mot de passe</p>
            <h1>Choisissez un mot de passe</h1>
            <p className="authBody">
              Saisissez votre nouveau mot de passe. Le lien n'est valable qu'une seule fois.
            </p>
          </div>

          <div className="authCard">
            <h2>Réinitialisation</h2>
            <p className="authSubtitle">Au moins 6 caractères.</p>

            {!token ? (
              <>
                <p className="authError">Lien invalide : aucun token fourni.</p>
                <p className="authFooter">
                  <Link to="/forgot-password">Demander un nouveau lien</Link>
                </p>
              </>
            ) : (
              <form className="authForm" onSubmit={handleSubmit}>
                <label className="authField">
                  <span>Nouveau mot de passe</span>
                  <input
                    className="authInput"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className="authField">
                  <span>Confirmer le mot de passe</span>
                  <input
                    className="authInput"
                    type="password"
                    placeholder="Confirmez le mot de passe"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>

                {error && <p className="authError">{error}</p>}

                <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Validation..." : "Réinitialiser"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ResetPassword;
