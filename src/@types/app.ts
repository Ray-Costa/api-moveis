import express, { Application, NextFunction, Request, Response } from 'express';
import { startDatabase } from './database';
import { createMovies, listMovies,updateMovies,deleteMovies } from './logic';
import { DatabaseError } from 'pg';
import { handlePostgresDatabaseError, handleUnknownError } from './middlewares';

const app: Application = express();

app.use(express.json());

app.post('/movies', createMovies);
app.get('/movies', listMovies);
app.patch('/movies/:id',updateMovies)
app.delete('/movies/:id',deleteMovies)


app.use(handlePostgresDatabaseError);
app.use(handleUnknownError);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT, async () => {
  await startDatabase()
  console.log(runningMsg)
});

