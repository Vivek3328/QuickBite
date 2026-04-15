import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import successImg from "@/assets/success.png";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4.25rem)] flex-col items-center justify-center bg-gradient-to-b from-emerald-50/80 to-ink-50 px-4 py-16">
      <div className="surface-card max-w-md border-0 p-10 text-center shadow-card-hover">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100">
          <img src={successImg} alt="" className="h-12 w-12 object-contain" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">
          Payment successful
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Thank you for your order. You can review it anytime under My orders.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.userOrders)}
          className="btn-primary mt-8 w-full !py-3"
        >
          View my orders
        </button>
      </div>
    </div>
  );
}
