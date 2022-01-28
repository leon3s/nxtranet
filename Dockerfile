FROM docker

USER root
WORKDIR /root

# For install mongodb
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories

# Install dependencies
RUN apk update
RUN apk add git bash curl sudo nginx openrc dnsmasq mongodb libc6-compat nodejs npm

# WORKDIR /tmp
# Install node v16.13
# RUN curl https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz -s -o _node.tar
# RUN tar -xf _node.tar
# WORKDIR /tmp/node-v16.13.0-linux-x64
# RUN cp -r ./bin ./include ./lib ./share /usr
# RUN rm /tmp/_node.tar
# RUN rm -r /tmp/node-v16.13.0-linux-x64

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
