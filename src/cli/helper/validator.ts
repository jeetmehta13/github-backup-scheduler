export function validateGitHubRepoUrl(url: string): boolean {
    let regex = new RegExp(/^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9\-]{1,})+\/([A-Za-z0-9\-]{1,})+\/?$/);
 
    if (url == null) {
        return false;
    }
 
    return regex.test(url);
}