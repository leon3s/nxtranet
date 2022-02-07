[nxtranet]
cli to interact with nextranet

arguments:
  * install # Install nxtranet users and project dependencies
  * run
    - dev # Start the project in development mode (work only on windows)
    - prod # Start project in production mode
  * -s
    start # Start all services
    start {name} # start specific service
    restart  # restart all services
    restart {name} # restart specific service
    stop # Stop all services
    stop {name} # Stop specific service

