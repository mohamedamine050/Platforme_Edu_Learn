import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { register } from "../service/auth";
import { getClasses } from "../service/classService";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preset = location.state || {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(preset.email || "");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [classesError, setClassesError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setClassesError("");
        const data = await getClasses();
        setClasses(Array.isArray(data) ? data : []);
        
        // Extract unique levels from classes
        if (Array.isArray(data)) {
          const uniqueLevels = [...new Set(data.map(c => c.level))].filter(Boolean).sort();
          setLevels(uniqueLevels);
        }
      } catch (err) {
        setClassesError(err.message || "Unable to load classes.");
      }
    };

    loadClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    if (!level) return [];
    return classes.filter((c) => c.level === level);
  }, [classes, level]);

  const canSubmit = useMemo(
    () => firstName.trim() && lastName.trim() && email.trim() && password.trim() && level && gender && dateOfBirth && classId,
    [firstName, lastName, email, password, level, gender, dateOfBirth, classId]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!firstName.trim() || !lastName.trim() || !normalizedEmail || !trimmedPassword) {
      setError("All fields are required.");
      return;
    }

    if (!classId) {
      setError("Please select a class.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedPhone = phoneNumber.replace(/\D/g, "");
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: trimmedPassword,
        phoneNumber: normalizedPhone ? Number(normalizedPhone) : null,
        level,
        gender,
        dateOfBirth,
        classId: Number(classId),
      });
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Start learning</p>
            <h1>Build your personal study space</h1>
            <p className="authBody">
              Create your EduLearn account in seconds and keep track of your progress across courses.
            </p>
            <div className="authHighlights">
              <div className="authBadge">Smart recommendations</div>
              <div className="authBadge">Flexible schedules</div>
              <div className="authBadge">Certificates</div>
            </div>
          </div>

          <div className="authCard">
            <h2>Create account</h2>
            <p className="authSubtitle">Already have an account? Sign in anytime.</p>

            <form className="authForm" onSubmit={handleSubmit}>
              <label className="authField">
                <span>First name</span>
                <input
                  className="authInput"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="authField">
                <span>Last name</span>
                <input
                  className="authInput"
                  type="text"
                  placeholder="Your last name"
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
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="authField">
                <span>Password</span>
                <input
                  className="authInput"
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>

              <label className="authField">
                <span>Phone </span>
                <input
                  className="authInput"
                  type="tel"
                  placeholder="+216 12 345 678"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  autoComplete="tel"
                />
              </label>

              <label className="authField">
                <span>Level</span>
                <select
                  className="authInput"
                  value={level}
                  onChange={e => { setLevel(e.target.value); setClassId(""); }}
                  required
                >
                  <option value="">Select level</option>
                  {levels.map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
              </label>

              <label className="authField">
                <span>Gender</span>
                <select
                  className="authInput"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </label>

              <label className="authField">
                <span>Date of Birth</span>
                <input
                  className="authInput"
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  required
                />
              </label>

              <label className="authField">
                <span>Class</span>
                <select
                  className="authInput"
                  value={classId}
                  onChange={(event) => setClassId(event.target.value)}
                  required
                  disabled={(!classes.length && !classesError) || !level}
                >
                  <option value="">Select class</option>
                  {filteredClasses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {level && !classesError && filteredClasses.length === 0 && (
                  <span className="authHint">No classes available for selected level.</span>
                )}
                {classesError && <span className="authHint">{classesError}</span>}
              </label>

              {error && <p className="authError">{error}</p>}

              <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="authFooter">
              Have an account? <Link to="/signin">Go to sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SignUp;
