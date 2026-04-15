const express = require("express");
const cors = require("cors");

const ownerRoutes = require("./routes/OwnerAuth.js");
const userRoutes = require("./routes/UserAuth.js");
const menuItemRoutes = require("./routes/MenuItemAuth.js");
const orderRoutes = require("./routes/OrderAuth.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello backend");
});

app.get("/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

app.use("/ownerauth", ownerRoutes);
app.use("/userauth", userRoutes);
app.use("/menuitemauth", menuItemRoutes);
app.use("/orders", orderRoutes);

app.use("/api/restaurants", require("./routes/restaurantsPublic"));
app.use("/api/reviews", require("./routes/reviewsApi"));
app.use("/api/favorites", require("./routes/favoritesApi"));
app.use("/api/addresses", require("./routes/addressesApi"));

module.exports = app;
