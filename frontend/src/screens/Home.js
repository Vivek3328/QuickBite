import React from 'react'
import styles from "../screens/styles/home.module.css"
import { Link } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'
// import RestaurantLogin from '../components/RestaurantLogin'
// import RestaurantSignup from '../components/RestaurantSignup'
// import Resto from './Resto'
export default function home() {

    return (
        <>
            <div className={styles.btns}>
                {/* <button className={styles.btn}>Login</button>
            <button className={styles.btn}>Sign UP</button> */}
                <Login></Login>
                <Signup></Signup>
                <div className={styles.addRestoBtn} ><Link className={styles.btn} to="/Resto">Add Restaurant</Link></div>
            </div>
            <div className={styles.homeScreen} >
                <div className={styles.logo}>
                    QuickBite
                </div>
            </div>

        </>
    )
}
