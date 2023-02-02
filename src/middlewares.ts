import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { MovieResult } from "./interfaces";

const ensureMovieExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = +req.params.id;

  const queryString: string = `
        SELECT 
            *
        FROM
            movies
        WHERE
            id = $1 ;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: MovieResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return res.status(404).json({
      message: "Movie not found.",
    });
  }

  return next();
};

const ensureMovieAlreadyExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryFail: string = `
    SELECT
      *
    FROM
      movies
    WHERE 
      name = $1;
     
  `;

  const queryFailResult: MovieResult = await client.query(queryFail, [
    req.body.name,
  ]);
  if (queryFailResult.rowCount > 0) {
    return res.status(409).json({
      message: "Movie already exists.",
    });
  }
  return next();
};
export { ensureMovieExist, ensureMovieAlreadyExist };
