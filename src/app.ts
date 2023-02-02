import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, listAllMovies, updateMovies } from "./functions";
import { ensureMovieAlreadyExist, ensureMovieExist } from "./middlewares";

const app: Application = express()
app.use(express.json())

app.post("/movies",ensureMovieAlreadyExist, createMovie)
app.get("/movies", listAllMovies)
app.patch("/movies/:id",ensureMovieExist,ensureMovieAlreadyExist, updateMovies)
app.delete("/movies/:id",ensureMovieExist,deleteMovie)

app.listen(3000, async()=>{
    await startDatabase()
    console.log("Server is running!")
})