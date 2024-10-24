import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Navbar from "./components/Navbar";
import AddRestaurant from "./pages/AddRestaurant";
import Menu from "./pages/Menu";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import UserOrder from "./pages/UserOrder";
import RestaurantOrder from "./pages/RestaurantOrder";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/restaurant/:id" element={<Menu />} />
        <Route path="/restaurant-menu" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/user-orders" element={<UserOrder />} />
        <Route path="/Restaurant-orders" element={<RestaurantOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
