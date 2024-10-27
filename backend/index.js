const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectTOMongoDB = require("./db");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 8000;

connectTOMongoDB();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello backend");
});

app.get("/")

app.use("/ownerauth", require("./routes/OwnerAuth.js"));
app.use("/userauth", require("./routes/UserAuth.js"));
app.use("/menuitemauth", require("./routes/MenuItemAuth.js"));
app.use("/orders", require("./routes/OrderAuth.js"));

app.listen(port, () => {
  console.log(`App is Listening on Port ${port}`);
});
