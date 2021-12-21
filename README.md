# NXTRANET

Unlock all control of your network using nxtranet

Setup and configure personal vpn dns and automaticaly deploy and test your nodejs project.

## State

Currently in development a production release will appear starting 2022.

## Compatibility

List of system compatible
- Ubuntu 20.04

## Project structure

/cli
  - Cli used as internal dev tools

/packages
  - Shared packages between projects cli and services

/projects
  - dashboard   # Front end dashboard for configuration
  - api         # Backend api

/services
  - docker      # Service to manage docker
  - nginx       # Service to manage nginx
  - subdomain   # Service to manage nxtranet subdomain used for deployment

