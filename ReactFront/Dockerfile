# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app
COPY . /app

#COPY package.json /app/package.json

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
#RUN npm install --silent --verbose
#RUN npm install react-scripts@3.0.1 -g --silent --verbose



# start app
CMD ["npm", "start"]

