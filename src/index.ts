import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import { typeDefs } from './graphql/schema/typeDefs';
import { queryResolvers } from './graphql/resolvers/query';
import { mutationResolvers } from './graphql/resolvers/mutation';
import { Context } from './types/comType';
import { getUserFromToken } from "./utils/auth";
import { HttpStatus } from './utils/errorCodes';

dotenv.config();

async function main() {
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8083;

    const resolvers = {
        ...queryResolvers,
        ...mutationResolvers,
    };
    
    const app = express();
    const httpServer = createServer(app);
    const store = new PrismaClient();

    const server = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        formatError: (error) => {
            const message = error.message || 'An unknown error occurred';
            const code = typeof error.extensions?.code === 'string' ? error.extensions.code : 'INTERNAL_SERVER_ERROR';
            const httpStatusCode = typeof error.extensions?.httpStatusCode === 'number' ? error.extensions.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR;
            return {message, code, httpStatusCode }
        },
      });

    await server.start();

    app.use("/", cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server, {
        context: async ({ req, res }: any) => {
            const { userId } = getUserFromToken(req.headers.authorization);
            return {
                query: req["body"]["query"],
                store,
                userId
            }
        },
    }));

    httpServer.listen(PORT, "0.0.0.0", () => {
        console.info(`Server is now running at ${PORT}`);
    });
}

main();