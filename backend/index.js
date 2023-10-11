const express = require( "express")
const connectTomongo = require( "./db")
connectTomongo();


const app = express()
const port = 5000

app.use(express.json())
// app.use('/api/loginRest',require(('./routes/loginRest')))
app.use('/api/signupRest',require(('./routes/signupRest')))
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


 

