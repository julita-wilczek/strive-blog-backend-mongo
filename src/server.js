import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import postsRouter from "./services/posts/index.js"
import { badRequestHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT


server.use(cors())
server.use(express.json())

server.use("/blogPosts", postsRouter)

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")

  server.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
})