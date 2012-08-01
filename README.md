# EulerMarks, a [Project Euler](http://projecteuler.net/) Benchmarking site#

## Install procedure ##

1. Install [nvm](https://github.com/creationix/nvm/)
1. Install latest version of node (check on [nodejs.org](http://nodejs.org))
1. Install and run [Mongodb](http://www.mongodb.org/) on standard port

## Makefile ##

- ```make run-dev``` to run the server locally with default port of 4000 (hostname of localhost:4000). Additionally, you can get pretty output via ```make -s run-dev | util/pretty.js```
- ```make build``` to run require.js optimizer
- ```make run-prod``` to run the server locally using ```make build``` output
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