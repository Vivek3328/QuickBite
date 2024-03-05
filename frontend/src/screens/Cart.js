import React, { useContext, useEffect } from "react";
import MenuCard from "./MenuCard";

import cartContext from "../Context/cartContext";

export default function Cart() {
  const a = useContext(cartContext);

  useEffect(() => {
    // console.log("cart");
    a.handlePrice();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="container">
        <div
          className="row my-3 item-center"
          style={{ padding: "10px", justifyContent: "center" }}
        >
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
      </div>
      <div>
        <span>Your Total Amount is : {a.amt} Rs.</span>
      </div>
    </div>
  );
}
