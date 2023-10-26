import React from 'react'
import './Card.css'

export default function Card() {
  return (
    <div className="card">
    <div className="card-header">
      <h2>Order Details</h2>
    </div>
    <div className="card-content">
      <p><strong>Item Name:</strong> hii</p>
      <p><strong>Total Price:</strong> 123</p>
      <p><strong>Shipping Address:</strong> surat</p>
      <p><strong>Order Date:</strong> 29 oct</p>
      <p><strong>Quantity:</strong> 3</p>
    </div>
  </div>
  )
}
