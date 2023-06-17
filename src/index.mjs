import http from 'http';
import Router from './router.mjs';

const PORT = process.env.PORT || 8080;
const router = new Router();
const server = http.createServer(await router.handler.bind(router));

server.listen(PORT, () => {
  console.log(`Server running at: ${server.address().port}`);
});
