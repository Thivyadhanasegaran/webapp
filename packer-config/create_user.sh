#!/bin/bash
sudo yum install zip unzip -y
sudo mkdir -p /opt/csye6225/
sudo mv /tmp/webapp.zip /opt/csye6225/

cd /opt/csye6225 || exit
ls -al

sudo unzip webapp.zip

cd /opt/csye6225

ls -al
sudo rm webapp.zip
sudo groupadd -f csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225

sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 775 /opt/csye6225 



