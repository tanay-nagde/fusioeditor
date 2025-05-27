import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import userRouter from "./routes/user.routes.js"
import canvasRouter from "./routes/canvas.routes.js"

// // Routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/canvas", canvasRouter)


  export {app}