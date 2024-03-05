import React, { useState, useEffect } from "react";
// import styles from "../components/styles/RestaurantHome.module.css"
import RestoCard from "./RestoCard";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function UserHome() {
  const [owner, setOwner] = useState([]);
  const updateHotels = async () => {
    await axios
      .get("https://quickbite-kh86.onrender.com/api/ownerauth/fetchallowner")
      .then((res) => {
        setOwner(res.data);
        // console.log(res.data)
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    updateHotels();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row my-3" style={{ padding: "10px" }}>
          {owner?.map((element, index) => {
            return (
              <div className="col-md-4" key={index} style={{ padding: "10px" }}>
                <RestoCard
                  name={element?.name}
                  foodtype={element?.foodtype}
                  image={
                    element?.image
                      ? element.image
                      : "https://b.zmtcdn.com/data/pictures/chains/5/18575885/54b6de34323395a3b10897e48bd2a6e5_o2_featured_v2.jpg?output-format=webp"
                  }
                  id={element._id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
