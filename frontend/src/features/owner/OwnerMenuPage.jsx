import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiEdit2,
  FiImage,
  FiLoader,
  FiPlus,
  FiSearch,
  FiSliders,
  FiX,
  FiClipboard,
  FiPackage,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { fetchOwnerMenuItems, addMenuItem, updateMenuItem, toggleMenuItemStock } from "@/api/menu";
import { fetchOwnerSalesSummary, updateRestaurantSettings } from "@/api/ownerSettings";
import { uploadImage } from "@/api/cloudinary";
import { ROUTES } from "@/constants/routes";
import { PartnerMenuRowSkeleton } from "@/components/ui/Skeleton";

function formatPrice(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function OwnerMenuPage() {
  const { ownerToken } = useAuth();
  const [menuItem, setmenuItem] = useState([]);
  const [restoName, setRestoName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [newItem, setNewItem] = useState({
    itemname: "",
    description: "",
    price: "",
    image: "",
    isVeg: true,
    prepTimeMin: "",
  });
  const [wordCount, setWordCount] = useState(0);
  const [summary, setSummary] = useState(null);
  const [deliveryEtaMin, setDeliveryEtaMin] = useState(30);
  const [locLat, setLocLat] = useState("");
  const [locLng, setLocLng] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  const loadMenuItems = async () => {
    if (!ownerToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetchOwnerMenuItems(ownerToken);
      setmenuItem(response.items);
      setRestoName(response.name);
      setDeliveryEtaMin(response.deliveryEtaMin ?? 30);
      setLocLat(response.location?.lat ?? "");
      setLocLng(response.location?.lng ?? "");
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Could not load your menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [ownerToken]);

  useEffect(() => {
    if (!ownerToken) return;
    let cancelled = false;
    fetchOwnerSalesSummary(ownerToken)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ownerToken]);

  const saveRestaurantSettings = async () => {
    if (!ownerToken) return;
    setSettingsSaving(true);
    try {
      await updateRestaurantSettings(ownerToken, {
        deliveryEtaMin: Number(deliveryEtaMin),
        lat: locLat === "" ? undefined : Number(locLat),
        lng: locLng === "" ? undefined : Number(locLng),
      });
      toast.success("Settings saved");
      await loadMenuItems();
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleToggleStock = async (item, nextOut) => {
    if (!ownerToken) return;
    try {
      await toggleMenuItemStock(ownerToken, item._id, nextOut);
      toast.success(nextOut ? "Marked out of stock" : "Back in stock");
      await loadMenuItems();
    } catch {
      toast.error("Could not update stock");
    }
  };

  const filteredItems = useMemo(() => {
    let list = [...menuItem];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((i) => {
        const name = (i.itemname || "").toLowerCase();
        const desc = (i.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) =>
          (a.itemname || "").localeCompare(b.itemname || "", undefined, {
            sensitivity: "base",
          })
        );
      case "newest":
      default:
        return list.sort((a, b) => String(b._id || "").localeCompare(String(a._id || "")));
    }
  }, [menuItem, search, sort]);

  const closeModal = () => {
    setShowModal(false);
    setNewItem({
      itemname: "",
      description: "",
      price: "",
      image: "",
      isVeg: true,
      prepTimeMin: "",
    });
    setImg("");
    setEditItemId(null);
    setWordCount(0);
  };

  const openNewModal = () => {
    setEditItemId(null);
    setNewItem({
      itemname: "",
      description: "",
      price: "",
      image: "",
      isVeg: true,
      prepTimeMin: "",
    });
    setImg("");
    setWordCount(0);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      setWordCount(value.length);
    }

    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files?.[0]) return;

    try {
      const url = await uploadImage(files[0]);
      setImg(url);
      setNewItem((prevItem) => ({ ...prevItem, image: url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
    }
  };

  const handleAddOrEditItem = async (e) => {
    e.preventDefault();

    if (wordCount < 100 || wordCount > 300) {
      toast.error("Description must be between 100 and 300 characters.");
      return;
    }

    const itemData = {
      itemname: newItem.itemname,
      description: newItem.description,
      price: Number(newItem.price),
      image: img || newItem.image,
      isVeg: newItem.isVeg !== false,
      prepTimeMin:
        newItem.prepTimeMin === "" ? undefined : Math.min(180, Math.max(5, Number(newItem.prepTimeMin))),
    };

    if (!itemData.image) {
      toast.error("Please add a dish photo.");
      return;
    }

    setSaving(true);
    try {
      if (editItemId) {
        await updateMenuItem(ownerToken, editItemId, itemData);
        toast.success("Item updated");
      } else {
        await addMenuItem(ownerToken, itemData);
        toast.success("Item added to menu");
      }

      await loadMenuItems();
      closeModal();
    } catch (error) {
      console.error("Error saving item", error.response?.data);
      toast.error("Could not save item. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item) => {
    setShowModal(true);
    setNewItem({
      itemname: item.itemname,
      description: item.description,
      price: String(item.price),
      image: item.image,
      isVeg: item.isVeg !== false,
      prepTimeMin: item.prepTimeMin != null ? String(item.prepTimeMin) : "",
    });
    setImg(item.image);
    setEditItemId(item._id);
    setWordCount(item.description?.length ?? 0);
  };

  const removeImage = () => {
    setImg("");
    setNewItem((prevItem) => ({ ...prevItem, image: "" }));
  };

  return (
    <div className="relative min-h-screen pb-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(251,146,60,0.08),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 pt-4 sm:px-6 lg:max-w-5xl lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Partner dashboard
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {restoName || "Your restaurant"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-600">
              Manage dishes customers see on your listing — photos, descriptions, and prices stay
              in sync here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              to={ROUTES.restaurantOrders}
              className="btn-secondary inline-flex items-center gap-2 !py-2.5"
            >
              <FiClipboard className="h-4 w-4" aria-hidden />
              Orders
            </Link>
            <button type="button" onClick={openNewModal} className="btn-primary inline-flex items-center gap-2 !py-2.5">
              <FiPlus className="h-4 w-4" aria-hidden />
              Add dish
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">On menu</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-900">
              {loading ? "—" : menuItem.length}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">Total dishes</p>
          </div>
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Visible</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-900">
              {loading ? "—" : filteredItems.length}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">After search</p>
          </div>
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">30-day revenue</p>
            <p className="mt-1 font-display text-xl font-bold text-ink-900 tabular-nums">
              {summary ? `₹${Math.round(summary.last30Days?.revenue ?? 0)}` : "—"}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {summary ? `${summary.last30Days?.orderCount ?? 0} orders` : "Paid orders"}
            </p>
          </div>
          <div className="surface-card border-brand-100/80 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">All-time revenue</p>
            <p className="mt-1 font-display text-xl font-bold text-ink-900 tabular-nums">
              {summary ? `₹${Math.round(summary.allTime?.revenue ?? 0)}` : "—"}
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              {summary ? `${summary.allTime?.orderCount ?? 0} orders` : "Paid orders"}
            </p>
          </div>
          <div className="surface-card col-span-2 border-brand-100/80 bg-gradient-to-br from-brand-50/80 to-white p-4 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Tip</p>
            <p className="mt-1 text-sm font-medium leading-snug text-ink-700">
              Clear photos and 100–300 character descriptions convert better on the customer menu.
            </p>
          </div>
        </div>

        <div className="surface-card mt-6 border-brand-100/80 p-5">
          <h2 className="font-display text-lg font-bold text-ink-900">Prep time & map pin</h2>
          <p className="mt-1 text-sm text-ink-600">
            Estimated delivery minutes shown on your listing. Optional lat/lng powers “near me”
            sorting when customers share location.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-ink-700" htmlFor="eta-min">
                Est. delivery (min)
              </label>
              <input
                id="eta-min"
                type="number"
                min={10}
                max={120}
                className="input-field mt-1"
                value={deliveryEtaMin}
                onChange={(e) => setDeliveryEtaMin(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700" htmlFor="lat">
                Latitude
              </label>
              <input
                id="lat"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 12.97"
                className="input-field mt-1"
                value={locLat}
                onChange={(e) => setLocLat(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700" htmlFor="lng">
                Longitude
              </label>
              <input
                id="lng"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 77.59"
                className="input-field mt-1"
                value={locLng}
                onChange={(e) => setLocLng(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={saveRestaurantSettings}
            disabled={settingsSaving}
            className="btn-primary mt-4"
          >
            {settingsSaving ? "Saving…" : "Save delivery settings"}
          </button>
        </div>

        <div className="sticky top-[4.25rem] z-30 -mx-4 mt-8 border-b border-ink-100/80 bg-ink-50/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-4xl lg:max-w-5xl">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your dishes…"
                className="input-field w-full rounded-2xl border-ink-200/80 py-3 pl-11 pr-4 text-base shadow-sm"
                autoComplete="off"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-600">
                {!loading && (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-ink-800">{filteredItems.length}</span>
                    {filteredItems.length === 1 ? " dish" : " dishes"}
                  </>
                )}
              </p>
              <div className="relative">
                <FiSliders
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                  aria-hidden
                />
                <label htmlFor="owner-menu-sort" className="sr-only">
                  Sort menu
                </label>
                <select
                  id="owner-menu-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field appearance-none rounded-xl py-2 pl-9 pr-8 text-sm font-medium"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl space-y-3 lg:max-w-5xl">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <PartnerMenuRowSkeleton key={index} />
              ))
            : filteredItems.map((item) => (
                <article
                  key={item._id}
                  className="surface-card flex gap-4 overflow-hidden p-4 transition hover:border-brand-200/80 hover:shadow-md sm:gap-5 sm:p-5"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-100 sm:h-24 sm:w-24">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base font-semibold text-ink-900 sm:text-lg">
                      {item.itemname}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-500">{item.description}</p>
                    <p className="mt-3 text-lg font-bold tabular-nums text-ink-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-stretch justify-center gap-2 sm:items-end">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item, !item.isOutOfStock)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition ${
                        item.isOutOfStock
                          ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                          : "border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50"
                      }`}
                    >
                      <FiPackage className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">
                        {item.isOutOfStock ? "Mark in stock" : "Out of stock"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-800 shadow-sm transition hover:border-brand-300 hover:bg-brand-50"
                    >
                      <FiEdit2 className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </article>
              ))}
        </div>

        {!loading && menuItem.length === 0 && (
          <div className="surface-card mt-10 border-2 border-dashed border-ink-200 bg-gradient-to-b from-white to-brand-50/30 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <FiImage className="h-8 w-8" aria-hidden />
            </div>
            <h2 className="mt-6 font-display text-xl font-bold text-ink-900">Your menu is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
              Add your first dish with a photo and description. Customers browse this list before
              they order.
            </p>
            <button type="button" onClick={openNewModal} className="btn-primary mt-8 inline-flex items-center gap-2">
              <FiPlus className="h-4 w-4" aria-hidden />
              Add your first dish
            </button>
          </div>
        )}

        {!loading && menuItem.length > 0 && filteredItems.length === 0 && (
          <div className="surface-card mt-10 border-dashed border-ink-200 px-6 py-12 text-center">
            <p className="font-semibold text-ink-900">No dishes match your search</p>
            <p className="mt-2 text-sm text-ink-600">Try another keyword or clear the search box.</p>
            <button type="button" onClick={() => setSearch("")} className="btn-secondary mt-6">
              Clear search
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-item-modal-title"
        >
          <div className="surface-card flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl shadow-card-hover sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="menu-item-modal-title"
                  className="font-display text-lg font-bold text-ink-900 sm:text-xl"
                >
                  {editItemId ? "Edit dish" : "New dish"}
                </h2>
                <p className="mt-0.5 text-sm text-ink-500">
                  {editItemId ? "Changes apply on your live menu." : "Shown to customers on your restaurant page."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddOrEditItem}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6"
            >
              <div className="space-y-4 pb-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700" htmlFor="item-name">
                    Dish name
                  </label>
                  <input
                    id="item-name"
                    type="text"
                    name="itemname"
                    value={newItem.itemname}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. Paneer tikka"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex justify-between text-sm font-semibold text-ink-700">
                    <span>Description</span>
                    <span className="font-normal text-ink-400">{wordCount}/300</span>
                  </label>
                  <textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="100–300 characters — ingredients, spice level, portion…"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700" htmlFor="item-price">
                    Price (₹)
                  </label>
                  <input
                    id="item-price"
                    type="number"
                    name="price"
                    min={0}
                    step={1}
                    value={newItem.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="299"
                    required
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    checked={newItem.isVeg !== false}
                    onChange={(e) =>
                      setNewItem((n) => ({
                        ...n,
                        isVeg: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                  />
                  Vegetarian dish
                </label>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700" htmlFor="prep-min">
                    Prep time (minutes, optional)
                  </label>
                  <input
                    id="prep-min"
                    type="number"
                    min={5}
                    max={180}
                    value={newItem.prepTimeMin}
                    onChange={(e) =>
                      setNewItem((n) => ({ ...n, prepTimeMin: e.target.value }))
                    }
                    className="input-field"
                    placeholder="e.g. 15"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink-700">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImageHandler}
                    className="input-field py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-800"
                  />
                  <div className="mt-3">
                    {img ? (
                      <div className="flex items-start gap-3">
                        <img
                          src={img}
                          alt=""
                          className="h-20 w-20 rounded-2xl object-cover ring-1 ring-ink-100"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="rounded-xl border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-ink-400">Upload a square or landscape photo.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 mt-auto flex flex-col-reverse gap-2 border-t border-ink-100 bg-white pt-4 sm:flex-row sm:justify-end sm:gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" aria-hidden />
                      Saving…
                    </>
                  ) : editItemId ? (
                    "Save changes"
                  ) : (
                    "Publish dish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
