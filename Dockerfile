# Node.js version
FROM node:latest

# install nodemon
RUN npm install -g nodemon

RUN npm install -g gulp

RUN npm install -g bower

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# get the npm modules that need to be installed
COPY package.json /usr/src/app/

# install npm modules
RUN npm install

# get the bower modules that need to be installed
COPY bower.json /usr/src/app/

RUN bower install --allow-root

# copy the source files from host to container
COPY . /usr/src/app
