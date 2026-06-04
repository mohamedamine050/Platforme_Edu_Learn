import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { me } from "../service/api";

const AuthContext = createContext(null);

// Source unique de l'état d'authentification : `me()` n'est appelé qu'une fois
// au démarrage, puis l'état est partagé par toutes les routes (plus d'appel
// réseau redondant ni de flash "Chargement..." à chaque navigation).
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | unauthenticated

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await me();
      setUser(data);
      setStatus("authenticated");
      return data;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  // Au montage : on récupère l'utilisateur courant une seule fois.
  // setState n'est appelé que dans le callback asynchrone (pas synchrone dans l'effet).
  useEffect(() => {
    let active = true;
    me()
      .then((data) => { if (active) { setUser(data); setStatus("authenticated"); } })
      .catch(() => { if (active) { setUser(null); setStatus("unauthenticated"); } });
    return () => { active = false; };
  }, []);

  // Après un login réussi : l'utilisateur est déjà connu, pas besoin de re-fetch.
  const setAuthenticated = useCallback((data) => {
    setUser(data);
    setStatus(data ? "authenticated" : "unauthenticated");
  }, []);

  // Après un logout.
  const clear = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, refresh, setAuthenticated, clear }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return ctx;
};
