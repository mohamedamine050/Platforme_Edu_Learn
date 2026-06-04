import { useMemo, useState } from "react";

/**
 * Champ texte avec suggestions stylées : en tapant, affiche les valeurs
 * existantes correspondantes. L'utilisateur peut en choisir une ou saisir
 * une nouvelle valeur (saisie libre conservée).
 */
const Autocomplete = ({ value, onChange, options = [], placeholder, required, id, name }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const filtered = useMemo(() => {
    const q = (value || "").trim().toLowerCase();
    // Aucune suggestion tant que rien n'est saisi (pas d'affichage au clic).
    if (!q) return [];
    return options
      .filter((o) => o.toLowerCase().includes(q) && o.toLowerCase() !== q)
      .slice(0, 8);
  }, [value, options]);

  const show = open && filtered.length > 0;

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
    setHighlight(-1);
  };

  const handleKeyDown = (e) => {
    if (!show) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      select(filtered[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="autocomplete">
      <input
        id={id}
        name={name}
        className="authInput"
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        required={required}
        role="combobox"
        aria-expanded={show}
        aria-autocomplete="list"
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(-1); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {show && (
        <ul className="autocompleteList" role="listbox">
          {filtered.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={i === highlight}
              className={`autocompleteItem${i === highlight ? " isActive" : ""}`}
              // onMouseDown (avant le blur) pour que le clic enregistre la sélection.
              onMouseDown={(e) => { e.preventDefault(); select(opt); }}
              onMouseEnter={() => setHighlight(i)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
