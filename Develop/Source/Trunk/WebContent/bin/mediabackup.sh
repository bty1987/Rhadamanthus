#!/bin/bash

databak_dir=/home/fanglin/backup/media
logFile=$databak_dir/logs/media$DATE.log

DATE=`date +%Y%m%d`

echo "---------------------------------" >> $logFile
echo $(date +"%y-%m-%d %H:%M:%S") >> $logFile

cd $databak_dir

imageFile=/home/fanglin/ROOT/upload/Imag/`date +%Y`/`date +%m`/`date +%d`/
otherFile=/home/fanglin/ROOT/upload/Other/`date +%Y`/`date +%m`/`date +%d`/
GZDumpFile=media$DATE.tar.gz

echo $imageFile
echo $otherFile
echo $GZDumpFile

tar cvzf $GZDumpFile $imageFile $otherFile >> $logFile 2>&1
echo "BackupFileName:$GZDumpFile" >> $logFile
echo "Media Backup Success" >> $logFile

echo "--------------------------------------------------------" >> $logFile
