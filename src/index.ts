import express, { Request, Response } from "express"
import { ScheduleHandler } from "./handlers/schedule-handler";

let app = express(); 

const scheduleHandler = new ScheduleHandler();

const server = require("http").Server(app);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/schedule', async (req: Request, res: Response): Promise<Response> => {
  return res.send(await scheduleHandler.scheduleJob(req.body));
});

app.get('/exists', (req: Request, res: Response): Response => {
  return res.send(scheduleHandler.canJobBeScheduled());
});

app.post('/stop', async (req: Request, res: Response): Promise<Response> => {
  return res.send(await scheduleHandler.stopJob());
});

const port = 3000;

server.listen(port, (err: string) => { 
  console.log(err || `Listening on port ${port}`);
});