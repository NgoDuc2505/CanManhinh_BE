# Start by specifying the base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install all node modules
RUN npm install

# Bundle app source
COPY . .

# Build the project
RUN npm run build

# Your app binds to port 3000 so use the EXPOSE instruction
EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]