import express, {Application} from 'express';
import {startDatabase} from './database';
import{
  createMovies,
  listMovies
}from "./logic";

const app: Application = express();
app.use(express.json());

app.post('/movies',  createMovies);
app.get('/movies',  listMovies);



const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT,async () => {
  await startDatabase()
  console.log(runningMsg)
});

