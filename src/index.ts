import express, { Request, Response } from "express"
import { ScheduleHandler } from "./handlers/schedule-handler";
import fs from "fs";

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

app.post('/stop', (req: Request, res: Response): Response => {
  return res.send(scheduleHandler.stopJob());
});

app.get('/retrieve', (req: Request, res: Response) => {
  const filePath = scheduleHandler.getFileLoc();
  if (!fs.existsSync(filePath)){
    return res.status(404).send({
      ok: false,
      message: "No backup exists yet. Either the backup schedule has not started yet or some error has occured. Please try again later."
    })
  }
  return res.status(200).download(filePath);
});

const port = 3000;

server.listen(port, (err: string) => { 
  console.log(err || `Listening on port ${port}`);
});