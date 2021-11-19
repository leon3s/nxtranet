#!/bin/bash
echo "======================"
echo "====== NXTRANET ======"
echo "======================"

## NEED TO BE ROOT
## It will install packages like node nginx dnsmasq and create users to manage them.
if [ "$EUID" -ne 0 ]
then
  echo "nxtranet install script must be run as root."
  exit 1
fi

## FUNCTIONS
function print_red() {
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  printf "${RED}$1${NC}"
}

function print_green() {
  RED='\033[0;32m'
  NC='\033[0m' # No Color
  printf "${RED}$1${NC}"
}

function print_pass() {
  echo -n "["
  print_green "pass"
  echo "]"
}

function print_fail() {
  echo -n "["
  print_red "fail"
  echo "]"
}

## END FUNTIONS

## START PACKAGES VERIFICATION
echo "# Verifying system packages"

echo -n "  - node "
if ! [ -x "$(command -v node)" ]
then
  echo -n " installing "
  curl https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz _node.tar -s -o ./_node.tar > /dev/null
  tar -xf _node.tar
  cp -r ./node-v16.13.0-linux-x64/bin /usr
  cp -r ./node-v16.13.0-linux-x64/include /usr
  cp -r ./node-v16.13.0-linux-x64/lib /usr
  cp -r ./node-v16.13.0-linux-x64/share /usr
  rm -r node-v16.13.0-linux-x64
  rm _node.tar
  print_pass
else
  echo -n "installed "
  print_pass
fi

echo -n "  - nginx "
if ! [ -x "$(command -v nginx)" ]; then
  echo -n "installing "
  apt-get install nginx nginx-extras -y > /dev/null
  print_pass
else
  echo -n "installed "
  print_pass
fi

echo -n "  - dnsmasq "
if ! [ -x "$(command -v dnsmasq)" ]; then
  echo -n "installing "
  apt-get install dnsmasq -y > /dev/null
  print_pass
else
  echo -n "installed "
  print_pass
fi
## END PACKAGE VERIFICATION

## START USERS VERIFICATION
