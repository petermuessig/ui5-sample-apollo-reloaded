
const express = require('express');
const cors = require('cors');
const http = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const TODO_ADDED = 'TODO_ADDED';
const TODO_COMPLETED = 'TODO_COMPLETED';
const TODO_DELETED = 'TODO_DELETED';
const TODO_UPDATED = 'TODO_UPDATED';

const typeDefs = gql`
  input TodoCreateInput {
    title: String
  }

  input TodoUpdateInput {
    title: String
    id: ID
  }

  type Todo {
    id: ID!
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    createTodo(todo: TodoCreateInput): Todo
    updateTodo(todo: TodoUpdateInput): Todo
    deleteTodo(id: ID): Boolean
    deleteCompleted: Boolean
    setTodoCompletionStatus(id: ID!, completed: Boolean!): Todo
  }

  type Subscription {
    todoAdded: Todo
    todoUpdated: Todo
    todoCompleted: Todo
    todoDeleted: Boolean
  }
`;

let todos = [
  {
    "id": "1",
    "title": "Start this app",
    "completed": true
  },
  {
    "id": "2",
    "title": "Learn OpenUI5",
    "completed": false
  }
];

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    setTodoCompletionStatus: async (_, { id, completed }, { dataSources }) => {
      let todo = todos.find(x => x.id === id)
      todo.completed = completed;
      pubsub.publish(TODO_COMPLETED, { todoCompleted: todo });
    },
    deleteCompleted: async (_) => {
      let i = todos.length;
      while (i--) {
        const todo = todos[i];
        if (todo.completed) {
          todos.splice(i, 1);
        }
      }
      pubsub.publish(TODO_DELETED, { todoDeleted: true });
      return true
    },
    createTodo: async (_, { todo }, { dataSources }) => {
      let nextId = todos.length + 1;
      const newTodo = {
        id: nextId.toString(),
        title: todo.title,
        completed: false
      }
      todos.push(newTodo)
      pubsub.publish(TODO_ADDED, { todoAdded: newTodo });
      return newTodo;
    },
    updateTodo: async (_, { todo }, { dataSources }) => {
      let todoIndex = todos.findIndex(t => t.id === todo.id);
      todos[todoIndex].title = todo.title;
      const updatedTodo = todos[todoIndex]
      pubsub.publish(TODO_UPDATED, { todoUpdated: updatedTodo });
      return updatedTodo;
    },
    deleteTodo: async (_, { id }, { dataSources }) => {
      let todoIndex = todos.findIndex(t => t.id === id);
      todos.splice(todoIndex, 1);
      pubsub.publish(TODO_DELETED, { todoDeleted: true });
      return true
    }
  },
  Subscription: {
    todoAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([TODO_ADDED]),
    },
    todoCompleted: {
      subscribe: () => pubsub.asyncIterator([TODO_COMPLETED]),
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator([TODO_DELETED]),
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED]),
    }
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer(schema) {
  const app = express();

  app.use(cors())

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ],
  });

  const subscriptionServer = SubscriptionServer.create({
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe
  }, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
    path: server.graphqlPath,
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(schema);
