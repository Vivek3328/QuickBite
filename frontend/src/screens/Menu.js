import React from "react";
import Navbar from "../components/Navbar";
import MenuCard from "./MenuCard";

export default function Menu() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div
          className="row my-3 item-center"
          style={{ padding: "10px", justifyContent: "center" }}
        >
          <div className="col-md-8" style={{ padding: "10px" }}>
            <MenuCard />
          </div>
        </div>
      </div>
    </div>
  );
}
