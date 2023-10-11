import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Resto from "./screens/Resto";
import Home from "./screens/Home";

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
       
      <Route path="/" element={<Home/>}/>
      {/* <Route exact path="/signup" element={<Signup/>}/> */}
      {/* <Route exact path="/login" element={ <Login/>}/> */}
      <Route exact path="/resto" element={<Resto/>}/>
      <Route exact path="/home" element={<Navbar/>}/>
      
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
