# docker build . -t express-api
# docker run --rm -p 3002:3000 express-api npm run dev:watch

# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
ADD package.json ./
ADD package-lock.json ./
RUN npm install --silent

# add app
#ADD . ./