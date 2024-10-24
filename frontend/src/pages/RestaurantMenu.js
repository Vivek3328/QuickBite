import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationModal from "../components/ConfirmationModal";

const RestaurantMenu = () => {
  const [menuItem, setmenuItem] = useState([]);
  const [restoName, setRestoName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [editItemId, setEditItemId] = useState(null); // Track the item being edited
  const [newItem, setNewItem] = useState({
    itemname: "",
    description: "",
    price: "",
    image: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const itemData = {
      itemname: newItem.itemname,
      description: newItem.description,
      price: newItem.price,
      image: img || newItem.image, // If no new image is uploaded, retain the existing one
    };

    try {
      if (editItemId) {
        // Edit item
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
      } else {
        // Add new item
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

      // Reset form and modal state
      setShowModal(false);
      setNewItem({ itemname: "", description: "", price: "", image: "" });
      setImg("");
      setEditItemId(null); // Reset edit mode
    } catch (error) {
      console.error("Error saving item", error.response.data);
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
    setImg(item.image); // Set the existing image URL for preview
    setEditItemId(item._id); // Set the ID of the item being edited
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/menuitemauth/deletemenuitems/${id}`,
        {
          headers: {
            "auth-token": localStorage.getItem("ownerToken"),
          },
        }
      );
      setmenuItem(menuItem.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const removeImage = () => {
    setImg("");
    setNewItem((prevItem) => ({ ...prevItem, image: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {restoName}'s Menu
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition text-lg font-bold"
        >
          + Add New Item
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {editItemId ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleAddOrEditItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemname"
                    value={newItem.itemname}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Enter item description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Enter item price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Image
                  </label>
                  {/* If editing, show current image preview */}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-full p-3 mt-1 border rounded-lg"
                  />
                  <div className="mb-4">
                    {img ? (
                      <div className=" flex">
                        <img
                          src={img}
                          alt="Current Item"
                          className="w-12 h-12 object-cover rounded-lg mt-2"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className=" h-4 w-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center mt-2 z-1"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400">No image selected</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  {editItemId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {menuItem.length > 0 ? (
          menuItem.map((item) => (
            <div key={item?._id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={item?.image}
                alt={item?.itemname}
                className="w-full h-64 cover rounded-lg"
              />
              <h3 className="text-xl font-bold mt-2">{item?.itemname}</h3>
              <p className="text-gray-600">{item?.description}</p>
              <p className="text-gray-800 font-bold">${item?.price}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditClick(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(item?._id);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items found. Please add some.</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Confirmation"
        message="Are you sure you want to Delete this item?"
        onConfirm={() => handleDeleteItem(deleteId)}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RestaurantMenu;
