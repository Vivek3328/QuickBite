import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import styles from "../screens/styles/home.module.css"
import styles from "../components/styles/RestaurantHome.module.css";
import { Button, useToast } from "@chakra-ui/react";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast({
      title: "Logged Out Successfully",
      status: "success",
      duration: 2000,
      position: "top-right",
      isClosable: true,
    });
  };
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-black">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          QuickBite
        </Link>
        <div className={styles.order}>
          <Link className="navbar-brand" to="/cart">
            Cart
          </Link>
          <Button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
