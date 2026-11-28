# P4 密钥轮换操作指南

> 适用: 敏感数据加密密钥的键位显式化(P4-a)与真轮换(P4-b)
> 前置代码: `SensitiveDataHelper.decryptNewFormat` 双密钥回退(已落码, core-8.3.031 jar ≥ 45,018B 版本)
> ⚠️ 密钥值不入 git——本文件只含流程与命令, 密钥在生产侧生成并配置

## 背景与约束

- 生产生效密钥: `encryptKey/encryptIv`(legacy, 现值 844dd1 组), 无 `encryptKeyV1` 键, KeyManager 四级兜底生效——显式性缺失
- 存量约 130 万行 ENC(V1:) 密文全部为 844dd1 加密; `decryptNewFormat` 已支持双密钥回退(V1 失败→legacy 重试), 这是轮换的安全前提
- legacy(encryptKey)被认证串(AccessInterceptor/LoginAction/BaseAction)共用, **永远不能改值**
- 仓库 conf/sysconfig.properties 是 dev 侧(b4d6 组), 与生产(844dd1 组)分叉, 勿混淆

## P4-a 键位显式化(零风险, 可立即做)

生产六台应用机(T/A/S1/M/C/S2), 每台 BOOT 与 ROOT 两个部署各一份(以 S1 实测路径为例):
`/home/fanglin/BOOT/WEB-INF/classes/sysconfig.properties` 与 `/home/fanglin/ROOT/WEB-INF/classes/sysconfig.properties`

在 `encryptKey/encryptIv` 之后**追加两行**(值与现值相同, 行为零变化):

```properties
encryptKeyV1=<与encryptKey相同, 844dd1组>
encryptIvV1=<与encryptIv相同, cdb421组>
```

- 效果: KeyManager 走显式 V1 键(不再依赖兜底), 六台配置一致化
- 重启: 每台两套 tomcat 重启后生效; 可逐台灰度
- 验证: 登录系统正常 + 任意客户详情点击电话(oid 77)可解 + catalina 无 110028
- 回滚: 删除追加的两行重启即可

## P4-b 真轮换(需 P4-a 完成 + core jar ≥45,018B 已部署)

### 步骤1: 生成新密钥(任一安全环境, 不落 git/聊天/工单)

```bash
openssl rand -hex 16   # 生成 encryptKeyV1 新值 (32位hex字符串)
openssl rand -hex 16   # 生成 encryptIvV1 新值
```

> KeyManager 按字符串 ASCII 取字节, 32 位 hex 字符串=16 字节密钥 ✔(与现配置格式一致)

### 步骤2: 配置六台机 sysconfig(同 P4-a 路径, 改值)

```properties
encryptKeyV1=<步骤1新值>
encryptIvV1=<步骤1新值>
```

重启 tomcat。**只改 V1 两键, encryptKey/encryptIv(legacy)一律不动**。

### 步骤3: 生效后行为

| 数据形态 | 解密路径 | 结果 |
|---|---|---|
| 新写入(ENC(V1:) | V1 新密钥一次成功 | ✔ |
| 存量 ENC(V1:)(844dd1) | V1 失败→legacy 回退成功(微秒级代价) | ✔ |
| 存量旧格式 Base64(844dd1) | tryLegacyDecrypt | ✔ |
| 认证串 | encryptKey 直读, 未受影响 | ✔ |

### 步骤4: 验证清单

1. 登录系统(认证串走 legacy, 验证未受影响)
2. 客户详情点击电话(oid 77 明文口)可解——覆盖存量 ENC(V1:) 回退路径
3. 新建/编辑用户(user2edit)→ 查库确认新写入为 ENC(V1:) 且旧密钥解不开、新密钥可解(证明新 key 生效)
4. catalina 无 110028 刷屏
5. 客源审批流程走单(消息文本已无敏感字段, 验证 P3 改动无回归)

### 回滚

`encryptKeyV1/encryptIvV1` 改回 844dd1 组并重启——行为回到 P4-a 状态(存量回退路径仍在, 无数据损失)。

## ⚠️ 轮换与 P2 迁移脚本的依赖(重要)

S1 迁移器 `migrate_sensitive_inplace.py` 的加密密钥是**硬编码 ACTIVE_KEY=844dd1**(与迁移时生产生效键一致)。真轮换(改 V1 键值)后, 迁移新产物仍是 844dd1 加密——应用双密钥回退可解, **正确性不受影响**; 但"新 key 只覆盖轮换后应用新写入"的口径会被迁移产物稀释。

二选一:
- **推荐: P2 迁移收官后再轮换**(迁移全量完成后全库密文形态单一, 轮换最干净)
- 或轮换时同步更新 S1 脚本: 改 `ACTIVE_KEY/ACTIVE_IV` 两行为新值并重新上传(迁移产物随即用新 key, 与应用一致)

## P4-c 存量统一(可选, 未排期)

P2 迁移收官后, 可将全量 ENC(V1:) 旧密钥密文解→新 V1 密钥重加密(复用 migrate_sensitive_inplace.py 框架, 约 130 万行≈2 小时), 完成后 decryptNewFormat 的 legacy 回退可择期撤除。不执行不影响安全性(844dd1 已随 main 清理停止暴露, 新 V1 密钥独立)。
