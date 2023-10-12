import React from 'react'
import styles from "../screens/styles/home.module.css"
import { Link,useSearchParams } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup'


// import RestaurantLogin from '../components/RestaurantLogin'
// import RestaurantSignup from '../components/RestaurantSignup'
// import Resto from './Resto'
export default function Home() {
    const [params] = useSearchParams();
    let userAuthType=params.get("userAuthType")
    return (
        <>
            <div className={styles.btns}>
               
                <Login userAuthType={userAuthType}></Login>
                <Signup userAuthType={userAuthType}></Signup>
                
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
