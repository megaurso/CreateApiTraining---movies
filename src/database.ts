import { Client } from "pg";

const client: Client = new Client({
    user: "postgres",
    password: "1234",
    host: "localhost",
    database: "listmovies",
    port: 5432
})

const startDatabase =async(): Promise<void> => {
    await client.connect()
    console.log("Database connected!")
}

export { client , startDatabase}