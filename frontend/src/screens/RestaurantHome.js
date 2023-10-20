import React,{ useState, useEffect } from 'react'
import ItemCard from '../components/ItemCard'
import RestaurantHomeNavbar from '../components/RestaurantHomeNavbar'

export default function RestaurantHome() {
    const [menuItem, setmenuItem] = useState([]);
    const [restoName, setRestoName] = useState([]);
    const updateHotels = async () => {
        const response = await fetch( "http://localhost:5000/api/menuitemauth/fetchallmenuitems",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token":localStorage.getItem('token')
                }
            }
        )
        const res = await response.json();
        setmenuItem(res.items)
        setRestoName(res.name)
        console.log(res)
    }
    useEffect(() => {
        updateHotels();
        //eslint-disable-next-line 
    }, [])
    return (
        <>
            <RestaurantHomeNavbar name={restoName} />
            <div>
                <div className="container">

                    <div className="row my-3 item-center" style={{ padding: '10px', justifyContent: 'center' }} >

                        {menuItem?.map((element, index) => {

                            return <div className="col-md-8" key={index} style={{ padding: '10px' }}>
                                <ItemCard itemname={element?.itemname} price={element?.price} image={element?.image ? element.image : "https://img.icons8.com/?size=96&id=61083&format=png"} description={element?.description}  itemId = {element?._id} updateHotels = {updateHotels}
                                />
                            </div>

                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
