import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as helmet from 'helmet';
import * as fileupload from 'express-fileupload';
import * as path from 'path';
import { notFound, prodError } from './errorhandler/errorhandler';
import { MongoHelper } from './db/mongo.helper';
import { router } from './route/router';

dotenv.config({ path: 'application.env' });
const port = process.env.port || 7657;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(fileupload());
app.use('/api', router);
app.use(notFound);
app.use(prodError);

const server = http.createServer(app);
server.listen(port);

server.on('error', (err) => {
  console.log(err);
});

server.on('listening', async () => {
  console.log(`App is running at http://localhost:${port} in ${app.get('env')} mode`);
  try {
    await MongoHelper.connect(`${process.env.MONGO_URI_STAGING}`);
    console.log(`Connected to db`);
  } catch (error) {
    console.log(`unable to connect`, error);
  }
});

