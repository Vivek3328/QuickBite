import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { ROUTES } from "@/constants/routes";
import { AUTH_HERO_IMAGES } from "@/config/authHeroImages";

const copy = {
  customer: {
    badge: "QuickBite",
    pill: "Food in minutes",
    title: "Cravings delivered to your door",
    subtitle:
      "Sign in to explore restaurants near you, build your cart, and pay securely—just like your favourite food apps.",
    perks: ["Live order tracking", "Secure payments", "Top-rated local kitchens"],
  },
  partner: {
    badge: "Partner hub",
    pill: "For restaurants",
    title: "Your kitchen, amplified online",
    subtitle:
      "List your menu, manage orders, and reach hungry customers—all from one clean dashboard built for busy teams.",
    perks: ["Menu & pricing control", "Real-time order alerts", "Simple partner onboarding"],
  },
};

export function AuthHeroPanel({ variant = "customer" }) {
  const c = copy[variant] ?? copy.customer;
  const imageSrc = variant === "partner" ? AUTH_HERO_IMAGES.partner : AUTH_HERO_IMAGES.customer;

  return (
    <section
      className="relative isolate flex h-full min-h-[300px] w-full flex-col overflow-hidden bg-ink-950 text-white sm:min-h-[360px] lg:min-h-screen"
      aria-label="QuickBite"
    >
      {/* Background: fills section; does not affect flex layout */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={imageSrc}
          alt=""
          decoding="async"
          fetchPriority="high"
          className="block h-full w-full object-cover object-[center_35%] sm:object-[center_38%] lg:object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-ink-950/93 via-ink-900/82 to-brand-950/86"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_75%_15%,rgba(249,115,22,0.18),transparent_58%)]"
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-2 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10 xl:px-12 xl:pt-12">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/15"
          >
            <FiArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Home
          </Link>
          <span className="hidden rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-100 backdrop-blur sm:inline">
            {c.pill}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-4 sm:px-8 sm:pb-10 lg:justify-center lg:px-10 lg:pb-12 lg:pt-8 xl:px-12">
          <div className="mx-auto w-full max-w-xl space-y-4 lg:mx-0 lg:max-w-lg lg:space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-200/95 sm:text-xs">
              {c.badge}
            </p>
            <h1 className="font-display text-[1.65rem] font-bold leading-[1.2] tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl xl:text-[2.65rem] xl:leading-[1.15]">
              {c.title}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-[15px] lg:text-base">
              {c.subtitle}
            </p>
            <ul className="flex flex-col gap-2.5 pt-1 sm:gap-3 sm:pt-2">
              {c.perks.map((text) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm font-medium leading-snug text-white/95"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/40 text-xs text-white ring-1 ring-white/20"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
