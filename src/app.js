import express from 'express';
import path from 'path';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.set('views', path.join(__dirname, 'views'));
    this.server.set('view engine', 'hbs');
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
