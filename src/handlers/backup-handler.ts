import fetch from "node-fetch";
import fs from "fs";

export class BackupHandler {
  private zipLink: string;
  private accessToken: string | null;

  constructor(zipLink: string, accessToken: string | null) {
    this.accessToken = accessToken;
    this.zipLink = zipLink;
  }
  
  async createBackup(backupName?: string) {
    try {
      console.log('Cron job running');
      const repoZip = await fetch(this.zipLink, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${this.accessToken}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      if(repoZip.status < 200 || repoZip.status >= 400)
      {
        const message = (await repoZip.json()).message;
        console.error(`Could not create backup. Reason: ${message}`);
        return;
      }
      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(`${backupName}`);
        repoZip.body?.pipe(fileStream);
        repoZip.body?.on("error", (err) => {
          console.error(`Cron Job: File Downlaod failed. [ERROR]: ${err}`);
          reject(err);
        })
        fileStream.on("finish", function() {
          resolve("finished");
        });    
      });
    } catch (error: any) {
      console.log(`ERROR! Cron job failed. Reason: ${error.message}`)
    }
  }
}