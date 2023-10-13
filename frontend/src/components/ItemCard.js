import React from "react";

export default function ItemCard() {

  const handleClick = () => {

  }

  const handleAddToCart = async () => {

    }
    
    return (
        <div>
            <div className="card mt-3 border border-primary border-4 rounded" style={{ width: "18rem", maxHeight: "360px" }}>
                <img src="https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" className="card-img-top" alt="..." style={{ height: "150px", objectFit: "fill" }} />
                <div className="card-body">
                    <h5 className="card-title">Dish Name</h5>
                    <div className='container w-100 p-0' style={{ height: "38px" }}>
                        <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }} onClick={handleClick} >
                                    <option key="hiii" value="hiii">
                                        hiii
                                    </option>
                        </select>
                        <select className="m-2 h-100 w-20 bg-success text-black rounded" style={{ select: "#FF0000" }} >
                                <option key="hii" value="hii">hii</option>
                        </select>
                        <div className=' d-inline ms-2 h-100 w-20 fs-5'>
                            ₹500/-
                        </div>
                    </div>
                    <hr></hr>
                    <button className="btn btn-danger justify-center ms-2" onClick={handleAddToCart}>Delete</button>
                </div>
            </div>
        </div>
    )
}
