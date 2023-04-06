import cron, { ScheduledTask } from "node-cron"
import { BackupHandler } from "./backup-handler";

export class ScheduleHandler {
  private isScheduled: boolean;
  private scheduledJob: ScheduledTask | null;

  constructor() {
    this.isScheduled = false;
    this.scheduledJob = null;
  }
  
  private fetchRepoZipLink(githubRepo: string): string {
    return `https://api.github.com/repos/${githubRepo}/zipball`
  }
  
  private async startJob(scheduleFrequency: string, zipLink: string, accessToken: string) {
    try {
      const backupHandler = new BackupHandler(zipLink, accessToken);
      this.scheduledJob = cron.schedule(scheduleFrequency, async () => {
        backupHandler.startBackup();
      });
      this.isScheduled = true;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  async stopJob() {
    if(!this.isScheduled) {
      console.error('Tried to stop job when it does not exist');
      return {ok: false, message: 'No Job is scheduled'};
    }
    try {
      this.scheduledJob?.stop();
      this.isScheduled = false;
      return {ok: true, message: 'Job has been deleted'};
    } catch (error: any) {
      console.error(error);
      return {ok: false, message: `Job could not be stopped. [ERROR]: ${error.message}`};
    }
  }
}