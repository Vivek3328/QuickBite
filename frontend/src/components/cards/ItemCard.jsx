import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setTotalItems } from "@/store/cartSlice";
import { STORAGE_KEYS } from "@/constants/storage";

function itemInCart(cart, id) {
  return cart.some((c) => c._id === id);
}

export function ItemCard({ image, name, price, description, item, ownerId }) {
  const dispatch = useDispatch();
  const totalItems = useSelector((state) => state.cart.totalItems);

  const addToCart = (newItem, oid) => {
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cartItems)) || [];

    if (cart.length === 0) {
      cart.push({ ...newItem, owner: oid });
      dispatch(setTotalItems(totalItems + 1));
      toast.success("Added to cart");
    } else {
      const existingOwnerId = cart[0].owner;

      if (existingOwnerId !== oid) {
        cart = [{ ...newItem, owner: oid }];
        dispatch(setTotalItems(1));
        toast.success("Cart updated for this restaurant");
      } else if (itemInCart(cart, newItem._id)) {
        toast.error("Already in cart");
        return;
      } else {
        cart.push({ ...newItem, owner: oid });
        dispatch(setTotalItems(totalItems + 1));
        toast.success("Added to cart");
      }
    }
    localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(cart));
  };

  return (
    <article className="surface-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">{name}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <p className="text-lg font-bold text-brand-700">₹{price}</p>
          <button
            type="button"
            onClick={() => addToCart(item, ownerId)}
            className="btn-primary !px-4 !py-2 !text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
