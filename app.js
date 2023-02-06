const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler=require('./helpers/error-handler');

//middleware
app.use(express.json());
app.use(authJwt());
app.use(errorHandler);

//Routes
const usersRoutes = require("./Router/users");
const jokesRoutes = require("./Router/randomjokes");

const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/random-joke`, jokesRoutes);

//Database Connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Unitask",
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });


//Server Connection
app.listen(5000, (err, db) => {
  if (err) throw err;
  console.log("server started");
});
