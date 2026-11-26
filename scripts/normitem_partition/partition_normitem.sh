#!/bin/bash
# ============================================================================
# partition_normitem.sh — normitem 三表 RANGE 分区半夜定时执行
# ============================================================================
# 用途: quotation.normtimeitem(试点) / normooditem / normriceitem 按 qid RANGE
#   分区(每 10 万 qid 一段 + MAXVALUE 兜底), 方案=sqls/quotation/41 号。
# 执行顺序: time(秒级试点) → 验证 → ood(小时级) → rice(小时级), 逐步日志失败即停。
# 调度: crontab 02:00 每日触发, 脚本自带幂等守卫(已分区的表跳过, 全部完成后秒退),
#   失败次日自动断点重试。
# 配置: 下方 DB_* 四项填生产主库连接信息(应用 jdbc.properties 同源账号需 DDL 权限)。
# 风险: ALTER 全表复制重建, 执行期间该表写入被元数据锁阻塞 —— 仅限半夜低峰;
#   rice/ood 各预计小时级, 从 02:00 起跑窗口充足; 单表失败不影响已完成表。
# 回滚: ALTER TABLE <t> REMOVE PARTITIONING (重建回单表); RDS 快照为最终底牌。
# ============================================================================

set -u

DB_HOST="${DB_HOST:-请填生产主库地址}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-请填DDL账号}"
DB_PASS="${DB_PASS:-请填密码}"
DB_NAME="quotation"

LOG_DIR="$(cd "$(dirname "$0")" && pwd)/logs"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/partition_$(date +%Y%m%d).log"

log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }

command -v mysql >/dev/null 2>&1 || { log "FATAL: mysql client 不存在, 请先安装"; exit 1; }

MYSQL="mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASS} ${DB_NAME} --default-character-set=utf8"

# 查询走静默(-N -s), 密码经命令行有 ps 泄露窗口, 半夜窗口可接受; 更严可用 --defaults-extra-file
q() { $MYSQL -N -s -e "$1" 2>/dev/null; }
x() { $MYSQL -e "$1" >> "$LOG" 2>&1; }

# ---------- 幂等守卫: 表是否已 RANGE 分区 ----------
is_partitioned() {
    local cnt
    cnt=$(q "SELECT COUNT(*) FROM information_schema.partitions
             WHERE table_schema='${DB_NAME}' AND table_name='${1}'
               AND partition_name IS NOT NULL")
    [ "${cnt:-0}" -gt 0 ]
}

# ---------- 守卫: 41 号前置核对(qid 域未大幅漂移, 防边界失配) ----------
for t in normriceitem normooditem; do
    maxqid=$(q "SELECT COALESCE(MAX(qid),0) FROM ${t}")
    if [ "${maxqid:-0}" -ge 1000000 ]; then
        log "FATAL: ${t}.max(qid)=${maxqid} 已越 100 万, pmax 兜底段将承接存量+增量, \
请先按 41 号段5 模板扩段边界后重试"
        exit 1
    fi
done

# ---------- 分区定义(41 号同款) ----------
PARTITIONS_DEF="( \
PARTITION p00 VALUES LESS THAN (100000), \
PARTITION p01 VALUES LESS THAN (200000), \
PARTITION p02 VALUES LESS THAN (300000), \
PARTITION p03 VALUES LESS THAN (400000), \
PARTITION p04 VALUES LESS THAN (500000), \
PARTITION p05 VALUES LESS THAN (600000), \
PARTITION p06 VALUES LESS THAN (700000), \
PARTITION p07 VALUES LESS THAN (800000), \
PARTITION p08 VALUES LESS THAN (900000), \
PARTITION p09 VALUES LESS THAN (1000000), \
PARTITION pmax VALUES LESS THAN MAXVALUE)"

alter_table() {
    local table="$1" pkcol="$2"
    log "START alter ${table} (联合主键 + RANGE(qid) 11 分区) ..."
    # 🔴 test 实证: PARTITION BY 不能与其它 ALTER 子句组合(1064), 必须两段式(两次重建)
    if x "ALTER TABLE ${table} DROP PRIMARY KEY, ADD PRIMARY KEY (${pkcol}, qid)" &&        x "ALTER TABLE ${table} PARTITION BY RANGE (qid) ${PARTITIONS_DEF}"; then
        log "DONE alter ${table}"
        return 0
    else
        log "FAIL alter ${table} — 详情见上方 mysql 输出, 次日定时将断点重试"
        return 1
    fi
}

verify_table() {
    local table="$1" pkcol="$2"
    local parts rows
    parts=$(q "SELECT COUNT(*) FROM information_schema.partitions
               WHERE table_schema='${DB_NAME}' AND table_name='${table}' AND partition_name IS NOT NULL")
    rows=$(q "SELECT COUNT(*) FROM ${table}")
    log "VERIFY ${table}: partitions=${parts} (expect 11), rows=${rows}"
    [ "${parts:-0}" -eq 11 ]
}

# ================= 主流程 =================
log "=== partition_normitem run start (pid=$$) ==="

# ① time 试点(1667 行秒级)
if is_partitioned normtimeitem; then
    log "SKIP normtimeitem (already partitioned)"
else
    alter_table normtimeitem ntiid || exit 1
    verify_table normtimeitem ntiid || { log "FATAL: time 试点验证未过, 停止后续表"; exit 1; }
fi

# ② ood(1890 万, 小时级)
if is_partitioned normooditem; then
    log "SKIP normooditem (already partitioned)"
else
    alter_table normooditem ngiid || exit 1
    verify_table normooditem ngiid || exit 1
fi

# ③ rice(2585 万, 小时级)
if is_partitioned normriceitem; then
    log "SKIP normriceitem (already partitioned)"
else
    alter_table normriceitem npiid || exit 1
    verify_table normriceitem npiid || exit 1
fi

# ---------- 最终验证: 裁剪命中单分区 ----------
pruned=$(q "EXPLAIN PARTITIONS SELECT COUNT(*) FROM normriceitem WHERE qid = 961004" | awk '{print $1}')
log "PRUNE-CHECK normriceitem qid=961004 → partitions=${pruned} (expect 单分区名如 p09)"
pruned2=$(q "EXPLAIN PARTITIONS SELECT COUNT(*) FROM normooditem WHERE qid = 961004" | awk '{print $1}')
log "PRUNE-CHECK normooditem  qid=961004 → partitions=${pruned2}"

log "=== ALL DONE: 三表 RANGE 分区完成。业务回归点: make 全量重算/确认页/拆单页/工费计算 ==="
exit 0
