# EulerMarks, a [Project Euler](http://projecteuler.net/) Benchmarking site#

## Install procedure ##

1. Install [nvm](https://github.com/creationix/nvm/)
1. Install latest version of node (check on [nodejs.org](http://nodejs.org))
1. Install and run [Mongodb](http://www.mongodb.org/) on standard port
1. Install node modules in base directory via ```npm install```
1. Create a new app on [github](https://github.com/settings/applications) and point url: ```http://localhost:4000/```, callbackurl: ```http://localhost:4000/api/auth/github``` (assuming you're using the default port 4000)
1. Copy config file ```config/default.js.sample``` to ```config/default.js``` and fill in the appropriate fields
1. Manually change ```web/js/router.js``` urlFragment for github client_id. Yes. Very hacky. Need to fix this.

## Makefile ##

- ```make run-app-dev``` to run the web app server locally with default port of 4000 (hostname of localhost:4000). Additionally, you can get pretty output via ```make -s run-dev | util/pretty.js```
- ```make run-benchmarker-dev``` to run the benchmarker server locally with default port of 5000 (hostname of localhost:5000). Additionally, you can get pretty output via ```make -s run-dev | util/pretty.js```
- ```make build``` to run require.js optimizer
- ```make run-app-prod``` to run the server locally using ```make build``` output
- ```make test``` to run unit tests
- ```make lint``` to run js linter

## High level framework documentation ##

The framework is built in layers. Layers can be asynchronous.

1. PreRoutes -- code for segments of the site based on route (think admin) (app/preRoutes)
1. Routes -- routes for a single resource only to transform parameters (app/routes/)
  - calls middleware for parameter checks (app/middleware)
1. Handlers -- handles insertion into history (app/handlers/)
  - returns data when read operations
  - writes minimal amount of data to log what happened in history for write operations (history/history)
1. Historian -- business logic of what tables to populate based on what has happened (historian/)
  - async
  - right now called right after a history element is inserted, but can be decoupled more

## Rebase workflow ##

For collaborators, I prefer [rebase workflow](http://randyfay.com/node/91) as opposed to merge workflow. I believe all pull requests are merge workflow so I don't know what to do about that yet. At this point I think all potential contributers are collaborators on the project.