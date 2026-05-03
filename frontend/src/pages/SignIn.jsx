import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import { login } from "../service/auth";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => email.trim() && password.trim(), [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: normalizedEmail, password: trimmedPassword });
      navigate("/profile");
    } catch (err) {
      if (err.status === 404) {
        navigate("/signup", { state: { email: normalizedEmail } });
        return;
      }
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="authPage">
        <div className="authShell">
          <div className="authIntro">
            <p className="authKicker">Welcome back</p>
            <h1>Continue your learning journey</h1>
            <p className="authBody">
              Sign in with your email and password. No account yet? We will guide you to sign up.
            </p>
            <div className="authHighlights">
              <div className="authBadge">Video courses</div>
              <div className="authBadge">Personalized path</div>
              <div className="authBadge">24/7 access</div>
            </div>
          </div>

          <div className="authCard">
            <h2>Sign In</h2>
            <p className="authSubtitle">Use the same email you signed up with.</p>

            <form className="authForm" onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {error && <p className="authError">{error}</p>}

              <button className="authButton" type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="authFooter">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SignIn;
