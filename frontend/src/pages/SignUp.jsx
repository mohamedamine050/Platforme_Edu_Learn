import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { register, getClasses, getRegistrationOptions } from "../service/api";
import Autocomplete from "../component/Autocomplete";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preset = location.state || {};

  // Assistant en 2 étapes : 1) compte, 2) profil scolaire.
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(preset.email || "");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [establishmentOptions, setEstablishmentOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [classesError, setClassesError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setClassesError("");
        const res = await getClasses({ size: 1000 });
        const data = res.content ?? [];
        setClasses(data);

        // Niveaux uniques extraits des classes.
        const uniqueLevels = [...new Set(data.map(c => c.level))].filter(Boolean).sort();
        setLevels(uniqueLevels);
      } catch (err) {
        setClassesError(err.message || "Impossible de charger les classes.");
      }
    };

    loadClasses();
  }, []);

  // Charge les établissements/régions déjà saisis (pour l'auto-complétion).
  useEffect(() => {
    getRegistrationOptions()
      .then((data) => {
        setEstablishmentOptions(Array.isArray(data?.establishments) ? data.establishments : []);
        setRegionOptions(Array.isArray(data?.regions) ? data.regions : []);
      })
      .catch(() => {});
  }, []);

  // Classes du niveau choisi.
  const filteredClasses = useMemo(() => {
    if (!level) return [];
    return classes.filter((c) => c.level === level);
  }, [classes, level]);

  // Classe actuellement sélectionnée.
  const selectedClass = useMemo(
    () => classes.find((c) => String(c.id) === String(classId)) || null,
    [classes, classId]
  );

  // Sections proposées par la classe choisie.
  const sections = useMemo(
    () => (selectedClass?.sections ? [...selectedClass.sections] : []),
    [selectedClass]
  );

  // La section est obligatoire seulement si la classe choisie en propose.
  const sectionRequired = sections.length > 0;

  // Étape 1 valide : informations de compte renseignées.
  const canContinue = useMemo(
    () => firstName.trim() && lastName.trim() && email.trim() && password.length >= 6,
    [firstName, lastName, email, password]
  );

  // Étape 2 valide : profil scolaire complet (en plus de l'étape 1).
  const canSubmit = useMemo(
    () =>
      canContinue &&
      level && establishment.trim() && region.trim() && gender && dateOfBirth && classId &&
      (!sectionRequired || section),
    [canContinue, level, establishment, region, gender, dateOfBirth, classId, sectionRequired, section]
  );

  // Valide l'étape 1 puis passe à l'étape 2.
  const goNext = () => {
    setError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Renseigne tes informations de compte.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setStep(2);
  };

  const goBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // À l'étape 1, le « submit » (clic ou touche Entrée) avance simplement à l'étape 2.
    if (step === 1) {
      goNext();
      return;
    }

    setError("");
    const normalizedEmail = email.trim().toLowerCase();

    if (!classId) {
      setError("Veuillez sélectionner une classe.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password,
        phoneNumber: phoneNumber.trim() || null,
        level,
        section: section || null,
        establishment: establishment.trim(),
        region: region.trim(),
        gender,
        dateOfBirth,
        classId,
      });
      navigate("/signin", {
        state: {
          notice:
            "Votre compte a été créé. Un email de vérification vient de vous être envoyé : " +
            "cliquez sur le lien reçu pour activer votre compte avant de vous connecter.",
        },
      });
    } catch (err) {
      setError(err.message || "Échec de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Commencez à apprendre</p>
            <h1>Créez votre espace d'étude personnel</h1>
            <p className="authBody">
              Créez votre compte EduLearn en quelques secondes et suivez votre progression dans tous vos cours.
            </p>
            <div className="authHighlights">
              <div className="authBadge">Recommandations intelligentes</div>
              <div className="authBadge">Horaires flexibles</div>
              <div className="authBadge">Certificats</div>
            </div>
          </div>

          <div className="authCard">
            <h2>Créer un compte</h2>
            <p className="authSubtitle">
              {step === 1 ? "Étape 1 — tes informations de compte." : "Étape 2 — ton profil scolaire."}
            </p>

            {/* Indicateur d'étapes */}
            <div className="authSteps">
              <div className={`authStep${step >= 1 ? " isActive" : ""}`}>
                <span className="authStepNum">1</span>
                <span className="authStepLabel">Compte</span>
              </div>
              <span className="authStepBar" />
              <div className={`authStep${step >= 2 ? " isActive" : ""}`}>
                <span className="authStepNum">2</span>
                <span className="authStepLabel">Profil</span>
              </div>
            </div>

            <form className="authForm" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <label className="authField">
                    <span>Prénom</span>
                    <input
                      className="authInput"
                      type="text"
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </label>

                  <label className="authField">
                    <span>Nom</span>
                    <input
                      className="authInput"
                      type="text"
                      placeholder="Votre nom"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </label>

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
                      placeholder="Créez un mot de passe sécurisé"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </label>

                  <label className="authField">
                    <span>Téléphone</span>
                    <input
                      className="authInput"
                      type="tel"
                      placeholder="+216 12 345 678"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      autoComplete="tel"
                    />
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="authField">
                    <span>Niveau</span>
                    <select
                      className="authInput"
                      value={level}
                      onChange={e => { setLevel(e.target.value); setSection(""); setClassId(""); }}
                      required
                    >
                      <option value="">Sélectionnez un niveau</option>
                      {levels.map((lv) => (
                        <option key={lv} value={lv}>
                          {lv}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="authField">
                    <span>Classe</span>
                    <select
                      className="authInput"
                      value={classId}
                      onChange={(event) => { setClassId(event.target.value); setSection(""); }}
                      required
                      disabled={(!classes.length && !classesError) || !level}
                    >
                      <option value="">Sélectionnez une classe</option>
                      {filteredClasses.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    {level && !classesError && filteredClasses.length === 0 && (
                      <span className="authHint">Aucune classe disponible pour ce niveau.</span>
                    )}
                    {classesError && <span className="authHint">{classesError}</span>}
                  </label>

                  {selectedClass && (
                    <label className="authField">
                      <span>Section</span>
                      {sectionRequired ? (
                        <select
                          className="authInput"
                          value={section}
                          onChange={e => setSection(e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez une section</option>
                          {sections.map((sec) => (
                            <option key={sec.id ?? sec.name} value={sec.name}>
                              {sec.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="authHint">Cette classe n'a pas de sections.</span>
                      )}
                    </label>
                  )}

                  <label className="authField">
                    <span>Établissement</span>
                    <Autocomplete
                      value={establishment}
                      onChange={setEstablishment}
                      options={establishmentOptions}
                      placeholder="Lycée Pilote, Lycée Bourguiba…"
                      required
                    />
                  </label>

                  <label className="authField">
                    <span>Région</span>
                    <Autocomplete
                      value={region}
                      onChange={setRegion}
                      options={regionOptions}
                      placeholder="Tunis, Sfax, Sousse…"
                      required
                    />
                  </label>

                  <label className="authField">
                    <span>Genre</span>
                    <select
                      className="authInput"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      required
                    >
                      <option value="">Sélectionnez un genre</option>
                      <option value="HOMME">Homme</option>
                      <option value="FEMME">Femme</option>
                    </select>
                  </label>

                  <label className="authField">
                    <span>Date de naissance</span>
                    <input
                      className="authInput"
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      required
                    />
                  </label>
                </>
              )}

              {error && <p className="authError">{error}</p>}

              {step === 1 ? (
                <button className="authButton" type="submit" disabled={!canContinue}>
                  Continuer
                </button>
              ) : (
                <div className="authActions">
                  <button className="authButtonGhost" type="button" onClick={goBack}>
                    Retour
                  </button>
                  <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Création..." : "Créer un compte"}
                  </button>
                </div>
              )}
            </form>

            <p className="authFooter">
              Vous avez un compte ? <Link to="/signin">Se connecter</Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SignUp;
