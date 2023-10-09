import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Resto from "./screens/Resto";

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
       
      <Route path="/" element={<Navbar />}/>
      <Route exact path="/signup" element={<Signup/>}/>
      <Route exact path="/login" element={ <Login/>}/>
      <Route exact path="/resto" element={<Resto/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
