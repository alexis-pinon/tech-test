### Test 1
@todo


### Test 2


Based on the changes, I would suggest to:
* remove `$country` if not used?
* setting up application key as env variable
* being careful with calling other apps
    * either in get or in post request you should be able to see in the logs that something's gone bad with a service unavailable for example
    * `'true' ` is always returned, so no there is no mechanism that could warn or call a fallback mechanism (retry?)
* ask ourselves why extracting `$this->message` into `$message` before calling when `$this->target` is provided as argument for the call

About the lines that were not changed, I would suggest:
* renaming the method in a more descriptive way
* refactoring the calling of the SMS service api in a singleton wrapper that could expose a method to send messages with message & target args in the method & all other parameters in the constructor



### Test 3

The error means that either :
    * we exceeded the max number of attemps to run the ExportFeedbacks job
    * the job timed out

If the job previously timed out, we would already have received this alert, so we can check this history of the sentry notifications.

We can assume that this job is a batch that exports data, so it may have a datasource and a target.

We first have to determine whether we are experiencing too many attempts or a timeout.
1. First, we could check the audit of the jobs and see how many times it was triggered recently and execution time. Is the job failing in 1sec or after several minutes/hours of running?
1. Then we could check the logs of the job to see if any error was thrown and determine if the error comes from inside the job (maybe some recent piece of code that has gone bad), or from outside (service, server, db,...not available for example).
1. (If we did not succeed in finding the problem, we can try using profiling tools)

Resolving the issue will depend a lot on the source of this issue, this may be
* rollback/hotfix the app or configuration
* check if internal ressources are behaving right, act if not
* contact clients to warn them about unavailability of some of their services


### Test 4

The error means that one of the production AWS virtual machines used more than 80% of its CPU (83%). NB : This alert occured at 00:12:00

> One the interesting elements of this alert is the time: A lot of batches are triggered during night, so it may be a running batch that consumes CPU during its execution time.

*The test question mentions that CPU on prod has been at an average of 95% in the last 3 hours, so I will base my assumptions on this statement*

1. we can check what is or should be running on this VM (check inventory, or connect to it and check the running services/containers). Is it a batch service? Some API? Other?
1. `htop` on the machine to get the ressource consuming processes
1. Check logs, infinite loops, @todo