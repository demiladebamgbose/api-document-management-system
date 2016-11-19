import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './server/routes/index';


if (!process.env.NODE_ENV) {
  dotenv.config();
}

const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

routes(router);

app.get('/', (req, res) => {
  res.json({
    message: 'root route'
  });
});

app.use('/api/', router);


app.listen(port, () => {
  console.log (`app started on port${port}`);
});

export default app;
