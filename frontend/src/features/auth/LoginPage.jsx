import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
import { loginUser as apiLoginUser, registerUser } from "@/api/userAuth";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { loginUser: persistUserSession } = useAuth();

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (isSignup && formData.name.length < 5) {
      newErrors.name = "Name must be at least 5 characters long.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await registerUser(formData);
        setIsSignup(false);
        setFormData({ name: "", email: "", password: "" });
      } else {
        const data = await apiLoginUser({
          email: formData.email,
          password: formData.password,
        });
        persistUserSession(data.authtoken);
        navigate(ROUTES.home);
      }
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = "relative";
  const inputIcon =
    "pointer-events-none absolute left-3.5 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-ink-400";
  const inputClass =
    "w-full rounded-2xl border border-ink-200/90 bg-ink-50/50 py-3 pl-11 pr-4 text-[15px] text-ink-900 shadow-sm transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-ink-50 lg:grid lg:min-h-[100dvh] lg:min-h-screen lg:grid-cols-[1fr_minmax(0,520px)] lg:items-stretch xl:grid-cols-[1.1fr_minmax(0,480px)]">
      <AuthHeroPanel />

      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:min-h-screen lg:px-10 lg:py-12 xl:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              {isSignup
                ? "Join QuickBite and order from restaurants you love."
                : "Enter your details to continue to restaurants and checkout."}
            </p>
          </div>

          <div className="rounded-3xl border border-ink-100/90 bg-white p-6 shadow-[0_4px_6px_-1px_rgb(15_23_42_/_0.06),0_20px_50px_-12px_rgb(15_23_42_/_0.12)] sm:p-8">
            {errors.general && (
              <div
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-left text-sm text-red-800"
                role="alert"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                  !
                </span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="mb-1.5 block text-sm font-semibold text-ink-700"
                  >
                    Full name
                  </label>
                  <div className={inputWrap}>
                    <FiUser className={inputIcon} aria-hidden />
                    <input
                      id="auth-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-sm font-semibold text-ink-700"
                >
                  Email
                </label>
                <div className={inputWrap}>
                  <FiMail className={inputIcon} aria-hidden />
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                    placeholder="you@email.com"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 block text-sm font-semibold text-ink-700"
                >
                  Password
                </label>
                <div className={inputWrap}>
                  <FiLock className={inputIcon} aria-hidden />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-12 ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiLoader className="h-5 w-5 animate-spin" aria-hidden />
                    Please wait…
                  </>
                ) : isSignup ? (
                  "Create account"
                ) : (
                  "Sign in & continue"
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-ink-100" />
              </div>
              <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-ink-400">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            <p className="text-center text-[15px] text-ink-600">
              {isSignup ? "Already have an account?" : "New to QuickBite?"}{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-semibold text-brand-700 underline-offset-2 hover:text-brand-800 hover:underline"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>

            <p className="mt-8 border-t border-ink-100 pt-6 text-center text-sm text-ink-500">
              Running a restaurant?{" "}
              <Link
                to={ROUTES.addRestaurant}
                className="font-semibold text-brand-700 underline-offset-2 hover:underline"
              >
                Partner portal
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-ink-400">
            By continuing, you agree to our terms of service and acknowledge our approach to
            handling your account data for ordering.
          </p>
        </div>
      </div>
    </div>
  );
}
