#!/bin/bash


sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
sudo chown -R csye6225:csye6225 -R /opt/webapp/
# sudo mv ~/webapp /opt/webapp


