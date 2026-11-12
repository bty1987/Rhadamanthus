#!/bin/bash
# migrate_group.sh — FastDFS本地读盘直传OSS(group试点worker)
# 用法: nohup bash migrate_group.sh <groupN> >> /home/ossmig/mig.log 2>&1 &
# 断点续传: 重复执行即续(g1_done.txt记已完成; ossutil -u 对已传对象跳过)
set -u
export LC_ALL=C

GROUP=${1:?usage: migrate_group.sh <groupN>}
D=/home/fastdfs/storage/data
W=/home/ossmig
DBLIST=$W/${GROUP}_dblist.txt
AKCFG=/home/.ossutilconfig

cd $W || exit 1
log() { echo "$(date '+%F %T') [${GROUP}] $*"; }

# 1. 磁盘清单(相对data目录), 一次生成
if [ ! -s $W/${GROUP}_disk.txt ]; then
  log "building disk inventory..."
  find $D -type f | sed "s|^$D/||" | sort > $W/${GROUP}_disk.txt
  log "disk files: $(wc -l < $W/${GROUP}_disk.txt)"
fi

# 2. 上传任务 = DB清单 ∩ 磁盘存在
cut -f1 $DBLIST | sort -u > $W/${GROUP}_db_paths.txt
comm -12 $W/${GROUP}_db_paths.txt $W/${GROUP}_disk.txt > $W/${GROUP}_upload.txt
log "upload tasks: $(wc -l < $W/${GROUP}_upload.txt) (db=$(wc -l < $W/${GROUP}_db_paths.txt) disk=$(wc -l < $W/${GROUP}_disk.txt))"

# 3. 扣除已完成(续传)
touch $W/${GROUP}_done.txt
sort -u $W/${GROUP}_done.txt > $W/${GROUP}_done_s.txt
comm -23 $W/${GROUP}_upload.txt $W/${GROUP}_done_s.txt > $W/${GROUP}_remaining.txt
log "remaining: $(wc -l < $W/${GROUP}_remaining.txt)"

# 4. 并行上传(32并发, ossutil -u 已传同尺寸跳过)
run_one() {
  rel="$1"
  if /home/ossutil64 cp -u -f -c /home/.ossutilconfig "$D/$rel" "oss://fl-prod-erp/${GROUP}/M00/$rel" >/dev/null 2>>$W/${GROUP}_err.log; then
    echo "$rel" >> $W/${GROUP}_done.txt
  else
    echo "$rel" >> $W/${GROUP}_fail.list
  fi
}
export -f run_one
export D W GROUP

xargs -P 32 -n1 -I{} bash -c 'run_one "$@"' _ {} < $W/${GROUP}_remaining.txt

log "DONE done=$(wc -l < $W/${GROUP}_done.txt) fail=$(wc -l < $W/${GROUP}_fail.list 2>/dev/null || echo 0)"
