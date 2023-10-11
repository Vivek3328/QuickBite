import React from 'react'
import RestaurantLogin from '../components/RestaurantLogin'
import styles from "../components/styles/resto.module.css"
import RestaurantSignup from '../components/RestaurantSignup'
import { useSearchParams } from 'react-router-dom'
// import Login from './Login'

export default function Resto() {
  const [params] = useSearchParams();
  let authType=params.get("authType")
  return (
      <div className={styles.restoScreen} >
        <div className={styles.logo}>
          <h2>QuickBite</h2>
        </div>

        {/* <Login></Login> */}
          <RestaurantLogin authType={authType} />
          <RestaurantSignup authType={authType}/>
      </div>
        
  )
}
