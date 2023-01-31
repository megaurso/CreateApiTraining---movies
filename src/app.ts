import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovie, listAllMovies } from "./functions";

const app: Application = express()
app.use(express.json())

app.post("/movies", createMovie)
app.get("/movies", listAllMovies)

app.listen(3000, async()=>{
    await startDatabase()
    console.log("Server is running!")
})