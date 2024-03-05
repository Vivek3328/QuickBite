import React from "react";
import styles from "../screens/styles/home.module.css";
import { Link, useSearchParams } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function Home() {
  const [params] = useSearchParams();
  let userAuthType = params.get("userAuthType");

  return (
    <div className={styles.homeScreen}>
      <div className={styles.body}>
        <div className={styles.logo}>QuickBite</div>
      </div>
      <div className={styles.btns}>
        <Login userAuthType={userAuthType}></Login>
        <Signup userAuthType={userAuthType}></Signup>
        <div className={styles.addRestoBtn}>
          <Link className={styles.btn} to="/Resto">
            Add Restaurant
          </Link>
        </div>
      </div>
    </div>
  );
}
