import express, { type Express, type Request, type Response } from 'express'; 
import { corsMiddleware } from './middleware/cors.js';

const app: Express = express();

// Middleware
app.use(corsMiddleware); 
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    console.log(app.mountpath);
    res.send('Welcome again to Ledger Homepage');
});

export default app;