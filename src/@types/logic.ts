import { NextFunction, Request, Response } from 'express';
import { client } from './database';
import { IMovies, IMoviesRequest, Pagination } from './interfaces';
import { QueryConfig } from 'pg';

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

    let order = request.query.order || 'asc';
    let sort = request.query.sort;
    if (sort && sort !== 'price' && sort !== 'duration') {
      return response.status(400).json({ message: 'Invalid sort param' });
    }

    let perPage: any = request.query.perPage === undefined ? 5 : request.query.perPage
    let page: any = request.query.page === undefined ? 0 : request.query.page

    page = Number(page);
    perPage = Number(perPage);

    if (page <= 0) {
      page = 1
    }

    if (perPage < 0 || perPage > 5) {
      perPage = 5
    }

    const queryCount: string = `
        SELECT COUNT(*)
        FROM MOVIES
    `

    const { rows } = await client.query(queryCount);
    const count = rows[0].count;

    let queryWithoutOrder: string = `
        SELECT *
        FROM movies LIMIT $1
        OFFSET $2
    `

    const queryOrder: string = `
        SELECT *
        FROM movies
        ORDER BY ${sort} ${order}
          LIMIT $1
        OFFSET $2
    `

    const query = sort ? queryOrder : queryWithoutOrder;
    const params = [perPage, perPage * (page - 1)]

    const queryResult = await client.query<IMovies>(query, params)

    const baseUrl: string = 'http//localhost:3000/movies';
    let previousPage: string | null = `${baseUrl}?page=${page - 1}&perPage=${perPage}`
    let nextPage: string | null = `${baseUrl}?page=${page + 1}&perPage=${perPage}`
    let totalOfPages = Math.ceil(count / perPage);

    if (page === 1) {
      previousPage = null;
    }

    if (page >= totalOfPages) {
      nextPage = null;
    }

    const pagination: Pagination = {
      previousPage,
      nextPage,
      count: queryResult.rows.length,
      data: queryResult.rows
    };

    return response.status(200).json(pagination)

  } catch (err) {
    return next(err);
  }
}

const updateMovies = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const newMovies: IMovies = request.body;

    const idMovies: string = request.params.id;

    const valuesMovies = Object.values(newMovies)

    const querystring: string = `
        UPDATE movies
        SET name        = $1,
            description = $2,
            duration    = $3,
            price       = $4
        WHERE id = $5 RETURNING *;

    `

    const queryConfig: QueryConfig = {
      text: querystring,
      values: [...valuesMovies, idMovies]

    }
    const queryResult = await client.query<IMovies>(queryConfig)

    return response.status(200).json(queryResult.rows[0])
  } catch (err) {
    return next(err);
  }
}

const deleteMovies = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
  try {

    const idDeleteMovies: string = request.params.id
    const queryString: string = `
        DELETE
        FROM movies
        WHERE id = $1
    `
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [idDeleteMovies]
    }

    await client.query<IMovies>(queryConfig)

    return response.status(200).json();
  } catch (err) {
    return next(err);
  }
}

export {
  createMovies,
  listMovies,
  updateMovies,
  deleteMovies
}
