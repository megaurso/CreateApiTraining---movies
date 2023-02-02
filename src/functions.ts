import { Request, response, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
import { client } from "./database";
import {
  CreateMovie,
  IMovie,
  IMovieRequest,
  IMovieResult,
  MovieResult,
} from "./interfaces";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const dataRequest: IMovieRequest = req.body;

  const queryString: string = format(
    `
        INSERT INTO 
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(dataRequest),
    Object.values(dataRequest)
  );

  const queryResult: MovieResult = await client.query(queryString);
  const newResult: IMovie = queryResult.rows[0];
  return res.status(201).json(newResult);
};

const listAllMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const perPage: any = req.query.perPage === undefined ? 5 : req.query.perPage;
  let page: any =
    isNaN(Number(req.query.page)) || Number(req.query.page) < 0
      ? 1
      : Number(req.query.page);

  page = page * perPage;

  const query: string = `
        SELECT
            *
        FROM
            movies
        LIMIT $1 OFFSET $2;
    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [perPage, page],
  };

  const queryResult: MovieResult = await client.query(queryConfig);
  const data = queryResult.rows;

  const nextPageFunction = () => {
    const nextPage = `http://localhost:3000/movies?page=${
      page + 1
    }&perPage${perPage}`;

    if (data.length === 0) {
      const nextPage = null;
      return nextPage;
    }
    return nextPage.toString();
  };
  const previusPageFunction = () => {
    const previusPage = `http://localhost:3000/movies?page=${
      page - 1
    }&perPage${perPage}`;

    if (data.length === 0) {
      const previusPage = null;
      return previusPage;
    }

    return previusPage.toString();
  };

  const queryFinish: IMovieResult = {
    nextPage: nextPageFunction(),
    previusPage: previusPageFunction(),
    count: queryResult.rowCount,
    data: [...queryResult.rows],
  };

  return res.status(201).json(queryFinish);
};

const updateMovies = async (req: Request, res: Response): Promise<Response> => {
  if (req.body.id) {
    delete req.body["id"];
  }
  const id: number = +req.params.id;
  const movieData = Object.values(req.body);
  const movieKeys = Object.keys(req.body);

  const formatString: string = format(
    `
    UPDATE
      movies
    SET(%I) = ROW(%L) 
    WHERE
      id = $1
      RETURNING *;
  `,
    movieKeys,
    movieData
  );

  const queryConfig: QueryConfig = {
    text: formatString,
    values: [id],
  };

  const queryResult: MovieResult = await client.query(queryConfig);
  return res.json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;

  const queryString: string = `
    DELETE FROM
      movies
    WHERE
      id = $1 ;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

export { createMovie, listAllMovies, updateMovies, deleteMovie };
