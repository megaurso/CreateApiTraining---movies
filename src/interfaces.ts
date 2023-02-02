import { QueryResult } from "pg";

interface IMovieRequest {
  name: string;
  duration: number;
  price: number;
}

interface IMovie extends IMovieRequest {
  description: string;
  id: number;
}

interface IMovieResult {
  nextPage: string | null;
  previusPage: string | null;
  count: number;
  data: IMovie[];
}

type MovieResult = QueryResult<IMovie>;
type CreateMovie = Omit<IMovie, "id">;

export { IMovieRequest, IMovie, MovieResult, CreateMovie, IMovieResult };
