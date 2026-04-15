import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  adminListCoupons,
  adminCreateCoupon,
  adminDeleteCoupon,
  adminListRestaurants,
  adminSetRestaurantActive,
} from "@/api/admin";

const SESSION_KEY = "quickbite_admin_key";

export default function OpsConsolePage() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) || "");
  const [connected, setConnected] = useState(Boolean(sessionStorage.getItem(SESSION_KEY)));
  const [coupons, setCoupons] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: 10,
    minAmount: 0,
    maxUses: "",
    isActive: true,
  });

  const refresh = useCallback(async () => {
    const key = sessionStorage.getItem(SESSION_KEY);
    if (!key) return;
    setLoading(true);
    try {
      const [c, r] = await Promise.all([adminListCoupons(key), adminListRestaurants(key)]);
      setCoupons(c.coupons ?? []);
      setRestaurants(r.restaurants ?? []);
      setConnected(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Could not load ops data");
      setConnected(false);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) refresh();
  }, [refresh]);

  const connect = () => {
    const k = adminKey.trim();
    if (!k) {
      toast.error("Enter admin API key");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, k);
    refresh();
  };

  const disconnect = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setConnected(false);
    setCoupons([]);
    setRestaurants([]);
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    const key = sessionStorage.getItem(SESSION_KEY);
    if (!key) return;
    try {
      await adminCreateCoupon(key, {
        code: newCoupon.code.toUpperCase(),
        type: newCoupon.type,
        value: Number(newCoupon.value),
        minAmount: Number(newCoupon.minAmount) || 0,
        maxUses: newCoupon.maxUses === "" ? undefined : Number(newCoupon.maxUses),
        isActive: newCoupon.isActive,
      });
      toast.success("Coupon created");
      setNewCoupon({
        code: "",
        type: "percentage",
        value: 10,
        minAmount: 0,
        maxUses: "",
        isActive: true,
      });
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Create failed");
    }
  };

  const removeCoupon = async (id) => {
    const key = sessionStorage.getItem(SESSION_KEY);
    if (!key) return;
    try {
      await adminDeleteCoupon(key, id);
      toast.success("Coupon removed");
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Delete failed");
    }
  };

  const toggleRestaurant = async (r) => {
    const key = sessionStorage.getItem(SESSION_KEY);
    if (!key) return;
    const visible = r.isActive !== false;
    try {
      await adminSetRestaurantActive(key, r._id, !visible);
      toast.success("Restaurant updated");
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink-900">Operations</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-600">
        Requires <code className="rounded bg-ink-100 px-1">ADMIN_API_KEY</code> on the server and
        the same value here. Use for coupons and listing visibility — not for end users.
      </p>

      <div className="surface-card mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="admin-key" className="text-sm font-semibold text-ink-800">
            Admin API key
          </label>
          <input
            id="admin-key"
            type="password"
            autoComplete="off"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="input-field mt-2"
            placeholder="Paste key from backend .env"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={connect} className="btn-primary shrink-0">
            Connect
          </button>
          <button type="button" onClick={disconnect} className="btn-secondary shrink-0">
            Disconnect
          </button>
        </div>
      </div>

      {!connected ? (
        <p className="mt-8 text-center text-sm text-ink-500">Connect to manage coupons and restaurants.</p>
      ) : loading ? (
        <p className="mt-8 text-center text-ink-600">Loading…</p>
      ) : (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="font-display text-xl font-bold text-ink-900">Coupons</h2>
            <form onSubmit={createCoupon} className="surface-card mt-4 grid gap-3 p-4 sm:grid-cols-2">
              <input
                className="input-field"
                placeholder="CODE"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon((n) => ({ ...n, code: e.target.value }))}
                required
              />
              <select
                className="input-field"
                value={newCoupon.type}
                onChange={(e) => setNewCoupon((n) => ({ ...n, type: e.target.value }))}
              >
                <option value="percentage">Percentage off</option>
                <option value="fixed">Fixed ₹ off</option>
              </select>
              <input
                type="number"
                className="input-field"
                placeholder="Value"
                value={newCoupon.value}
                onChange={(e) => setNewCoupon((n) => ({ ...n, value: e.target.value }))}
                required
                min={0}
              />
              <input
                type="number"
                className="input-field"
                placeholder="Min cart (₹)"
                value={newCoupon.minAmount}
                onChange={(e) => setNewCoupon((n) => ({ ...n, minAmount: e.target.value }))}
                min={0}
              />
              <input
                type="number"
                className="input-field"
                placeholder="Max uses (empty = unlimited)"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon((n) => ({ ...n, maxUses: e.target.value }))}
                min={0}
              />
              <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
                <input
                  type="checkbox"
                  checked={newCoupon.isActive}
                  onChange={(e) => setNewCoupon((n) => ({ ...n, isActive: e.target.checked }))}
                />
                Active
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary">
                  Create coupon
                </button>
              </div>
            </form>
            <ul className="mt-4 space-y-2">
              {coupons.map((c) => (
                <li
                  key={c._id}
                  className="surface-card flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
                >
                  <span className="font-mono font-bold text-ink-900">{c.code}</span>
                  <span className="text-ink-600">
                    {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`} · min ₹{c.minAmount}
                    {c.maxUses != null ? ` · max ${c.maxUses} uses` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCoupon(c._id)}
                    className="text-sm font-semibold text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-ink-900">Restaurants</h2>
            <ul className="mt-4 space-y-2">
              {restaurants.map((r) => (
                <li
                  key={r._id}
                  className="surface-card flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="font-semibold text-ink-900">{r.name}</p>
                    <p className="text-xs text-ink-500">{r.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRestaurant(r)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      r.isActive !== false
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-ink-200 text-ink-700"
                    }`}
                  >
                    {r.isActive !== false ? "Visible" : "Hidden"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
