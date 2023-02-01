import { Request, Response } from 'express';
import { client } from './database';
import { IMoviesRequest, moviesResult } from './interfaces';


const createMovies = async (request: Request, response: Response): Promise<Response> => {

  const moviesDataRequest: IMoviesRequest = request.body;

  const queryCreateMovies: string = `
      INSERT INTO movies ("name", "description", "duration", "price")
      VALUES ($1, $2, $3, $4) RETURNING "id", "name", "description", "duration", "price"
  `
  const {rows}= await client.query(queryCreateMovies, [moviesDataRequest.name, moviesDataRequest.description,
    moviesDataRequest.duration, moviesDataRequest.price])


  return response.status(201).json(rows[0])
}

const listMovies = async (request: Request, response: Response): Promise<Response> => {

  const query: string = `
      SELECT *
      FROM movies;
  `
  const queryResult: moviesResult = await client.query(query)
  console.log(queryResult)

  return response.status(200).json(queryResult.rows)
}


export {
  createMovies,
  listMovies
}
