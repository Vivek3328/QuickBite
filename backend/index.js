const express = require( "express")
const mongo = require( "./db")
mongo();


const app = express()
const port = 5000


app.get('/', (req, res) => {
    res.send('Hello Moto')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


 

