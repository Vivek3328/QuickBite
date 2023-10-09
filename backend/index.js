// const mongoose = require( "mongoose")
const express = require( "express")
const mongo = require( "./db")
mongo();
// import "./db.js"

const app = express()
const port = 5000


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


 

