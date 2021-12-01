#!/bin/bash

echo "NGINX IPTABLE CONFIG"

echo "REDIRECTING 80 port to 8080 port"

iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports 8080