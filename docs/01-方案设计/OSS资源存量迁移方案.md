# OSS 资源存量迁移方案（FastDFS → 阿里云 OSS）

> 2026-11-03 · 基于生产只读库实盘数据 · 前置：新上传已切 OSS STS 直传（2026-11-02 上线，`isAliOss=true`）

---

## 0. 现状事实（生产实盘）

### 0.1 存量规模

| 表 | 行数 | 说明 |
|----|------|------|
| construction.constructiondrawing | **846.0 万** | 最大资源表，施工图纸 |
| decoration.decorationpicture | **756.8 万**（740.5 万独立文件）| 本方案起点 |
| sales.salespicture | 126.8 万 | 销售单图片 |
| decoration.decorationcontract | 31.0 万 | 装修合同 |
| 其余 32 张表 | 万级~千级 | 全量清单见 §4 |

- decorationpicture 实测：avg filesize **11KB**（小文件海），总容量 **77.6GB**，path 平均 51 字符
- **path 格式 = FastDFS**：`group8/M00/2B/3F/wKgBFxxx.jpg`——分布式文件系统，非普通磁盘目录

### 0.2 现有存取链路

- 文件存取：FastDFS 集群 → nginx `location /group` 反代 → **172.16.0.73（文件服务器）**
- `downloadFile.do` / `showImg.do` / `uploadOther` 等**也在文件服务器**（nginx 同一批 proxy_pass），不经 Java 应用
- 展示层已就绪（本轮已上线）：`com.showImg` OSS 分支（`aliyuncs.com` URL → 预签名显示）+ 全局大图委托 `a.cboxElement → layer-src`

---

## 1. 目标终态

1. 全部历史资源对象化至 `oss://fl-prod-erp/<原相对路径>`（**保留 FastDFS 原路径为 key**，全局唯一、改写=纯前缀拼接）
2. 各资源表 `path` 列改写为完整 OSS URL（`https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/group8/M00/...`，实测 ~97 字符 < varchar(256) ✓）
3. 展示层零改动（`showImg` OSS 分支自动接管）；下载链路一处框架级适配（§6）
4. 文件服务器转只读冷备 30 天 → 下线

**为什么不改 nginx 302/读层拼接而改 DB**：读层拼接让每次显示都依赖转发/签名服务（性能与可用性耦合）；DB 改写一次到位后读路径干净（预签名是本地 HMAC 计算，微秒级），且改写可逆（前缀确定性，见 §5 回滚）。

---

## 2. 总体路径（五步）

```
①增量已切流(已完成) → ②全量对象迁移(ossimport) → ③完整性校验 → ④DB分批改写(低峰) → ⑤双读过渡→下线
```

---

## 3. 迁移引擎：ossimport url-list 模式

- **清单导出**：`SELECT path FROM <表>` 按表落 url-list 文件，每行：
  `http://<文件服务内网地址>/group8/M00/2B/3F/wKgBFxxx.jpg  oss://fl-prod-erp/group8/M00/2B/3F/wKgBFxxx.jpg`
- **执行机**：能访问 172.16.0.73 的内网机器（文件服务器本机或同 VPC ECS， ossimport 走 HTTP 拉取，**不需要 FastDFS 客户端**——nginx-mod-fastdfs 就是标准访问面）
- **量级预估**：740 万小文件，64 并发约 **4~10 小时**；带宽压力仅 77.6GB，可忽略
- 失败自动重试 + 完整日志；断点续迁

## 4. 校验（改写的前置闸）

1. **size 全检**：OSS 对象 length ≠ 源 Content-Length 的进失败清单重迁
2. **MD5 抽检 1%**（~7.4 万个）+ 失败清单全检
3. **孤儿行报告**：源 404 的行单独出清单（预计存在少量），不阻塞主流程，人工定性
4. 迁移结果落清单表 `migration.manifest_<table>`（path, ossVerified, verifiedAt），**DB 改写只动 verified=1 的行**

---

## 5. DB 分批改写（每表同模板）

```sql
-- 前置: 备份表(回滚保命)
CREATE TABLE decoration.bak_decorationpicture_path_20261103 AS
SELECT dpId, path FROM decoration.decorationpicture WHERE path LIKE 'group%';

-- 分批改写(主键区间, 5万/批, 低峰执行; 756万行=152批)
UPDATE decoration.decorationpicture
SET path = CONCAT('https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/', path)
WHERE dpId BETWEEN #{from} AND #{to}
  AND path LIKE 'group%';            -- 幂等守卫: 只改老格式, OSS URL 天然跳过
```

- **回滚双保险**：① 备份表按 dpId 回填；② 前缀剥离（`REPLACE(path, 'https://fl-prod-erp.oss-cn-beijing.aliyuncs.com/', '')`）
- 每批执行后 `SELECT COUNT(*) WHERE path LIKE 'group%'` 递减核对；全表跑完应为 0

## 6. 下载链路适配（唯一需要写代码的点）

`downloadFile.do` 在文件服务器上，OSS 路径传给它找不到文件。方案：

1. **后端**（aliyun 模块，小改）：`getProgressiveImage` 加 `download` 标记——预签名时带 `ResponseHeaderOverrides.contentDisposition("attachment; filename=<原名>")`，OSS 原生支持下载头
2. **前端框架**（core.js 一处）：新增 `com.ossDownload(url, fileName)`——检测 `aliyuncs.com` → 调上述接口拿带下载头的预签名 URL → `window.open`；老相对路径走原 `downloadFile.do` 不变
3. 业务页的下载入口按需接到该函数（涉及页面逐一排查清单化）

## 7. 其他 35 张表推广（同引擎同模板）

- **批次划分**（按 行数×业务价值）：
  - **P0**：constructiondrawing（846万）、decorationpicture（757万）——两周内
  - **P1**：salespicture（127万）、decorationcontract（31万）——P0 验证通过后
  - **P2**：其余 32 张小表（quotationpicture 493 行级别）——脚本化批量过，每表 1~2 小时
- **试点先行**：先拿 `communion.signet`（印章，量小价值高）走完整五步验证模板，再上 P0
- 每表固定动作：盘点 → url-list → 迁移 → 校验 → 分批改写 → 页面抽查

## 8. 风险与专项确认

| 风险/事项 | 处置 |
|-----------|------|
| 预签名接口含一次 HEAD 存在性检查 | 图片墙批量显示时每图 1 个 HEAD；优化项：加配置开关跳过（预签名不依赖存在性） |
| 双格式共存期 | 直接调 Huploadify 的页面（如 notice.js 公告附件）仍写老格式——showImg 按前缀自动分流显示不受影响；收尾阶段把这些页面切齐 |
| 钉钉/微信推送外部消费 URL | 逐一排查推送 payload 里的图片/文件地址，OSS URL 域名需外部可达（私有桶要预签名）——专项清单 |
| OSS 成本 | 77.6GB 标准存储 ≈ **¥10/月** 级，可忽略；如历史图纸访问极少可转低频再省 40% |
| 改写窗口 | binlog 压力可控（152 批×5 万行）；建议周六低峰执行 |
| 文件服务器下线 | 双读过渡 ≥30 天，OSS 稳定后只读封存 |

## 9. 时间线估算

| 阶段 | 内容 | 工期 |
|------|------|------|
| 试点 | signet 全流程验证模板 | 1 天 |
| P0 | 两张大表迁移+改写+验证 | 4~5 个工作日（含 1 个低峰窗口） |
| P1 | 两张中表 | 2 天 |
| P2 | 32 张小表 | 2~3 天 |
| 下载适配 | 后端 disposition + com.ossDownload + 入口排查 | 1~2 天（可与 P0 并行） |

---

## 待拍板事项（2026-11-03 已全部拍板）

1. ~~迁移执行机~~ → **文件服务器本机装 ossimport**（附录 A 执行手册）
2. ~~存在性检查开关~~ → **已实现**（`oss.presign.checkExistence=false` 默认关，erp-T 实测预签名调用 62ms）
3. ~~钉钉/微信推送排查~~ → 不专门投入；推送链路如后续发现失效再单点处理
4. ~~P0 窗口~~ → **周六 22:00 后**

**补充共识（用户确认）**：迁移**按批推进、不要求原子切换**——`com.showImg` 按 `aliyuncs.com/` 前缀自动分流，未迁移的行走老链路照常显示，改写到哪批哪批生效，混合格式长期共存无害。

---

## 附录 B：FastDFS 集群拓扑（2026-11-03 fdfs_monitor 实测）

decorationpicture 数据横跨全部 8 个 group（63万~126万行/group），每组双副本（读任一副本即可）：

| group | 节点 | 状态 |
|-------|------|------|
| group1 | 192.168.5.102（HFDM7J2）、192.168.5.116 | ACTIVE |
| group2 | 192.168.5.110、192.168.5.111 | ACTIVE |
| group3 | 192.168.5.112、192.168.5.113 | ACTIVE |
| group4 | 192.168.5.104、192.168.5.105（另有 5.25 已下线） | ACTIVE |
| group5 | 192.168.5.108、192.168.5.109（另有 5.25 已下线） | ACTIVE |
| group6 | 192.168.5.114 | ACTIVE |
| group7 | 192.168.5.117、192.168.5.118 | ACTIVE |
| group8 | 192.168.5.119、192.168.5.120 | ACTIVE |

- 存储布局：`groupN/M00/2F/44/xxx.jpg` ↔ 节点磁盘 `/home/fastdfs/storage/data/2F/44/xxx.jpg`（102 实测，store_path0=/home/fastdfs/storage/）
- **迁移方式升级为"存储节点本地读盘 + ossutil 直传"**（不经 HTTP；ossimport 降为备选）：每组选一台 ACTIVE 节点，按 DB 清单（权威文件列表，**不可整盘扫**——磁盘含其他业务数据，102 单机 1.6TB）取交集后并行上传，OSS key = `groupN/M00/<相对路径>`
- SSH：端口 19182（来源需加白；103 已作废）
- 路径格式分布：FastDFS 756.89 万行 / 杂项 74 行（单独处理）/ 新 OSS 格式 0 行

## 附录 A：ossimport 执行手册（文件服务器 172.16.0.73）

### A.1 安装（一次性）

```bash
# 文件服务器上执行(需能访问公网或预先下载导入)
wget https://oss-import-tools.oss-cn-hangzhou.aliyuncs.com/oss-import-2.17.4.zip -O /tmp/oss-import.zip
mkdir -p /home/ossimport && unzip /tmp/oss-import.zip -d /home/ossimport
```

### A.2 配置

`conf/sys.properties` 关键项（按机器规格调整）：

```properties
workerThreadCount=64
taskThreadCount=16
```

`conf/job.cfg`（url-list 模式）：

```properties
jobType=url_list
srcList=/home/ossimport/urllist.txt
destAccessKey=<fl-prod-erp写入凭证, 用fanglin-erp-oss子账号AssumeRole签发或临时AK>
destSecretKey=<同上>
destDomain=https://oss-cn-beijing.aliyuncs.com
destBucket=fl-prod-erp
taskFailCountFile=/home/ossimport/fail.txt
```

> 🔴 dest AK 建议不直接用主 AK：用 `fanglin-erp-oss` 子账号另行 AssumeRole 一个**仅 PutObject 到 fl-prod-erp 的角色凭证**（15 分钟无效——ossimport 需长期凭证，可为该子账号创建第二把仅限迁移期使用的 AK，迁移完禁用）。url-list 模式无需清单里带签名。

### A.3 清单生成与执行

```bash
# 1. 本地(只读RDS)导出清单 → gen_urllist.py 生成(见 scripts/oss_migration/gen_urllist.py)
python -I scripts/oss_migration/gen_urllist.py paths_raw.txt urllist.txt
# 2. urllist.txt 传到文件服务器 /home/ossimport/
# 3. 启动
bash /home/ossimport/ossimport.sh submit /home/ossimport/conf/job.cfg
bash /home/ossimport/ossimport.sh stat   # 看进度
```

### A.4 校验

- ossimport 自带失败清单 `fail.txt`，失败路径重提即可
- size 全检：`ossutil ls oss://fl-prod-erp/group8/ --limited-num` 对账清单行数；或脚本按 manifest 抽/全检
- 抽样 MD5：随机 1% 对象与源 `curl -sI` 比对 Content-Length + 下载比对

### A.5 验收口径

- 迁移成功数 = 清单去重数（740.5 万，decorationpicture 口径）
- fail.txt 清零或剩余项确认属于孤儿（源已 404）
- 页面抽查：装修单详情图片墙（改写后）缩略图/大图/下载三件全通

