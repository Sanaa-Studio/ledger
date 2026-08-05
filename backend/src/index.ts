import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv'; 
import cors from "cors";

dotenv.config();
const app: Express = express();
const port = process.env.PORT; 

// Middleware
app.use(cors<Request>());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    console.log(app.mountpath);
    res.send('Welcome again to Ledger Homepage');
});

app.listen(port, () =>{
    console.log(`Ledger is listening on Port ${port}`);
});
