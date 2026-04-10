const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { schema } = require('../backend/pages/api/graphql');

const server = createServer((req, res) => { res.writeHead(404); res.end(); });
const wss = new WebSocketServer({ server, path: '/graphql' });
useServer({ schema, execute, subscribe }, wss);

server.listen(4000, () => console.log('GraphQL WS running at ws://localhost:4000/graphql'));
