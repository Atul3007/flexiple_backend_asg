import express from 'express';
import router from "./routes/usersRoutes";
import menuRouter from './routes/menuRoutes';

const app: express.Application = express();
const port: number = 8000;

app.use(express.json());

app.use("/", router);
app.use("/menu/",menuRouter)

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
