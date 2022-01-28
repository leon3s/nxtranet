FROM ubuntu:latest

USER root
WORKDIR /root

# Uncomment to set specific timezone
# ENV TZ=America/New_York
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies
RUN apt-get update
RUN apt-get install systemd -y
RUN apt-get install git -y
RUN apt-get install curl -y
RUN apt-get install sudo -y
RUN apt-get install nginx -y
RUN apt-get install dnsmasq -y
RUN apt-get install mongodb -y
RUN apt-get install docker -y

WORKDIR /tmp
# Install node v16.13
RUN curl https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz -s -o _node.tar
RUN tar -xf _node.tar
WORKDIR /tmp/node-v16.13.0-linux-x64
RUN cp -r ./bin ./include ./lib ./share /usr
RUN rm /tmp/_node.tar
RUN rm -r /tmp/node-v16.13.0-linux-x64

WORKDIR /etc
# Install nxtranet
RUN git clone https://github.com/leon3s/nxtranet
WORKDIR /etc/nxtranet/cli
RUN sudo npm install
RUN sudo npm run build
RUN sudo npm install -g .
RUN sudo nxtranet install
RUN sudo nxtranet run prod

EXPOSE 80
EXPOSE 54
