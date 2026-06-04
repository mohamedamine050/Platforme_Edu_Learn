import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { forgotPassword } from "../service/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim(), [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("L'email est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(normalizedEmail);
      // Message neutre : on ne révèle pas si l'email existe (anti-énumération).
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Mot de passe oublié</p>
            <h1>Réinitialisez votre accès</h1>
            <p className="authBody">
              Saisissez l'email de votre compte. Si un compte existe, vous recevrez un lien
              pour choisir un nouveau mot de passe.
            </p>
          </div>

          <div className="authCard">
            <h2>Réinitialisation</h2>
            <p className="authSubtitle">Un lien vous sera envoyé par email.</p>

            {submitted ? (
              <>
                <p className="authNotice">
                  Si un compte existe avec cet email, un lien de réinitialisation vient d'être
                  envoyé. Pensez à vérifier vos courriers indésirables.
                </p>
                <p className="authFooter">
                  <Link to="/signin">Retour à la connexion</Link>
                </p>
              </>
            ) : (
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

                {error && <p className="authError">{error}</p>}

                <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Envoi..." : "Envoyer le lien"}
                </button>

                <p className="authFooter">
                  <Link to="/signin">Retour à la connexion</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ForgotPassword;
