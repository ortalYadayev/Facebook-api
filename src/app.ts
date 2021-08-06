import fastify from 'fastify';
import fastifyCompress from 'fastify-compress';
import 'reflect-metadata';
import {createConnection} from "typeorm";
import {User} from "./models/User.js";

export const createApp = async (options: any = {}) => {
    const app = fastify(options);

    app.register(fastifyCompress);

    const connection = await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "ortalyad",
        password: "",
        database: "facebook_clone",
        entities: [
            User
        ],
        synchronize: true
    })

    app.get('/', async () => {
        return { hello: 'world' }
    })

    return app;
}

const startApp = async () => {
    const app = await createApp({logger: true});
    try {
        await app.listen(3000)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}
startApp()
