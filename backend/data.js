const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const data = require("./assets/themesData");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfully");
});

const port = process.env.PORT || 3000;

// Wrap your code in an async function
async function saveDataAndStartServer(items) {
  try {
    await Promise.all(items.map((e) => e.save()));
    console.log("Insert completed");
  } catch (err) {
    console.log(`Error happened: ${err}`);
  }
}

// Call the async function
// saveDataAndStartServer(users);
saveDataAndStartServer(data);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
