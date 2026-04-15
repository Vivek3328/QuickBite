import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  fetchOwnerMenuItems,
  addMenuItem,
  updateMenuItem,
} from "@/api/menu";
import { uploadImage } from "@/api/cloudinary";

export default function OwnerMenuPage() {
  const { ownerToken } = useAuth();
  const [menuItem, setmenuItem] = useState([]);
  const [restoName, setRestoName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    itemname: "",
    description: "",
    price: "",
    image: "",
  });
  const [wordCount, setWordCount] = useState(0);

  const loadMenuItems = async () => {
    if (!ownerToken) return;
    try {
      const response = await fetchOwnerMenuItems(ownerToken);
      setmenuItem(response.items);
      setRestoName(response.name);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [ownerToken]);

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
      price: newItem.price,
      image: img || newItem.image,
    };

    try {
      if (editItemId) {
        const response = await updateMenuItem(ownerToken, editItemId, itemData);
        const updatedItems = menuItem.map((item) =>
          item._id === editItemId ? response.item : item
        );
        setmenuItem(updatedItems);
        toast.success("Item updated");
      } else {
        const response = await addMenuItem(ownerToken, itemData);
        setmenuItem([...menuItem, response.item]);
      }

      await loadMenuItems();

      setShowModal(false);
      setNewItem({ itemname: "", description: "", price: "", image: "" });
      setImg("");
      setEditItemId(null);
      setWordCount(0);
    } catch (error) {
      console.error("Error saving item", error.response?.data);
    }
  };

  const handleEditClick = (item) => {
    setShowModal(true);
    setNewItem({
      itemname: item.itemname,
      description: item.description,
      price: item.price,
      image: item.image,
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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-ink-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">
            {restoName || "Your restaurant"}
            <span className="text-ink-400">&apos;s menu</span>
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Add dishes, upload photos, and keep prices up to date.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary shrink-0 self-start sm:self-auto"
        >
          + Add item
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
          <div className="surface-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 shadow-card-hover sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink-900">
              {editItemId ? "Edit item" : "New menu item"}
            </h2>
            <form onSubmit={handleAddOrEditItem} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Name
                </label>
                <input
                  type="text"
                  name="itemname"
                  value={newItem.itemname}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. Margherita pizza"
                  required
                />
              </div>
              <div>
                <label className="mb-1 flex justify-between text-xs font-semibold uppercase tracking-wide text-ink-500">
                  <span>Description</span>
                  <span className="font-normal normal-case text-ink-400">
                    {wordCount}/300 chars
                  </span>
                </label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  className="input-field min-h-[120px] resize-y"
                  placeholder="100–300 characters"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="299"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Image
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
                        alt="Preview"
                        className="h-16 w-16 rounded-xl object-cover ring-1 ring-ink-100"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-400">No image yet</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewItem({
                      itemname: "",
                      description: "",
                      price: "",
                      image: "",
                    });
                    setImg("");
                    setEditItemId(null);
                  }}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editItemId ? "Save changes" : "Add item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItem.length > 0 ? (
          menuItem.map((item) => (
            <div key={item?._id} className="surface-card flex flex-col overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                <img
                  src={item?.image}
                  alt={item?.itemname}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  {item?.itemname}
                </h3>
                <p className="mt-2 line-clamp-4 flex-1 text-sm text-ink-600">
                  {item?.description}
                </p>
                <p className="mt-4 text-lg font-bold text-brand-700">₹{item?.price}</p>
                <button
                  type="button"
                  onClick={() => handleEditClick(item)}
                  className="btn-secondary mt-4 w-full !py-2 !text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="surface-card col-span-full p-12 text-center text-ink-600">
            No items yet. Add your first dish to get started.
          </div>
        )}
      </div>
    </div>
  );
}
