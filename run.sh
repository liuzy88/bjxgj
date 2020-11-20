#!/bin/sh
# crontab -l
# 56 5 * * * /root/bjxgj/run.sh 1 >> /root/1.log
# 58 5 * * * /root/bjxgj/run.sh 2 >> /root/2.log

cd `dirname $0`
node app.js $1
