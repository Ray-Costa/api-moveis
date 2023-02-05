import { DatabaseError, QueryConfig } from 'pg';
import { NextFunction, Request, Response } from 'express';
import { IMovies } from './interfaces';
import {client} from './database';

export function handlePostgresDatabaseError(err: DatabaseError, req: Request, res: Response, next: NextFunction) {
  if (err instanceof DatabaseError) {
    if (err.code === '23505') {
      res.status(409).send({
        status: 409,
        message: `${err.table} already exists.`,
        detail: err.detail
      });
    } else {
      next(err);
    }
  }
}

export function handleUnknownError(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send({ status: 500, message: 'Something went wrong!' });
}

export const ensuteMoviesExists = async (request:Request, response: Response, next: NextFunction):Promise<Response | void>=> {

  const id:Number = Number(request.params.id)

  const queryString: string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id = $1;
    `
  const queryConfig: QueryConfig = {
    text:queryString,
    values: [id]
  }
  const queryResult = await client.query<IMovies>(queryConfig)

  if(!queryResult.rowCount){
    return response.status(404).json({message: "Movie not found"})

  }
  return next()




}


