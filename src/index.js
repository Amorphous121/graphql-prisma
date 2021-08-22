require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const chalk = require('chalk');
const { PrismaClient } = require('@prisma/client');
const { passWordHash } = require('./middleware/prisma-middleware');

const typeDefs = './src/graphql/schema/schema.graphql';
const resolvers = require('./graphql/resolvers');

const prisma = new PrismaClient();

// prisma.$use(passWordHash);

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request }) => {
    return { request, prisma };
  },
});

const graphqlConfig = {
  port: 8081,
  endpoint: '/graphql',
  playground: '/graphql',
  cors: { origin: '*' },
};

server.use((err, req, res, next) => {
  console.log(err.message);
})

server.start(graphqlConfig, () => {
  console.log(
    'Server is up & running at ' +
      chalk.bgBlueBright.whiteBright(
        '  http://localhost:' + server.options.port + '/graphql'
      )
  );
});
