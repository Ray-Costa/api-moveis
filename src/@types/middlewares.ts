import { DatabaseError } from 'pg';
import { NextFunction, Request, Response } from 'express';

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
