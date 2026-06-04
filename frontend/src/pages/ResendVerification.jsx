import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { resendVerification } from "../service/api";

const ResendVerification = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
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
      await resendVerification(normalizedEmail);
      // Message neutre : on ne révèle pas si l'email existe / est déjà vérifié.
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
            <p className="authKicker">Vérification d'email</p>
            <h1>Renvoyer le lien de vérification</h1>
            <p className="authBody">
              Lien expiré ou email non reçu ? Saisissez votre adresse et nous vous renverrons
              un nouveau lien d'activation.
            </p>
          </div>

          <div className="authCard">
            <h2>Renvoyer l'email</h2>
            <p className="authSubtitle">Un nouveau lien vous sera envoyé.</p>

            {submitted ? (
              <>
                <p className="authNotice">
                  Si un compte non vérifié existe avec cet email, un nouveau lien d'activation
                  vient d'être envoyé. Pensez à vérifier vos courriers indésirables.
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
                  {isSubmitting ? "Envoi..." : "Renvoyer le lien"}
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

export default ResendVerification;
