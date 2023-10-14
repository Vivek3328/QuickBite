import React , {useState}from 'react'
// import styles from "../components/styles/RestaurantHome.module.css"
import RestoCard from './RestoCard'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function UserHome() {
   const [owner, setOwner] = useState([]);
   const updateHotels = async() => {     
      
      // const url = `https://newsapi.org/v2/top-headlines?q=${props.query}&country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
    
      // const data = await fetch(url);
      // const parsedData = await data.json()
      // console.log(parsedData)
      // setOwner(parsedData.owner)
      axios.get()
      .then(res => {
         setOwner(res.data.owner)
         console.log(res.data.owner)
      })
      .catch(err=> console.log(err))
    }
    useEffect(() => {
      updateHotels();
    //eslint-disable-next-line 
  }, [])

  return (
    <>
  
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
{/* <div className="container">

<div className="row my-3" >

  {owner.map((element, index) => {

    return <div className="col-md-4" key={index} style={{padding:'10px'}}>
      <RestoCard title={element?.title } foodtype={element?.foodtype } imgUrl={element?.urlToImage ? element.urlToImage : "https://b.zmtcdn.com/data/pictures/chains/5/18575885/54b6de34323395a3b10897e48bd2a6e5_o2_featured_v2.jpg?output-format=webp"} />
    </div>
  })}
</div>
</div> */}