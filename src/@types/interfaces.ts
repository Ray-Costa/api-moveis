import {QueryResult} from 'pg';

interface IMoviesRequest{

  name: string;
  description: string;
  duration: number;
  price:number;
}
interface IMovies extends IMoviesRequest {
  id: number
}

type moviesResult = QueryResult<IMovies>

export {IMovies, IMoviesRequest, moviesResult}
