import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantMenu = () => {
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

  const MenuItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/fetchallmenuitems`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("ownerToken"),
          },
        }
      );
      setmenuItem(response.data.items);
      setRestoName(response.data.name);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    MenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const words = value.length;
      setWordCount(words);
    }

    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "quickbite");
    formData.append("cloud_name", "drdcsopo2");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drdcsopo2/image/upload",
        formData
      );
      setImg(res.data.url);
      setNewItem((prevItem) => ({ ...prevItem, image: res.data.url }));
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
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/updatemenuitem/${editItemId}`,
          itemData,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("ownerToken"),
            },
          }
        );
        const updatedItems = menuItem.map((item) =>
          item._id === editItemId ? response.data.item : item
        );
        setmenuItem(updatedItems);
        toast.success("Item updated");
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/additem`,
          itemData,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("ownerToken"),
            },
          }
        );
        setmenuItem([...menuItem, response.data.item]);
      }

      MenuItems();

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
                  onChange={uploadImage}
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

      <ToastContainer hideProgressBar={true} position="top-center" theme="light" />
    </div>
  );
};

export default RestaurantMenu;
