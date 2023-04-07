export default class UserPrompts {
  static welcomePrompt: string = "Hello! We would love to help you schedule a backup for your GitHub repository.";
  static gitHubRepoUrlPrompt: string = 'What is the URL of the GitHub Repo you want to backup?';
  static invalidGitHubUrl: string = 'Not a valid GitHub URL, example of a valid GitHub Repo URL: https://github.com/jeetmehta13/test-repo';
  static pickFrequencyPrompt: string = "How frequently should this reposiotry be backed up? (eg. 5h, 30m)"
  static invalidFrequencyError: string = "Sorry, this is not the correct format. Input should be either xm or xh where x represents the number of minutes or number of hours respectively"
  static accessTokenPrompt: string = "Pleae provide your PAT. We need PAT to access the repository, to create one, go to: https://github.com/settings/tokens (We only require the repository read permissions)"
  static standardErrorPrompt: string = "Oops, some error occured on our end. Please try again!";
  static jobExistsPrompt: string = "A backup schedule already exists. What would you like to do?"
  static jobExistsChoices: string[] = [
    "Fetch the backed up file",
    "Delete the scheduled backup (This will delete the backup as well!)",
    "Exit"
  ];
  static fileDownloadFailedPrompt: string = `The backup could not be downloaded due to some error. Please try again`;
  static deleteJobPrompt: string = "Are you sure you want to delete the existing scheduled backup along with the backup file?";
  static fileDownloadedPrompt = (fileName: string) => `The backup has been as ${fileName}`;
}