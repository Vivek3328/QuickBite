import React, { useEffect, useState } from "react";
import CartContext from "./cartContext";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const CartState = (props) => {
  const toast = useToast();
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


  const [amt, setAmt] = useState(0);
  const clearCart = () => {
    // console.log('cart cleared');
   setAmt(0);
   setCart([]);
   localStorage.removeItem("cart");
   setQuantity(1);

  };
  const placeOrder = () => {
    // console.log('cart cleared');
    toast({
     
      title: "Order Placed Successfully.",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
    navigate("/userhome");
    clearCart();
  };
  const handlePrice = () => {
    let ans = 0;
    //eslint-disable-next-line
    cart.map((it) => {
      //eslint-disable-next-line
      ans += it.quantity * it.price;
    });
    //eslint-disable-next-line
    setAmt(ans);
  };
  const handleQuant = (id, d) => {
    let index = -1;
    cart.forEach((data, index1) => {
      if (data._id === id) index = index1;
    });
    // setIndex(index) ;
    var tempArr = cart;
    tempArr[index].quantity += d;
    if (tempArr[index].quantity === 0) tempArr[index].quantity = 1;
    setCart([...tempArr]);
  };
  const checkCart = (item) => {
    // console.log("Checking cart for item with owner:", item.owner);
    if (cart.length > 0 && cart[0].owner === item.owner) {
      // console.log("Owner IDs match. Adding item to existing cart.");
      handleclick(item);
    } else {
      // console.log("Owner IDs do not match. Clearing cart and adding item.");
      localStorage.removeItem('cart');
      clearCart();
      handleclick(item);
    }
  };
  
  const handleclick = (item) => {
    let temp = {};
    temp = item;
    temp.quantity = quantity;

    let present = false;
    cart.forEach((pro) => {
      if (item._id === pro._id) present = true;
    });
    if (present) {
      toast({
        title: "Item is aleady present in Cart",
        status: "error",
        duration: 2000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
    toast({
     
      title:item.itemname + " is added in Cart",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
  };
  useEffect(() => {
    // console.log(JSON.parse(localStorage.getItem("cart")) || []);
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    
  }, []);
  // useEffect(() => {
  //   handlePrice();
  // }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        handleclick,
        quantity,
        setQuantity,
        handleQuant,
        handlePrice,
        amt,
        setAmt,
        clearCart,
        checkCart,
        placeOrder
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartState;
