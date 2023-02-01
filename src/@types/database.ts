import {Client} from 'pg';

const client: Client = new Client({
  user:'postgres',
  host: 'localhost',
  database: 'database_movies',
  port:5432
})

const startDatabase = async (): Promise<void> =>{
  await client.connect()
  console.log('Database connected!')
}

export {startDatabase,client}
