import React from 'react'
import ItemCard from '../components/ItemCard'
import RestaurantHomeNavbar from '../components/RestaurantHomeNavbar'

export default function RestaurantHome() {
    return (
        <>
            <RestaurantHomeNavbar/>
            <div className="container">

            <div className="row my-3" style={{padding:'10px'}}>

               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
               <div className="col-md-4 "style={{padding:'10px'}} >
                  <ItemCard/> 
              </div>
             
            </div>
          </div>
        </>
    )
}
