const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
    const app = express();
    // ! stands for requrired or not-null field
    // when you have to fetch something from graphql server -> query
    // when you gotta give something to graphql server -> mutation
    const server = new ApolloServer({
        // type definitions
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                user: User
            }

            type Query {
                getTodos: [Todo]
                getUsers: [User]
                getUser(id: ID!): User
            }
        `,
        // logic is written here
        resolvers: {
            // if user is asked in a todo then fetch the information of the user who's id is equal to todo.id
            Todo: {
                user: async (todo) =>
                    (
                        await axios.get(
                            `https://jsonplaceholder.typicode.com/users/${todo.id}`
                        )
                    ).data,
            },
            Query: {
                getTodos: async () =>
                    (
                        await axios.get(
                            "https://jsonplaceholder.typicode.com/todos"
                        )
                    ).data,
                getUsers: async () =>
                    (
                        await axios.get(
                            "https://jsonplaceholder.typicode.com/users"
                        )
                    ).data,
                getUser: async (parent, { id }) =>
                    (
                        await axios.get(
                            `https://jsonplaceholder.typicode.com/users/${id}`
                        )
                    ).data,
            },
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => console.log(`Server started at 8000`));
}

startServer();
