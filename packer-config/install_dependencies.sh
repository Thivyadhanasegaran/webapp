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
unzip webapp.zip -d /opt

cd /opt/webapp/
sudo npm install
cd ..