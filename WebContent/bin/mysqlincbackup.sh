#!/bin/bash

user=root
passwd=mysql8BCNG32!
databak_dir=/home/fanglin/backup/db
logFile=$databak_dir/logs/mysql$DATE.log

DATE=`date +%Y%m%d`

database=platform-inco

startTime=$(date "-d 1 day ago" +"%Y-%m-%d %H:%M:%S")

echo "---------------------------------" >> $logFile
echo $(date +"%y-%m-%d %H:%M:%S") >> $logFile

cd $databak_dir

dumpFile=$database$DATE.sql
GZDumpFile=$database$DATE.tar.gz

options="-u$user -p$passwd --opt --triggers=false -R --hex-blob --flush-logs --delete-master-logs -B $database"

filename=`cat /home/mysql/mysql-bin.index |awk -F "/" '{print $2}'`

for i in $filename
do
	mysqlbinlog -u$user -p$passwd -d $database --start-datetime="$startTime" /home/mysql/$i >> $dumpFile
done

if [[ $? == 0 ]]; then

  tar cvzf $GZDumpFile $dumpFile >> $logFile 2>&1
  echo "BackupFileName:$GZDumpFile" >> $logFile
  echo "DataBase IncBackup Success" >> $logFile

  rm -f $dumpFile

else

  echo "DataBase IncBackup Fail!" >> $logFile

fi
