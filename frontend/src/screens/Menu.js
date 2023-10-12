import React from 'react'
import Navbar from '../components/Navbar'
import MenuCard from './MenuCard'

export default function Menu() {
  return (
    <div>
          <Navbar/>
          <div className="container">

            <div className="row my-3" style={{padding:'10px'}}>

               <div className="col-md-12 "style={{padding:'10px'}} >
                  <MenuCard/>
              </div>
               <div className="col-md-12 "style={{padding:'10px'}} >
                  <MenuCard/>
              </div>
               <div className="col-md-12 "style={{padding:'10px'}} >
                  <MenuCard/>
              </div>
               <div className="col-md-12 "style={{padding:'10px'}} >
                  <MenuCard/>
              </div>
               <div className="col-md-12 "style={{padding:'10px'}} >
                  <MenuCard/>
              </div>
 
             
            </div>
          </div>

    </div>
  )
}
