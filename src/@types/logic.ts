import { NextFunction, Request, Response } from 'express';
import { client } from './database';
import { IMovies, IMoviesRequest } from './interfaces';

const createMovies = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const moviesDataRequest: IMoviesRequest = request.body;

    const queryCreateMovies: string = `
        INSERT INTO movies ("name", "description", "duration", "price")
        VALUES ($1, $2, $3, $4) RETURNING "id", "name", "description", "duration", "price"
    `
    const { rows } = await client.query<IMovies>(queryCreateMovies, [moviesDataRequest.name, moviesDataRequest.description,
      moviesDataRequest.duration, moviesDataRequest.price])

    return response.status(201).json(rows[0])
  } catch (err) {
    return next(err);
  }
}

const listMovies = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const query: string = `
        SELECT *
        FROM movies;
    `
    const queryResult = await client.query<IMovies>(query)

    return response.status(200).json(queryResult.rows)
  } catch (err) {
    return next(err);
  }
}


export {
  createMovies,
  listMovies
}
