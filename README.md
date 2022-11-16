# RubeGoldberg
A working application built in every way possible

## The Idea
Build a functional application using all sorts of tools and technologies.  Use it to learn new tech, practice my writing, and educate others.

## TODO

Build all the following, run in docker with COMPOSE:

* ~~DynamoDB~~
![image](https://user-images.githubusercontent.com/5083039/197421934-996e0c9a-b06d-4225-bf59-e9b6041a5f62.png)
* ExpressJS API server
  * Works running npm locally, aws config issues in docker compose
* React application
* Other containers
  * Rails API
  * .Net API
  * MongoDB
* Other front ends
  * VueJS

## Tips & Tricks

### There are a few "levels" at which you can run these things:

* Single npm start - just run it locally from your actual physical machine.  Usually not very exciting, as much of what's here depends on various services/containers interacting with each other
* Multiple npm/container start - this gets more interesting, as it allows services to interact.  A simple example is running expressJS and dynamoDB at the same time:
  * DynamoDB - run in a docker container with "docker run -p 8000:8000 amazon/dynamodb-local"
  * ExpressJS - run "npm start" within express-api folder.  Because this is OUTSIDE docker, it will serve to port 3000.
* Docker Compose - run the whole shebang from root with "docker compose up"
  * Because react is running WITHIN docker, it will serve to port 3001
  * Because express-api is running WITHIN docker, it will serve to port 3002

## Milestones
This project meanders along where it pleases, and rhyme and reason will be hard to find.  In a way, I'm embracing a Montessori philosophy, letting curiousity be my guide.  That being said, here's a rough list of timeline/milestone type things that seem worth mentioning:

### Reloadable Skeleton
As of [this commit](https://github.com/MartyIce/RubeGoldberg/commit/fd8f0a86671eff7c1237952d8c4239843f45360c), the project contains 3 dockerfiles, representing 3 platforms:
* DynamoDB - a potential backend repository
* ExpressJS - a potential REST API
* React - a potential front end

Additionally, by mounting volumes within the docker compose file, both the Express and React apps will dynamically reload when changes are made to the local (ie, non-docker) file system.  This means you can run it in docker, happily update source on your machine, and see the changes reloaded in realtime.

With these features in hand, a person can begin stretching their legs with the various techs, and get realtime feedback.  Let the games begin!