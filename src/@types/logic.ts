import { NextFunction, Request, Response } from 'express';
import { client } from './database';
import { IMovies, IMoviesRequest } from './interfaces';
import { QueryConfig } from 'pg';
import { string } from 'pg-format';

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

    let perPage: any = request.query.perPage === undefined ? 5 : request.query.perPage
    let page: any = request.query.page === undefined ? 0 : request.query.page

    if(page < 0 || !Number(page)){
      page = 1
    }

    if( perPage < 0 || perPage > 5 || !Number(perPage)){
     perPage = 5
    }

    const query: string = `
        SELECT *
        FROM movies LIMIT $1
        OFFSET $2;
    `

    const queryConfig: QueryConfig = {
      text: query,
      values: [perPage, Number(perPage) * (Number(page) - 1)]
    }
    const queryResult = await client.query<IMovies>(queryConfig)

    return response.status(200).json(queryResult.rows)
  } catch (err) {
    return next(err);
  }
}


export {
  createMovies,
  listMovies
}
