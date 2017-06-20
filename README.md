# react-app

## Goals:

Develop a Retrospective Tool to facilitate Sprint and Product Retrospectives with Product Teams, utilizing React, Flux, Node, Mongo as our architecture

## Setup Dockerized Environment

Docker ensures everyone is running the same environment.

### Stages of a Retrospective

1. setup
2. join
3. share
4. group
5. vote
5. archive

### Project setup:

1. make sure Docker is installed: https://docs.docker.com/docker-for-mac/install/
2. run `docker-compose up`
3. profit!

### To install new node_modules:

1. ssh into the container by `sh scripts/terminal.sh`
2. `npm install {module} --save`
3. `exit`
4. `docker-compose down`
5. `docker-compose up --build`

### Connect to the MongoDB container:

The docker mongo container forwards its port to the host machine (yours), so you can connect to it via localhost:27017,
as if it existed on your machine to begin with.

### Shameless plug

For a tutorial on Docker: https://github.com/shaunpersad/docker-tutorial
## Notes:

## Deploy Instructions:

* Run command `git push heroku master`

## Links:

* Research:
* Drag-and-Drop: https://gaearon.github.io/react-dnd/docs-tutorial.html | file:///Users/DomTancredi/Projects/labs/retro-app/_assets/DragDropInteractions/index.html
* React Starter Kit: https://github.com/kriasoft/react-starter-kit/
* Bootstrap: https://getbootstrap.com/components/#navbar
* Flexbox: https://davidwalsh.name/flexbox-layouts
* Windows: https://github.com/yongxu/react-DnR
* Components: https://github.com/brillout/awesome-react-components
* Sockets: http://www.tamas.io/advanced-chat-using-node-js-and-socket-io-episode-1/

* Tutorial: https://egghead.io/lessons/react-react-in-7-minutes
* Reading: https://facebook.github.io/react/docs/thinking-in-react.html
* Flux Architecture Diagram: https://facebook.github.io/react/docs/thinking-in-react.html
* Alt (Flux implementation) Guide: http://alt.js.org/guide/
* Tutorial: http://sahatyalkabov.com/create-a-character-voting-app-using-react-nodejs-mongodb-and-socketio/#overview
* React: https://www.toptal.com/react/navigating-the-react-ecosystem
* API Routing Q: http://stackoverflow.com/questions/27712768/how-to-modularize-routing-with-node-js-express
* Heroku App: https://dashboard.heroku.com/apps/retro-app

# Socket Research:
* Socket Documentation: https://socket.io/docs/rooms-and-namespaces/
* https://github.com/tpiros/advanced-chat
* https://modernweb.com/building-multiplayer-games-with-node-js-and-socket-io/
* Sockets + React: https://github.com/raineroviir/react-redux-socketio-chat/blob/master/src/common/containers/ChatContainer.js

## Errors

A. If you ever get a error when it talks about no space remaining, try running these three lines of code

```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker volume rm `docker volume ls -q -f dangling=true`
```

B. For some instances when you try to go to http://localhost:3000/, you may encountered this error when pulling a fresh copy of updated files from develop branch without updating your node and browserify version on your local development:

```
Uncaught TypeError: Buffer.alloc is not a function
    at Object.220.cipher-base (legacy.js:7)
    at s (_prelude.js:1)
    at _prelude.js:1
    at Object.219../legacy (browser.js:3)
    at s (_prelude.js:1)
    at _prelude.js:1
    at Object.221.browserify-cipher (index.js:5)
    at s (_prelude.js:1)
    at _prelude.js:1
    at Store.RetrospectiveCreateStore (RetrospectiveCreateStore.js:6)


```

Possible solution: You may need to to update your browserify version (browserify 13.0.1) and make sure your node and npm version from the engine should be the same as your local node and npm version in your package.json. For reference: https://github.com/jspm/nodelibs-crypto/issues/3

## Socket Notes (v0.5.0)

These notes cover the events that may occur within the socket listen/broadcast cycle:

```
list of events to listen / broadcast:
stage 1 (overall)
1.1 user connects (new user online)
assign a socketid
increase count of onlineRetrospectives
1.2 user disconnects
user leaves a "retrospective"
1.3 retro-owner-user changes stage
stages: create draft -> start -> individual -> grouping/sorting -> voting -> archived

stage 2
2. user creates a retro
create a new "room"

stage 3
3. user joins a retro (with username)
user joins a "room"

stage 4 ~ Enter Thoughts: user individual creating thoughts
(may not need to broadcast) because all PUT events to retro
so no individual user needs to know anything about other user behavior
"blind-shared collaboration"

stage 5 ~ Sorting: retro-owner grouping/sorting thoughts; users exploring thoughts (updates)
5.1 retro-owner-user rearranges a thought order
5.2 retro-owner-user groups a thought (including typing group name)
5.# retro-owner-user defines voting amount

stage 6 ~ Voting: users vote on thoughts
6.1 user votes on thought
  broadcast: userId / thoughtId / vote (+/-)
  possibly broadcast: #ofvotesleft ~ could be quantified but may be best to include

stage 7 ~ Summary
no major events needed here, just display latest retro results
```
