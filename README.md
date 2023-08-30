### Test 1

##### Quickstart
The source code is located in `app.js` file. Node 18 was used, but any version above 10/12 should be able to run this
* checkout the repo locally
* Navigate to the tech-test directory: `cd tech-test`
* Install dependencies: `npm install`
* Run the application: `node app.js`
* Enjoy your personnal therapist :)

##### Used dependencies
* `@xenova/transformers` as asked for the NLP, see https://huggingface.co/docs/transformers.js/index#quick-tour
* `prompt-sync` to prompt for user input
* `lodash` to round the answer (lodash is always helpful anyways)

##### Possible improvements
* containerizing the app

### Test 2

Considering this function was added in the PR, I would suggest to:
* ask ourselves if the public visibility is the most suited for the job
* remove `$country` if not used?
* setting up application key as env variable
* focus on error handling
    * either in get or in post request you should be able to see in the logs that something's gone bad with a service unavailable for example
    * `'true' ` is always returned, so no there is no mechanism that could warn or call a fallback mechanism (retry?)
* ask ourselves why extracting `$this->message` into `$message` before calling when `$this->target` is provided as argument for the call
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

> One the interesting elements of this alert is the time: A lot of batches are triggered during night, so it may be a running batch that consumes CPU during its execution time that may cool down in a few minutes

*The test question mentions that CPU on prod has been at an average of 95% in the last 3 hours, so I will base my assumptions on this statement*

1. we can check what is (or should be) running on this VM (check inventory, or connect to it and check the running services/containers). Is it a batch service? Some API? Other?
1. `htop` on the machine to identify ressource-consuming processes
1. Check logs of the app

Resolution may vary depending on the root cause. This may involve rollback, moving services to another VM, increasing the threshold of the alert or add temporary/permanent CPU when something changed internally to checking cloudflare/enabling attack mode, blacklisting ips if this alert concerns a dmz machine for example.