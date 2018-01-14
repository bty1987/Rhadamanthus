#!/bin/bash
#this is mysql mysqlfullbak scripts

user=root
passwd=mysql8BCNG32!
databak_dir=/home/fanglin/backup/db
logFile=$databak_dir/logs/mysql$DATE.log

DATE=`date +%Y%m%d`

database=platform

echo "---------------------------------" >> $logFile
echo $(date +"%y-%m-%d %H:%M:%S") >> $logFile

cd $databak_dir

dumpFile=$database$DATE.sql
GZDumpFile=$database$DATE.tar.gz

options="-u$user -p$passwd --opt --triggers=false -R --hex-blob --flush-logs --delete-master-logs -B $database"

mysqldump $options > $dumpFile

if [[ $? == 0 ]]; then

  tar cvzf $GZDumpFile $dumpFile >> $logFile 2>&1
  echo "BackupFileName:$GZDumpFile" >> $logFile
  echo "DataBase Backup Success" >> $logFile

  rm -f $dumpFile

else

  echo "DataBase Backup Fail!" >> $logFile

fi

echo "--------------------------------------------------------" >> $logFile
