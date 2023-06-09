#!/usr/bin/env node

import UserPrompts from './assets/user-prompts';
import { CliBackupHandler } from './handlers/backup-handler';

const backupHandler = new CliBackupHandler();

async function main() {
  console.log(UserPrompts.welcomePrompt);
  
  const jobExists: boolean | undefined = await backupHandler.jobExists();
  
  if(jobExists === undefined) {
    console.log(UserPrompts.standardErrorPrompt);
    return;
  }
  
  if (jobExists) {
    const jobExistsChoice: number = await backupHandler.jobExistsPrompt();
    switch(jobExistsChoice) {
      case 0: 
        const result: string = await backupHandler.fetchBackup();
        console.log(result);
        return;
      case 1: 
        const shouldDelete: boolean = await backupHandler.deleteJobPrompt();
        if (shouldDelete) {
          const deletedMessage: string = await backupHandler.deleteJob();
          console.log(deletedMessage);
        }
        return;
      default: return;
    } 
  } 

  await backupHandler.fetchDetailsFromUser();
  const createdMessage: string = await backupHandler.scheduleBackup();
  console.log(createdMessage);
  
  return;
}

main();