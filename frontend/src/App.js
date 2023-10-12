import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Resto from "./screens/Resto";
import Home from "./screens/Home";
import RestaurantHome from "./screens/RestaurantHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route exact path="/resto" element={<Resto />} />
          <Route exact path="/home" element={<Navbar />} />
          <Route exact path="/RestaurantHome" element={<RestaurantHome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
