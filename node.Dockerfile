# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16-slim

# Install latest updates
RUN apt-get update && apt install -y git
RUN npm install -g npm@latest

# Set to a non-root built-in user `node`
USER node

# Create app and packages directory (with user `node`)
RUN mkdir -p /home/node/app
RUN mkdir -p /home/node/packages

# Copy packages/headers source code
WORKDIR /home/node/packages
COPY --chown=node ./packages/headers headers

# Bundle packages/headers
WORKDIR /home/node/packages/headers
RUN npm install
RUN npm run build

# Copy app source code
WORKDIR /home/node/app
COPY --chown=node ./docker_images/node-deployer ./deployer

# Bundle app source code
WORKDIR /home/node/app/deployer
RUN mkdir -p /home/node/app/deployer/tmp
RUN npm install
RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000
ENV HOST=0.0.0.0 DP_SERVICE_PORT=1337
EXPOSE ${PORT}
EXPOSE ${DP_SERVICE_PORT}

# Start deployer
CMD [ "npm", "start" ]
