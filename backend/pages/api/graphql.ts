import { ApolloServer, gql } from 'apollo-server-micro';
import prisma from '../../lib/prisma';

const typeDefs = gql`
  type Post { id: Int!, text: String }
  type Query { posts: [Post!]! }
`;

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
export const config = { api: { bodyParser: false } };
export default apolloServer.createHandler({ path: '/api/graphql' });
