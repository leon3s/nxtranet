FROM docker

USER root
WORKDIR /root

# Install dependencies
RUN apk update
RUN apk add git bash sudo nginx dnsmasq mongodb

# Install node v16.13
RUN curl https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz _node.tar -s -o ./_node.tar > /dev/null
RUN tar -xf _node.tar
WORKDIR /root/node-v16.13.0-linux-x64
RUN cp -r ./bin ./include ./lib ./share /usr
RUN rm /root/_node.tar
RUN rm -r /root/node-v16.13.0-linux-x64

# Install nxtranet
RUN cp -r ./nxtranet /etc/nxtranet
WORKDIR /etc/nxtranet

RUN sudo npm install -g ./cli
RUN sudo nxtranet install
RUN sudo nxtranet run prod

EXPOSE 80
EXPOSE 54
