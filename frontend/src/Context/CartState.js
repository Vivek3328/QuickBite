import React , {useEffect, useState} from "react";
import CartContext from "./cartContext";
import {  useToast } from '@chakra-ui/react'

const CartState  =(props) =>{
    const toast = useToast()
    const [cart, setCart] = useState([]) ;
    // const [price, setPrice] = useState(0);
  
    // const handlePrice = () =>{
    //   let ans =0 ;
    //   cart.map((it)=>{
    //     ans+= it.cnt * it.price ;
    //   })
    //   setPrice(ans) ;
    // }
    const handleclick = (item) => {
        console.log(item) ;

        let present = false ;
        cart.forEach((pro) => {
          if(item._id === pro._id )
          present = true ;
        })
        if(present)
        {
          toast({
            title: 'Item is aleady present in Cart',
            status: 'error',
            duration: 2000,
            position: 'top-right',
            isClosable: true,
          })
          return ;
        }
        setCart([...cart, item]);
        localStorage.setItem("cart",JSON.stringify([...cart,item]))
    }
    useEffect(() => {
      // console.log(JSON.parse(localStorage.getItem("cart")) || []);
      setCart(JSON.parse(localStorage.getItem("cart")) || [])
  }, [])
  
    return (
        <CartContext.Provider value ={{ cart, setCart, handleclick}}>
            {props.children}
        </CartContext.Provider>
    )
}

export default CartState