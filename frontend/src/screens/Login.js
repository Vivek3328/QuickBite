import React from 'react'
import { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container">

      <div className="card login-card input-field">
        <h2>QuickBite</h2>
       
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address :</label>
            <input
            type="text" placeholder="Email"
            value={email}     
            autoComplete="username"   
            onChange={(event) => setEmail(event.target.value)}

          />            
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password :</label>
            <input
            type="password" placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          </div>
          
          <button type="submit" className="btn btn-dark">Submit</button>
        </form>
        {/* <button className="btn waves-effect waves-light btn #d32f2f red darken-1">Login</button> */}
        <h6>
          <Link to="/signup">Don't have an account ?</Link>
        </h6>
      </div>
    </div>
  )
}
