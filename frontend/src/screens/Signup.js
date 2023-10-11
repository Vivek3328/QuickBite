import React,  { useState } from 'react'
import { Link } from "react-router-dom";
import './Signup.css'



export default function Signup() {
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  return (
    <div className="login-container">
      <div className="card login-card input-field">
        <h2>QuickBite</h2>
        <div>
            <input 
              type="text" placeholder="Full name"
              value={fullName}
              onChange={(event)=> setFullName(event.target.value)}
              
            />
            <input 
              type="text" placeholder="Email"
              value={email}
              onChange={(event)=> setEmail(event.target.value)}  
            
            />
            <input 
              type="password" placeholder="Password"
              value={password}
              onChange={(event)=> setPassword(event.target.value)}
            />
        </div>
       
        <button  className="btn waves-effect waves-light btn #d32f2f red darken-1">Signup</button>
        <h6>
          <Link to="/login">Already have an account ?</Link>
        </h6>
      </div>
    </div>
  )
}
