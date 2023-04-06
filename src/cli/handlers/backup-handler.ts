import UserPrompts from "../assets/user-prompts";
import { parseFrequencyString, parseRepositoryUrl } from "../helper/parser";
import inquirer from 'inquirer';
import { validateGitHubRepoUrl } from "../helper/validator";
import fetch from "node-fetch";

export class CliBackupHandler {
  private url: string = `http://localhost:3000`;
  private githubRepo?: string; 
  private frequencyValue?: string;
  private accessToken?: string;

  async fetchDetailsFromUser() {
    await this.fetchGitHubRepo();
    await this.fetchAccessToken();
    await this.fetchFrequency();
  }

  async scheduleBackup(): Promise<string> {
    try {
      if(!this.githubRepo || !this.frequencyValue || !this.accessToken) throw new Error("Data missing. Error occured when scheduling backup.");

      let body = {
        githubRepo: this.githubRepo, 
        scheduleFrequency: this.frequencyValue, 
        accessToken: this.accessToken
      };

      console.log('Ok, creating a scheduled backup for your GitHub repository');
      
      const res: any = await fetch(`${this.url}/schedule`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json' }
      });

      return (await res.json()).message;
    } catch (error) {
      console.log(`Error in creating sheduled backup [ERROR]: ${error}`);
      return UserPrompts.standardErrorPrompt;
    }  
  }

  async jobExists(): Promise<boolean | undefined> {
    try {
      const res: any = await fetch(`${this.url}/exists`);
      return (await res.json()).is_scheduled;
    } catch (error) {
      console.log(`Error checking if job exists [ERROR]: ${error}`);
      return undefined;
    }
  }

  async deleteJobPrompt(): Promise<boolean> {
    const deleteJobInput = await inquirer.prompt([
      {
        name: "deleteJobInput",
        message: UserPrompts.deleteJobPrompt,
        type: "confirm"
      }
    ]);
    return deleteJobInput['deleteJobInput'];
  }

  async deleteJob(): Promise<string> {
    try {
      const res: any = await fetch(`${this.url}/stop`, {method: 'POST'});
      return (await res.json()).message;
    } catch (error) {
      console.log(`Error checking if job exists [ERROR]: ${error}`);
      return UserPrompts.standardErrorPrompt;
    }
  }

  private async fetchFrequency() {
    const frequencyInput = await inquirer.prompt([
      {
        name: "frequencyInput",
        message: UserPrompts.pickFrequencyPrompt,
        type: "input"
      }
    ]);
  
    try {
      this.frequencyValue = parseFrequencyString(frequencyInput['frequencyInput']);
    } catch (error: any) {
      console.log(`${error.message}`);
      await this.fetchFrequency();
    }
  }

  private async fetchGitHubRepo() {
    const githubUrlInput = await inquirer.prompt([
      {
        name: "githubUrlInput",
        message: UserPrompts.gitHubRepoUrlPrompt,
        type: "input",
      }
    ]);
  
    if(!validateGitHubRepoUrl(githubUrlInput['githubUrlInput'])) {
      console.log(`\n${UserPrompts.invalidGitHubUrl}\n`);
      await this.fetchGitHubRepo();
    }
    this.githubRepo = parseRepositoryUrl(githubUrlInput['githubUrlInput']);
  }
  
  private async fetchAccessToken() {
    const accessTokenInput = await inquirer.prompt([
      {
        name: "accessTokenInput",
        message: UserPrompts.accessTokenPrompt,
        type: "input"
      }
    ]);
    this.accessToken = accessTokenInput['accessTokenInput'];
  }
}