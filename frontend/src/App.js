import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Resto from "./screens/Resto";
import Home from "./screens/Home";
import RestaurantHome from "./screens/RestaurantHome";
// import RestoCard from "./screens/RestoCard";
import UserHome from "./screens/UserHome";
// import MenuCard from "./screens/MenuCard";
import Menu from "./screens/Menu";
import RestoPage from "./screens/RestoPage";
import RestaurantOrder from "./screens/RestaurantOrder";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route exact path="/resto" element={<Resto />} />
          <Route exact path="/home" element={<Navbar />} />
          <Route exact path="/RestaurantHome" element={<RestaurantHome />} />
          {/* <Route exact path="/RestoCard" element={<RestoCard/>} /> */}
          <Route exact path="/userHome" element={<UserHome/>} />
          <Route exact path="/userHome/resto/:id" element={<RestoPage/>} />
          {/* <Route exact path="/menuCard" element={<MenuCard/>} /> */}
          <Route exact path="/menu" element={<Menu/>} />
          <Route exact path="/RestaurantOrder" element={<RestaurantOrder/>} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
