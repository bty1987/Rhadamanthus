#!/bin/bash
# switch.sh [low|full|auto] — group1迁移上传模式切换器
# low = -j 4 低并发(白天,出口占用~16Mbps) / full = 满速(夜间) / auto = 按时段自选(8-23点low,其余full)
# 已是目标模式则不打扰; 迁移100%后不再启动; cron每小时auto兜底自愈
W=/home/ossmig
CFG=/home/.ossutilconfig
LOG=$W/ossutil_full.log
mode=${1:-auto}
TS=$(date '+%F %T')

# 完成守卫: 日志尾部出现100%或成功汇总则永不再启动
if tail -c 3000 $LOG 2>/dev/null | grep -qa 'Progress: 100.000%\|succeed count\|succeed total'; then
  echo "$TS complete-guard: migration 100%, skip" >> $W/switch.log
  exit 0
fi

if [ "$mode" = "auto" ]; then
  h=$(date +%H | sed 's/^0//')
  if [ "$h" -ge 8 ] && [ "$h" -lt 23 ]; then mode=low; else mode=full; fi
fi

CUR=$(ps -ef | grep 'ossutil64 cp -r' | grep -v grep | head -1)
if [ -n "$CUR" ]; then
  case "$CUR" in
    *'-j 2'*) curmode=low ;;
    *) curmode=full ;;
  esac
  if [ "$curmode" = "$mode" ]; then
    exit 0  # 已在目标模式,不动
  fi
fi

for p in $(ps -ef | grep 'ossutil64 cp -r' | grep -v grep | awk '{print $2}'); do
  kill -9 $p 2>/dev/null
done
sleep 2
cd $W || exit 1

if [ "$mode" = "full" ]; then
  nohup /home/ossutil64 cp -r -u $W/stage3/ oss://fl-prod-erp/group1/M00/ -c $CFG >> $LOG 2>&1 &
  echo "$TS switched to FULL (night window)" >> $W/switch.log
else
  nohup /home/ossutil64 cp -r -u -j 2 $W/stage3/ oss://fl-prod-erp/group1/M00/ -c $CFG >> $LOG 2>&1 &
  echo "$TS switched to LOW -j 4 (daytime)" >> $W/switch.log
fi
