import React, { useContext, useEffect } from "react";
import MenuCard from "./MenuCard";
import cartContext from "../Context/cartContext";
import { Button, Text } from "@chakra-ui/react";

export default function Cart() {
  const a = useContext(cartContext);
  let isEmpty=true;
  if(a.cart.length > 0) {
    isEmpty=false;
  }
  
  useEffect(() => {
    // console.log("cart");
    a.handlePrice();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="container ">
        {(a.cart.length > 0) ? (
          // Render this if cart has items
          <div
            className="row my-3 mb-5 item-center"
            style={{ padding: "10px", justifyContent: "center" }}
          >
            <Text fontSize='3xl' as='samp' color='seagreen' style={{ textAlign: 'center'}}>Shopping Cart</Text>
            {a.cart?.map((element, index) => {
              // console.log(element._id);
              return (
                <div className="col-md-8" key={index} style={{ padding: "10px" }}>
                  <MenuCard
                    itemname={element?.itemname}
                    price={element?.price}
                    image={
                      element?.image
                        ? element.image
                        : "https://img.icons8.com/?size=96&id=61083&format=png"
                    }
                    description={element?.description}
                    _id={element._id}
                    quantity={element.quantity}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Text fontSize='2xl' as='samp' color='red.400' style={{ textAlign: 'center', marginTop:'50px', justifyContent:'center' }}>Your Cart is Empty.</Text>
        )}

      </div>
      <div className="cart-footer px-5" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: '#f8f9fa', padding: '10px', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {(a.cart.length > 0 ?  (
            <Text fontSize='2xl' as='samp' color='GrayText'>
           
            Your Total Amount is : {a.amt} Rs.
            </Text>
          ): (
            <Text fontSize='2xl' as='samp' color='GrayText'>
           
            Your Total Amount is : 0 Rs.
            </Text>
          ))}
         
        </div>
        <div>
          <Button isDisabled= {isEmpty} colorScheme="green" onClick={() => a.placeOrder()}style={{ marginRight: '10px' }}>
            Place Order
          </Button>
          <Button colorScheme="red" onClick={() => a.clearCart()}>
            Clear Cart
          </Button>
        </div>
      </div>



    </div>
  );
}
