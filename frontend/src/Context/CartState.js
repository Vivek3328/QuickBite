import React , {useEffect, useState} from "react";
import CartContext from "./cartContext";
import {  useToast } from '@chakra-ui/react'

const CartState  =(props) =>{
    const toast = useToast()
    const [cart, setCart] = useState([]) ;
    const [quantity, setQuantity] = useState(1)
    // const [price, setPrice] = useState(0);
    // const [index, setIndex] = useState(-1)

    const [amt, setAmt] = useState(0);
    const handlePrice = () => {
        let ans = 0;
        //eslint-disable-next-line 
        cart.map((it) => {
          //eslint-disable-next-line 
            ans += it.quantity * it.price;
        })
        //eslint-disable-next-line 
        setAmt(ans);
    }
    const handleQuant=( id, d)=>{
  
    
      let index =-1 ;
      cart.forEach((data, index1)=>{
         if(data._id === id)
         index = index1
      });
      // setIndex(index) ;
      var tempArr = cart ;
      tempArr[index].quantity += d ; 
      if(tempArr[index].quantity === 0)
         tempArr[index].quantity=1;
      // setQuantity(tempArr[index].quantity)
      setCart([...tempArr])
    }
    const handleclick = (item) => {
        let temp={};
        temp=item;
        temp.quantity=quantity;

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
        <CartContext.Provider value ={{ cart, setCart, handleclick, quantity, setQuantity, handleQuant, handlePrice, amt, setAmt}}>
            {props.children}
        </CartContext.Provider>
    )
}

export default CartState