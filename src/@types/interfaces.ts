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

export {IMovies, IMoviesRequest, MoviesRequiredKeys}
