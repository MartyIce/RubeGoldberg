# RubeGoldberg
A working application built in every way possible

## The Idea
Build a functional application using all sorts of tools and technologies.  Use it to learn new tech, practice my writing, and educate others.

## TODO

Build all the following, run in docker with COMPOSE:

* ~~DynamoDB~~
![image](https://user-images.githubusercontent.com/5083039/197421934-996e0c9a-b06d-4225-bf59-e9b6041a5f62.png)
* ExpressJS API server
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
* Multiple containers - TODO
* Docker Compose - run the whole shebang from root with "docker compose up"
  * Because express-api is running WITHIN docker, it will serve to port 3002

### Where are my changes?

If you make changes to any of the actual code, don't forget to rebuild your images...

* docker compose up - rebuild the whole thing.  Takes a while