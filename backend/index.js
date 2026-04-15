require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const port = process.env.PORT || 8000;

async function start() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
