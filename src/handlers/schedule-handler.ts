import cron, { ScheduledTask } from "node-cron"
import { BackupHandler } from "./backup-handler";
import fs from "fs";

export class ScheduleHandler {
  private isScheduled: boolean;
  private scheduledJob: ScheduledTask | null;
  private fileLoc: string;

  constructor() {
    this.isScheduled = false;
    this.scheduledJob = null;
    this.fileLoc = `./backups/backup.zip`;
  }

  private createFileLoc(githubRepo: string) {
    if (!fs.existsSync('./backups')){
      fs.mkdirSync('./backups');
    }
    const splitted: string[] = githubRepo.split('/');
    this.fileLoc = `./backups/${splitted[0]}-${splitted[1]}-backup.zip`
  }
  
  private fetchRepoZipLink(githubRepo: string): string {
    return `https://api.github.com/repos/${githubRepo}/zipball`
  }
  
  private async startJob(scheduleFrequency: string, zipLink: string, accessToken: string) {
    try {
      const backupHandler = new BackupHandler(zipLink, accessToken);
      this.scheduledJob = cron.schedule(scheduleFrequency, async () => {
        backupHandler.createBackup(this.fileLoc);
      });
      this.isScheduled = true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getFileLoc() {
    return this.fileLoc;
  }

  async scheduleJob(body: any) {
    if(this.isScheduled) {
      console.error('Tried to schedule job when it already exists');
      return {ok: false, message: 'Job already scheduled'};
    }
    try {
      const githubRepo  = body['githubRepo'];
      const accessToken = body['accessToken'];
      const scheduleFrequency = body['scheduleFrequency'];
      const zipLink = this.fetchRepoZipLink(githubRepo);
      this.createFileLoc(githubRepo);
      
      await this.startJob(scheduleFrequency, zipLink, accessToken);
      return {ok: true, message: 'Backup has been scheduled'};
    } catch (error: any) {
      console.error(error);
      return {ok: false, message: `Job could not be scheduled. [ERROR]: ${error.message}`};
    }
  }

  canJobBeScheduled() {
    return {is_scheduled: this.isScheduled};
  }

  stopJob() {
    if(!this.isScheduled) {
      console.error('Tried to stop job when it does not exist');
      return {ok: false, message: 'No Job is scheduled'};
    }
    try {
      if (fs.existsSync(this.fileLoc)){
        fs.unlinkSync(this.fileLoc);
      }
      this.scheduledJob?.stop();
      this.isScheduled = false;
      this.fileLoc = `./backups/backup.zip`;
      return {ok: true, message: 'Job has been deleted'};
    } catch (error: any) {
      console.error(error);
      return {ok: false, message: `Job could not be stopped. [ERROR]: ${error.message}`};
    }
  }
}