import { useState } from "react";

const buildInitialState = (fields, initialValues) => {
  const state = {};
  fields.forEach((field) => {
    const value = initialValues?.[field.name];
    if (field.type === "multiselect" || field.type === "sectionprices") {
      state[field.name] = Array.isArray(value) ? value : [];
    } else {
      state[field.name] = value === undefined || value === null ? "" : value;
    }
  });
  return state;
};

const resolveFields = (fields, values) => (typeof fields === "function" ? fields(values) : fields);

const AdminFormModal = ({ title, fields, initialValues, onSubmit, onClose, submitting, error }) => {
  const [values, setValues] = useState(() =>
    buildInitialState(resolveFields(fields, initialValues || {}), initialValues),
  );

  const visibleFields = resolveFields(fields, values);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="adminModalOverlay" role="dialog" aria-modal="true">
      <div className="adminModal">
        <div className="adminModalHeader">
          <h2>{title}</h2>
          <button className="adminModalClose" type="button" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <form className="adminForm" onSubmit={handleSubmit}>
          {visibleFields.map((field) => (
            <label className="adminField" key={field.name}>
              <span>
                {field.label}
                {field.required && <em className="adminRequired"> *</em>}
              </span>

              {field.type === "textarea" ? (
                <textarea
                  className="adminInput"
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  required={field.required}
                  rows={3}
                />
              ) : field.type === "multiselect" ? (
                <div className="adminMultiselect">
                  {(!field.options || field.options.length === 0) ? (
                    <span className="adminHint">{field.emptyLabel || "Aucune option"}</span>
                  ) : (
                    field.options.map((opt) => {
                      const current = Array.isArray(values[field.name]) ? values[field.name] : [];
                      const checked = current.includes(opt.value);
                      return (
                        <label key={opt.value} className="adminCheck">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleChange(
                                field.name,
                                checked ? current.filter((v) => v !== opt.value) : [...current, opt.value],
                              )
                            }
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              ) : field.type === "sectionprices" ? (
                <div className="adminSectionRows">
                  {(Array.isArray(values[field.name]) ? values[field.name] : []).map((row, idx) => (
                    <div className="adminSectionRow" key={idx}>
                      <input
                        className="adminInput"
                        type="text"
                        placeholder="Nom de la section"
                        value={row.name ?? ""}
                        onChange={(event) => {
                          const next = [...values[field.name]];
                          next[idx] = { ...next[idx], name: event.target.value };
                          handleChange(field.name, next);
                        }}
                      />
                      <input
                        className="adminInput"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Prix"
                        value={row.price ?? ""}
                        onChange={(event) => {
                          const next = [...values[field.name]];
                          next[idx] = { ...next[idx], price: event.target.value };
                          handleChange(field.name, next);
                        }}
                      />
                      <button
                        type="button"
                        className="adminBtn adminBtnDanger"
                        onClick={() => handleChange(field.name, values[field.name].filter((_, i) => i !== idx))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="adminBtn adminBtnGhost"
                    onClick={() => handleChange(field.name, [...(values[field.name] || []), { name: "", price: "" }])}
                  >
                    + Ajouter une section
                  </button>
                </div>
              ) : field.type === "select" ? (
                <select
                  className="adminInput"
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  required={field.required}
                >
                  <option value="">— Sélectionner —</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="adminInput"
                  type={field.type || "text"}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  required={field.required}
                  placeholder={field.placeholder || ""}
                  step={field.step}
                  min={field.min}
                />
              )}
            </label>
          ))}

          {error && <p className="adminError">{error}</p>}

          <div className="adminModalActions">
            <button className="adminBtn adminBtnGhost" type="button" onClick={onClose} disabled={submitting}>
              Annuler
            </button>
            <button className="adminBtn adminBtnPrimary" type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;
