import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navbar  />}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
