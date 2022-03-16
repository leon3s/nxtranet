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
RUN apt-get install bash -y

RUN apt-get install nginx nginx-extras -y
RUN apt-get install dnsmasq -y
RUN apt-get install mongodb -y
RUN sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
RUN sudo apt-get update -y
RUN sudo apt-get install docker-ce -y

RUN useradd -m nxtranet
RUN usermod -aG sudo nxtranet
RUN echo "%nxtranet   ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers.d/nxtranet_admin

USER nxtranet

WORKDIR /tmp
# Install node v16.13
RUN curl https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz -s -o _node.tar
RUN tar -xf _node.tar
WORKDIR /tmp/node-v16.13.0-linux-x64
RUN sudo cp -r ./bin ./include ./lib ./share /usr
RUN rm /tmp/_node.tar
RUN rm -r /tmp/node-v16.13.0-linux-x64

RUN sudo npm install -g npm@latest

# Install nxtranet
WORKDIR /home/nxtranet
RUN git clone https://github.com/leon3s/nxtranet nxtranet
WORKDIR /home/nxtranet/nxtranet/cli
RUN npm install
RUN npm run build
RUN sudo npm install -g .
RUN sudo nxtranet install
RUN sudo cp ../config/sudoers/docker-sudoers /etc/sudoers
RUN sudo cp ../config/sudoers/nxtsrv /etc/sudoers.d/nxtsrv
RUN sudo cp ../config/dnsmasq/dnsmasq.docker.conf /etc/dnsmasq.conf
RUN sudo service nginx start
RUN sudo service mongodb start
RUN sudo service dnsmasq start
RUN sudo apt-get install docker -y
RUN sudo cat /etc/os-release
RUN sudo service docker start
RUN sudo nxtranet test

EXPOSE 80/tcp
EXPOSE 53/udp
