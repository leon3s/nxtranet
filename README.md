# NXTRANET

Unlock all control of your network using nxtranet

Setup and configure personal vpn dns and automaticaly test, deploy and scale your nodejs projects.

## State

Currently in alpha release, production release will appear as soon as authentication and loggin is fully setup and tested.

## Compatibility

List of system compatible
- Ubuntu 20.04

## Installation

```sh
git clone https://github.com/leon3s/nxtranet
cd nxtranet
sudo bash ubuntu.install.bash
```

## Project structure

/cli # Cli used as internal dev tools

/packages     # Shared packages between projects cli and services
  - /apiclient  # A basic client for api calls
  - /headers    # Shared types for all projects
  - /node       # Nodejs library
  - /service    # Default service helpers

/docker_images
  - /node-deployer # Optimised docker image to deploy node application.

/services
  - /dashboard   # Front end dashboard for configuration
  - /api         # Backend api
  - /docker      # Service to manage docker
  - /nginx       # Service to manage nginx
  - /proxies     # Service to manage nxtranet proxies used for deployment
  - /system      # Service to get system information such as disk space
