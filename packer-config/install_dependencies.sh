#!/bin/bash


#Install MySQL
sudo rpm -Uvh mysql80-community-release-el8-1.noarch.rpm
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

#Create database and user
sudo mysql -u root -e "CREATE DATABASE api_db;"
sudo mysql -u root -e "CREATE USER 'user'@'localhost' IDENTIFIED BY 'Blueblack@12345';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON api_db.* TO 'user'@'localhost';"


#Install node dependencies
sudo dnf module list nodejs
sudo dnf module enable -y nodejs:20
sudo dnf install -y npm

sudo yum install zip unzip -y

# unzip webapp.zip -d /opt
# sudo chmod -R 755 /opt/webapp


unzip webapp.zip -d /opt/webapp
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp



# sudo groupadd csye6225
# sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
# sudo chown -R csye6225:csye6225 -R /opt/webapp/
# sudo chmod -R 755 /opt/webapp

# sudo chmod +x server.js





cd /opt/webapp/
sudo npm install
