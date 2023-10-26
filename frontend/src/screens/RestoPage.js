import React, {useState, useEffect } from 'react'
import { useParams} from 'react-router-dom';
import axios from 'axios'
import MenuCard from './MenuCard';
import Navbar from '../components/Navbar';

export default function RestoPage() {
  const { id } = useParams();
  // console.log(id)

  const [menu, setMenu] = useState([]);

  const updateMenu = async () => {

    await axios.get(`http://localhost:5000/api/menuitemauth/fetchrestomenu/${id}`)
      .then(res => {
        // console.log(res.data)
        setMenu(res.data)
      })
      .catch(err => console.log(err))
  }
  useEffect(() => {
    updateMenu();
    //eslint-disable-next-line 
  }, [])

  return (
    <div>
      <Navbar/>
      <div className="container">

        <div className="row my-3 item-center" style={{ padding: '10px', justifyContent: 'center' }} >

          { menu?.map((element, index) => {

            return <div className="col-md-8" key={index} style={{ padding: '10px' }}>
              <MenuCard itemname={element?.itemname} price={element?.price} image={element?.image ? element.image : "https://img.icons8.com/?size=96&id=61083&format=png"} description={element?.description} _id = {element._id} item = {element}
              />
            </div>

          })}
        </div>
      </div>
    </div>
  )
}

