import React, {  useContext } from 'react'
import MenuCard from './MenuCard';
import cartContext from '../Context/cartContext';


export default function Cart() {

    const a = useContext(cartContext);
    // const [price, setPrice] = useState(0);

    return (
        <div>
            <div className="container">

                <div className="row my-3 item-center" style={{ padding: '10px', justifyContent: 'center' }} >

                    {a.cart?.map((element, index) => {
                        console.log(element._id);
                        return <div className="col-md-8" key={index} style={{ padding: '10px' }}>
                            <MenuCard itemname={element?.itemname} price={element?.price} image={element?.image ? element.image : "https://img.icons8.com/?size=96&id=61083&format=png"} description={element?.description} _id={element._id}
                            />
                        </div>

                    })}
                </div>
            </div>
        </div>

    )
}
