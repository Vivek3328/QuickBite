import Home from "./pages/Home";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Navbar from "./components/Navbar";
import AddRestaurant from "./pages/AddRestaurant";
import Menu from "./pages/Menu";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import UserOrder from "./pages/UserOrder";
import RestaurantOrder from "./pages/RestaurantOrder";

function App() {
  const userToken = localStorage.getItem("userToken");
  const ownerToken = localStorage.getItem("ownerToken");
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={userToken || ownerToken ? <Navigate to="/" /> : <LoginSignup />} />
        <Route path="/add-restaurant" element={userToken || ownerToken ? <Navigate to="/" /> : <AddRestaurant />} />
        <Route path="/restaurant/:id" element={userToken ? <Menu /> : <Navigate to="/" />} />
        <Route path="/restaurant-menu" element={ownerToken ? <RestaurantMenu /> : <Navigate to="/" />} />
        <Route path="/cart" element={userToken ? <Cart /> : <Navigate to="/" />} />
        <Route path="/user-orders" element={userToken ? <UserOrder /> : <Navigate to="/" />} />
        <Route path="/Restaurant-orders" element={ownerToken ? <RestaurantOrder /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
