import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRouter from "./Routes/UserRoute.js";
import NoteRouter from "./Routes/NoteRoute.js";
import morgan from "morgan";
import { rateLimit } from "./Middleware/Ratelimiting.js";
// Create an Express App
const app = express();

// Configure middleware for the Express application
app.use(express.json({ limit: "2048kb" }));
app.use(cookieParser());
app.use(cors());
app.use(morgan());
app.use("/",express.static("Public"))
app.use(rateLimit);
// routes

app.use("/api/auth", AuthRouter);
app.use("/api/notes", NoteRouter);

// Start Server

//I know that .env should not be shared .I have shared it  for ease of access as my mongodb database accessible from all ip .
//still for best practices i had added .env.example file 
export const RunServer = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const port = process.env.PORT || 8000;

      const server = app.listen(port, () => {
        console.log(`Server Running At Port ${port}. http://localhost:${port}`);
        resolve(server);
      });

      server.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
