# GitHub Backup Scheduler

A CLI tool to schedule backup for your GitHub repositories

## Getting started

To start the backend server:

```
  docker compose up
```

To install the CLI:

```
  npm i -g .
```

To use the CLI, you can run this command anywhere:

```
  github-backup-scheduler
```

## Current issues

1. If the server stops, the job gets deleted. 
2. This was only made to work locally expecting only one client to create backup schedules and fetch data.
3. Asking for GitHub access token everytime while scheduling a backup should not be required


## Strategy to run multiple backups

1. Storing data

    To run multiple backups, we would need to first store which client asked to schedule a job. Each job will need to be assigned to a client. We would also need to create an authentication system so that we can recognise the client and they can retrieve the backup.<br>
    We can store important data associated with the job as well like the repository and the schedule. Each job will need a unique key assigned to it, which we will also store in the database. <br>
    We can create a list to store the scheduleHandlerObject of each job and assign it to the key in the following format:

    ```
    jobs = [
      {"key" : scheduleHandlerObject},
      {"key1 : scheduleHandlerObject1}
    ];
    ```

    The `jobs` array would store all the created scheduleHandlerObjects so we can retrieve them and use them to make changes to the job as required.

    Suppose a user wants to fetch all the jobs created by them and decide which to delete. We can fetch all the job keys associated with the user from the database and send them to the user. Now user will select a job and we will receive its key id from the database. We can use that to find the scheduleHandlerObject from the jobs array and finally stop the job. Once we stop the job we can delete the key from the database and the jobs array.

    The issue we are left is persisting the jobs. When the server is stopped, or restarted, all the associated jobs stop.

2. Persiting the jobs

    To solve this issue we can create a startup function that retrieves the data from the database about the jobs, starts them using a scheduleHandlerObject and adds them to the `jobs` array. 
    
We would also need to limit the backup frequency to a per day basis since anything lower can cause scaling issues.
