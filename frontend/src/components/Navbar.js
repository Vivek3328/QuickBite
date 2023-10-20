import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import styles from "../components/styles/RestaurantHome.module.css"
import { Button, useToast } from '@chakra-ui/react'

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast()
    const handleLogout = () =>{
        localStorage.removeItem('token');
        navigate('/');
        toast({
          title: 'Logged Out Successfully',
          status: 'success',
          duration: 2000,
          position: 'top-right',
          isClosable: true,
        })
    }
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-black">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">QuickBite</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={styles.order}>
          <Button className="btn btn-primary" onClick={handleLogout}>Logout</Button>
        </div> 
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* <li className="nav-item">
              <Link className="nav-link" to="/userHome">Hotels</Link>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  )
}
