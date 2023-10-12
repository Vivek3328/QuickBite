import React from 'react'
// import styles from "../components/styles/RestaurantHome.module.css"
import RestoCard from './RestoCard'
import Navbar from '../components/Navbar'


export default function UserHome() {
  return (
    <>
    {/* <div className={styles.main}>
      <div className={styles.name}>QuickBite</div>
      <div className={styles.add}></div>
    </div> */}
    <Navbar/>
    <div className="container">

            <div className="row my-3" style={{padding:'10px'}}>

               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <RestoCard/> 
              </div>
             
            </div>
          </div>
    </>
  )
}
