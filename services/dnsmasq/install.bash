sudo chown nxtsrv-dnsmasq /etc/dnsmasq.conf
sudo chown -R nxtsrv-dnsmasq /etc/dnsmasq.d

if [ ! -d /run/dnsmasq ]; then
    sudo mkdir /run/dnsmasq;
fi

sudo chown nxtsrv-dnsmasq /run/dnsmasq
