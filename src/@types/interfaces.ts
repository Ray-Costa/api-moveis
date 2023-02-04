interface IMoviesRequest{
  name: string;
  description: string;
  duration: number;
  price:number;
}

interface IMovies extends IMoviesRequest {
  id: number
}

 type MoviesRequiredKeys = "name";

interface Pagination {
  previousPage: string | null;
  nextPage: string | null;
  count: number;
  data: IMoviesRequest[];

}

export {IMovies, IMoviesRequest, MoviesRequiredKeys, Pagination}
