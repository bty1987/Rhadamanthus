#!/bin/bash
# group1整盘迁移: staging(cpio硬链接) + ossutil增量上传
set -u
W=/home/ossmig
cd /home/fastdfs/storage/data || exit 1
echo "$(date '+%F %T') cpio start: $(wc -l < $W/group1_full_disk.txt) files"
/bin/cpio -pdlm $W/stage2 < $W/group1_full_disk.txt
echo "$(date '+%F %T') cpio done, launching ossutil"
/home/ossutil64 cp -r -u -f -j48 $W/stage2/ oss://fl-prod-erp/group1/M00/ -c /home/.ossutilconfig > $W/ossutil_full.log 2>&1
echo "$(date '+%F %T') ossutil done: $(tail -1 $W/ossutil_full.log | grep -oa 'Dealed num[^,]*' | head -1)"
