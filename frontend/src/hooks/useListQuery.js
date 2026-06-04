import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Gère l'état d'une vue de liste dans l'URL (convention « URL as source of truth »).
// - `page` est 1-based dans l'URL (lisible), à convertir en 0-based pour l'API.
// - les valeurs vides/par défaut sont retirées de l'URL (URL propre).
export function useListQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = useCallback(
    (key, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const page = Number(searchParams.get("page") || 1);

  // Fusionne des changements dans l'URL.
  // options : resetPage (revient page 1), replace (pas d'entrée d'historique, pour le debounce).
  const setParams = useCallback(
    (changes, { resetPage = false, replace = false } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (resetPage) next.delete("page");
          Object.entries(changes).forEach(([key, value]) => {
            const isDefaultPage = key === "page" && Number(value) <= 1;
            if (value === "" || value === null || value === undefined || isDefaultPage) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          return next;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  return { get, page, setParams };
}
