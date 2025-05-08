#!/bin/bash
scp backend/target/file-manager-*.jar root@192.168.1.100:/root/
scp frontend/dist/file-manager/browser/* root@192.168.1.100:/var/www/file-manager-250/
