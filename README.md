# NXTRANET

Unlock all control of your network using nxtranet

Setup and configure personal vpn dns and automaticaly test, deploy and scale your nodejs projects.

## State

Currently in alpha release, production release will appear as soon as authentication and loggin is fully setup and tested.

## Compatibility

List of system compatible
- Ubuntu 20.04

## Installation

- Required dependencies
```sh
sudo apt install -y nginx nginx-extras dnsmasq docker-compose mongodb # For ubuntu
```
- Setup project
```sh
git clone https://github.com/leon3s/nxtranet
cd nxtranet
bash node_install.bash # If you don't have nodejs 16.x installed
# Install cli
cd ./cli && npm install && npm run build
sudo npm install -g .
# Install project dependencies and config files
sudo nxtranet install
# Set services executable perms
sudo mv ../config/sudoers/nxtsrv /etc/sudoers.d
sudo chown root:root /etc/sudoers.d/nxtsrv
```

## Configuration
- there is an example of configuration you can find in /etc/nxtranet/nxtranet.conf
```
nxtranet {
  host 127.0.0.1; # On which host the domain name will be bind in nginx to access it.
  domain nxtra.net; # The domain name you want
}

docker {
  host 172.17.0.1; # On which host docker will bind containers
}
```
- Once you edited the file considere running
```sh
sudo nxtranet configure # Update generated file with the new configuration
```
- Note if you had a running instance of nxtranet considere restarting it.

## Stop
```sh
sudo nxtranet stop # Will stop nxtranet and all his services
```

## Start
```sh
sudo nxtranet run dev # Will run nxtranet in development mode
sudo nxtranet run prod # Will run nxtranet in production mode
```

## Project structure

/cli # Cli used as internal dev tools

/packages # Shared packages between projects cli and services
  - /apiclient  # A basic client for api calls
  - /headers    # Shared types for all projects
  - /node       # Nodejs library
  - /service    # Default service helpers

/docker_images # Docker images
  - /node-deployer # Optimised docker image to deploy node application.

/internal
  - /docker      # Service to manage docker
  - /nginx       # Service to manage nginx
  - /dnsmasq     # Service to manage dnsmasq
  - /system      # Service to get system information such as disk space

/exposed
  - /dashboard   # Front end dashboard for configuration
  - /api         # Backend api
