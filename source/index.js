import express from 'express';
import bodyParser from 'body-parser';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import taskRoutes from './routes/taskRoutes.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(taskRoutes);
app.use(express.static(join(currentDir, '/public/html')));
app.use(express.static(join(currentDir, '/public')));

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`RJB app listening at http://localhost:${port}`);
});
