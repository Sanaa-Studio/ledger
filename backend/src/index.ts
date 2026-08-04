import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000; 

app.get('/', (req: Request, res: Response) => {
    console.log(app.mountpath);
    res.send('Welcome again to Ledger Homepage');
});

app.listen(port, () =>{
    console.log(`Ledger is listening on Port ${port}`);
});
