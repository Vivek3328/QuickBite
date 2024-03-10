import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Resto from "./screens/Resto";
import Home from "./screens/Home";
import RestaurantHome from "./screens/RestaurantHome";
import UserHome from "./screens/UserHome";
import RestoPage from "./screens/RestoPage";
import RestaurantOrder from "./screens/RestaurantOrder";
import Cart from "./screens/Cart";
import CartState from "./Context/CartState";


function App() {
  return (
    <>
      <BrowserRouter>
        <CartState>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/resto" element={<Resto />} />
            <Route exact path="/home" element={<Navbar />} />
            <Route exact path="/RestaurantHome" element={<RestaurantHome />} />
            <Route exact path="/userHome" element={<UserHome />} />
            <Route exact path="/userHome/resto/:id" element={<RestoPage />} />
            <Route exact path="/RestaurantOrder" element={<RestaurantOrder />} />
            <Route exact path="/cart" element={<Cart />} />
          </Routes>
        </CartState>
      </BrowserRouter>
    </>
  );
}

export default App;
