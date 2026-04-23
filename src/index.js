import express from "express";
import { connectDB } from "./DB/connection.js";
import { bootstrap } from "./app.controller.js";


const app = express();
const port = 3000;

bootstrap(app , express);

app.listen(port , (error) => {
  if (!error) {
    console.log("server is running on port", port);
  }
});
