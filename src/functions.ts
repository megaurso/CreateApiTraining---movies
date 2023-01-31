import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
import { client } from "./database";
import { CreateMovie, IMovie, IMovieRequest, MovieResult } from "./interfaces";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const dataRequest: IMovieRequest = req.body;
  const movieData: CreateMovie = {
    ...dataRequest,
    description: "",
  };

  const queryString: string = format(
    `
        INSERT INTO 
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(movieData),
    Object.values(movieData)
  );

  const queryResult: MovieResult = await client.query(queryString);
  const newResult: IMovie = queryResult.rows[0];
  return res.status(201).json(newResult);
};

const listAllMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const query: string = `
        SELECT
            *
        FROM
            movies;
    `;

  const queryResult: MovieResult = await client.query(query);

  return res.status(201).json(queryResult.rows);
};

export { createMovie, listAllMovies };
