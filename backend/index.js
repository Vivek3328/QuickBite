const express = require( "express")
const connectTomongo = require( "./db")
const cors = require('cors');
connectTomongo();

const app = express();

// Enable CORS for all routes
app.use(cors());


const port = 5000

app.use(express.json())


app.use('/api/ownerauth',require('./routes/OwnerAuth'))
app.use('/api/userauth', require('./routes/UserAuth'))
app.use('/api/menuitemauth', require('./routes/MenuItemAuth'))
app.use('/api/orderauth', require('./routes/OrderAuth'))

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


 

