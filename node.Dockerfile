# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16-slim

RUN apt-get update && apt install -y git

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app/deployer
RUN mkdir -p /home/node/app/deployer/tmp
RUN mkdir -p /home/node/packages/headers

WORKDIR /home/node/packages
COPY --chown=node ./packages/headers headers

WORKDIR /home/node/packages/headers
RUN npm install
RUN npm run build

WORKDIR /home/node/app/deployer
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./
RUN npm install
# # Bundle app source code
COPY --chown=node ./docker_images/node-deployer .
RUN npm run build
# # Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000
ENV HOST=0.0.0.0 DP_SERVICE_PORT=1337

EXPOSE ${PORT}
EXPOSE ${DP_SERVICE_PORT}

CMD [ "node", "." ]
