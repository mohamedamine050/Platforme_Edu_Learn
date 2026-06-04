import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { verifyEmail } from "../service/api";

const STATUS = { LOADING: "loading", SUCCESS: "success", ERROR: "error" };

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // État initial dérivé au rendu (pas dans l'effet) : si le token manque, on est
  // déjà en erreur sans déclencher de setState synchrone dans useEffect.
  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.ERROR);
  const [message, setMessage] = useState(token ? "" : "Lien invalide : aucun token fourni.");
  // Évite un double appel (StrictMode monte deux fois en dev) : le token est à usage unique.
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    verifyEmail(token)
      .then(() => {
        setStatus(STATUS.SUCCESS);
        setMessage("Votre adresse email a été vérifiée. Vous pouvez maintenant vous connecter.");
      })
      .catch((err) => {
        setStatus(STATUS.ERROR);
        setMessage(err.message || "Lien invalide ou expiré.");
      });
  }, [token]);

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Vérification de l'email</p>
            <h1>Activation de votre compte</h1>
          </div>

          <div className="authCard">
            <h2>Vérification</h2>

            {status === STATUS.LOADING && (
              <p className="authSubtitle" role="status">Vérification en cours…</p>
            )}

            {status === STATUS.SUCCESS && (
              <>
                <p className="authNotice">{message}</p>
                <p className="authFooter">
                  <Link to="/signin">Se connecter</Link>
                </p>
              </>
            )}

            {status === STATUS.ERROR && (
              <>
                <p className="authError">{message}</p>
                <p className="authFooter">
                  Lien expiré ? <Link to="/signin">Connectez-vous</Link> pour en demander un nouveau.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default VerifyEmail;
