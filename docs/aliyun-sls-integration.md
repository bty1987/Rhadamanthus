# 阿里云 SLS 日志服务接入配置手册

> 适用项目：方林ERP (Rhadamanthus)
> 目标：零代码改动，通过 Logtail 采集 Nginx + Tomcat 日志到阿里云 SLS
> 预计耗时：约 1 小时

---

## 一、前置条件

| 项目 | 说明 |
|------|------|
| 阿里云账号 | 已开通 SLS 日志服务 |
| ECS 地域 | 华东1（cn-hangzhou），与 RDS 同域 |
| 服务器访问 | SSH 登录权限 |
| Nginx | 已部署，配置文件路径 `/usr/local/nginx/conf/nginx.conf` |
| Tomcat | 版本 7.x，日志路径 `/usr/local/apache-tomcat-7.0.55/logs/` |
| 当前日志框架 | Log4j 1.2.17，日志文件 `medical.log` |

---

## 二、SLS 控制台创建资源

登录：https://sls.console.aliyun.com

### 2.1 创建 Project

```
Project名称:   fanglin-erp-prod
所属地域:      华东1(杭州)
描述:          方林ERP日志服务
```

### 2.2 创建 Logstore（共3个）

在 Project 下依次创建：

| # | Logstore名称 | 用途 | 数据保留 | Shard数 | 自动分裂 |
|---|---|---|---|---|---|
| 1 | `nginx-access` | Nginx 请求日志 | 30天 | 2 | 开启 |
| 2 | `app-log` | Tomcat 应用全量日志 | 30天 | 2 | 开启 |
| 3 | `app-error` | 应用 ERROR 日志 | 90天 | 1 | 开启 |

---

## 三、Nginx 日志格式改为 JSON

### 3.1 编辑配置

```bash
vi /usr/local/nginx/conf/nginx.conf
```

在 `http {}` 块内，找到现有 `log_format` 或 `access_log` 附近，添加：

```nginx
log_format log_json escape=json
  '{'
    '"time":"$time_iso8601",'
    '"client_ip":"$remote_addr",'
    '"method":"$request_method",'
    '"uri":"$request_uri",'
    '"status":$status,'
    '"body_bytes":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"upstream_time":"$upstream_response_time",'
    '"referer":"$http_referer",'
    '"user_agent":"$http_user_agent",'
    '"x_forwarded_for":"$http_x_forwarded_for"'
  '}';

access_log /usr/local/nginx/logs/access.log log_json;
```

> 注意：如果原配置中有 `access_log` 行，注释掉或替换为上面这行。

### 3.2 检查并重载

```bash
# 检查语法
/usr/local/nginx/sbin/nginx -t

# 重载（不断连接）
/usr/local/nginx/sbin/nginx -s reload
```

### 3.3 验证

```bash
tail -1 /usr/local/nginx/logs/access.log
```

期望输出类似：

```json
{"time":"2026-04-15T10:30:00+08:00","client_ip":"192.168.1.100","method":"POST","uri":"/addCustomerLead.do","status":200,"body_bytes":256,"request_time":0.125,"upstream_time":"0.123","referer":"","user_agent":"Mozilla/5.0","x_forwarded_for":""}
```

看到 JSON 格式即成功。

---

## 四、Log4j 拆分 ERROR 日志（可选）

> 这步可选。不做也完全可以，ERROR 和 INFO 会混在同一个文件里由 Logtail 采集。
> 做了的好处是 ERROR 日志单独文件，可以独立配置保留时间和告警。

### 4.1 编辑 log4j.properties

文件位置：`conf/log4j.properties`（开发环境）或服务器上对应路径

修改为：

```properties
# 控制台输出
log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss} %-5p [%t] %c - %m%n

# 全量日志文件（INFO及以上）
log4j.appender.R=org.apache.log4j.DailyRollingFileAppender
log4j.appender.R.threshold=INFO
log4j.appender.R.File=/usr/local/apache-tomcat-7.0.55/logs/medical.log
log4j.appender.R.DatePattern='.'yyyy-MM-dd
log4j.appender.R.layout=org.apache.log4j.PatternLayout
log4j.appender.R.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss} %p %t %c - %m%n

# ERROR单独文件（新增）
log4j.appender.ERROR_FILE=org.apache.log4j.DailyRollingFileAppender
log4j.appender.ERROR_FILE.threshold=ERROR
log4j.appender.ERROR_FILE.File=/usr/local/apache-tomcat-7.0.55/logs/error.log
log4j.appender.ERROR_FILE.DatePattern='.'yyyy-MM-dd
log4j.appender.ERROR_FILE.layout=org.apache.log4j.PatternLayout
log4j.appender.ERROR_FILE.layout.ConversionPattern=%-d{yyyy-MM-dd HH:mm:ss} %p %t %c - %m%n

# Root Logger —— 挂载所有Appender
log4j.rootLogger=INFO, A1, R, ERROR_FILE
```

### 4.2 重启 Tomcat

```bash
/usr/local/apache-tomcat-7.0.55/bin/shutdown.sh
sleep 5
/usr/local/apache-tomcat-7.0.55/bin/startup.sh
```

### 4.3 验证

```bash
ls -la /usr/local/apache-tomcat-7.0.55/logs/medical.log
ls -la /usr/local/apache-tomcat-7.0.55/logs/error.log
```

两个文件都存在即成功（error.log 在出现 ERROR 后才会有内容）。

---

## 五、安装 Logtail

### 5.1 下载并安装

```bash
# 下载安装脚本
wget https://logtail-release-cn-hangzhou.oss-cn-hangzhou-internal.aliyuncs.com/linux64/logtail.sh -O /tmp/logtail.sh

# 赋权并安装（内网模式，免流量费）
chmod +x /tmp/logtail.sh
/tmp/logtail.sh install cn-hangzhou
```

> 如果服务器不在阿里云内网（如本地测试机），去掉 `-internal`，使用公网地址：
> `wget https://logtail-release-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/linux64/logtail.sh`

### 5.2 验证安装

```bash
/etc/init.d/ilogtaild status
```

看到 `ilogtail is running` 即成功。

---

## 六、配置 Logtail 采集（控制台操作）

### 6.1 采集 Nginx 日志 → nginx-access

```
操作路径: fanglin-erp-prod → nginx-access → 接入数据 → 自定义数据插件

配置项:
  数据类型:          JSON - 日志
  日志路径:          /usr/local/nginx/logs/access.log
  文件编码:          UTF-8
  采集模式:          JSON模式（自动解析字段）
  首次采集位置:      首次可选择"历史数据"（采集已有日志）
                    后续自动追加
```

### 6.2 采集应用日志 → app-log

```
操作路径: fanglin-erp-prod → app-log → 接入数据 → 自定义数据插件

配置项:
  数据类型:          单行文本日志
  日志路径:          /usr/local/apache-tomcat-7.0.55/logs/medical.log
  文件编码:          UTF-8
  采集模式:          完整正则模式
  正则表达式:        (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\w+) (\S+) (\S+) - (.*)

  提取字段（点击"手动添加字段"或"自动生成"）:
    字段1: time      → 第1组
    字段2: level     → 第2组
    字段3: thread    → 第3组
    字段4: logger    → 第4组
    字段5: message   → 第5组
```

### 6.3 采集错误日志 → app-error（如果做了第四步）

```
操作路径: fanglin-erp-prod → app-error → 接入数据 → 自定义数据插件

配置项同 6.2，区别:
  日志路径:          /usr/local/apache-tomcat-7.0.55/logs/error.log
  其余相同
```

---

## 七、配置索引（控制台操作）

> 每个 Logstore 需要单独建索引，建完后约 1 分钟生效。

### 7.1 nginx-access 索引

```
操作路径: fanglin-erp-prod → nginx-access → 查询分析 → 索引属性 → 修改

添加字段:
```

| 字段名 | 类型 | 别名 | 开启统计 | 说明 |
|--------|------|------|----------|------|
| time | text | - | 否 | 请求时间 |
| client_ip | text | - | 是 | 客户端IP |
| method | text | - | 是 | 请求方法 |
| uri | text | - | 是 | 请求路径 |
| status | long | - | 是 | HTTP状态码 |
| body_bytes | long | - | 是 | 响应字节数 |
| request_time | double | - | 是 | 请求耗时(秒) |
| upstream_time | text | - | 否 | 后端响应时间 |
| referer | text | - | 否 | 来源页 |
| user_agent | text | - | 否 | 客户端UA |
| x_forwarded_for | text | - | 否 | 代理转发链 |

### 7.2 app-log 索引

```
操作路径: fanglin-erp-prod → app-log → 查询分析 → 索引属性 → 修改
```

| 字段名 | 类型 | 别名 | 开启统计 | 说明 |
|--------|------|------|----------|------|
| time | text | - | 否 | 日志时间 |
| level | text | - | 是 | 日志级别 |
| thread | text | - | 否 | 线程名 |
| logger | text | - | 是 | Logger名(类名) |
| message | text | - | 是 | 日志内容，开启中文分词 |

### 7.3 app-error 索引

同 app-log 索引配置。

---

## 八、验证数据

### 8.1 触发测试日志

```bash
# 在服务器上发一个请求
curl -s http://localhost/ > /dev/null

# 或访问任意接口
curl -s http://localhost/addCustomerLead.do
```

### 8.2 控制台查询

等待 10-30 秒后，到 SLS 控制台：

```
nginx-access 查询:  * | SELECT count(*) as total
app-log 查询:       *
```

能看到记录即采集成功。

---

## 九、配置告警（可选）

```
操作路径: fanglin-erp-prod → 告警
```

### 9.1 HTTP 5xx 告警

```
告警名称:    HTTP 5xx 错误
关联Logstore: nginx-access
查询语句:    status >= 500 | SELECT count(*) as cnt
时间范围:    1 分钟
触发条件:    cnt > 0
通知方式:    钉钉 Webhook
```

### 9.2 应用 ERROR 告警

```
告警名称:    应用ERROR日志
关联Logstore: app-log（或 app-error）
查询语句:    level: ERROR | SELECT count(*) as cnt
时间范围:    5 分钟
触发条件:    cnt > 5（5分钟内超过5条ERROR）
通知方式:    钉钉 Webhook
```

### 9.3 慢接口告警

```
告警名称:    慢接口告警
关联Logstore: nginx-access
查询语句:    * | SELECT uri, round(avg(request_time),3) as avg_time,
             count(*) as cnt GROUP BY uri HAVING avg_time > 3
时间范围:    5 分钟
触发条件:    结果不为空（存在平均耗时 > 3秒 的接口）
通知方式:    钉钉 Webhook
```

---

## 十、常用查询语句参考

```sql
-- 查看所有 Nginx 请求（最近15分钟）
* | SELECT * ORDER BY time DESC LIMIT 100

-- 按 URI 统计请求量 TOP 20
* | SELECT uri, count(*) as cnt 
  GROUP BY uri ORDER BY cnt DESC LIMIT 20

-- 慢接口排行
* | SELECT uri, round(avg(request_time),3) as avg_time, 
         max(request_time) as max_time, count(*) as cnt 
  GROUP BY uri ORDER BY avg_time DESC LIMIT 20

-- HTTP 状态码分布
* | SELECT status, count(*) as cnt 
  GROUP BY status ORDER BY cnt DESC

-- 某个接口的 QPS 趋势（按分钟）
uri: "addCustomerLead" | SELECT date_format(__time__, '%H:%i') as minute, 
     count(*)/60 as qps GROUP BY minute ORDER BY minute

-- 应用 ERROR 日志查看
level: ERROR

-- 某个类的所有日志
logger: "com.fanglin.customer" | SELECT * ORDER BY time DESC LIMIT 100

-- 异常堆栈搜索
message: "Exception" OR message: "FLException"
```

---

## 十一、回滚方案

如果接入后出现问题需要回退：

| 步骤 | 操作 | 影响 |
|------|------|------|
| 1 | 停止 Logtail：`/etc/init.d/ilogtaild stop` | 停止采集，不影响业务 |
| 2 | Nginx 改回原 log_format 并 reload | 日志恢复原格式 |
| 3 | Log4j 删除 ERROR_FILE 相关配置并重启 Tomcat | 日志恢复原配置 |
| 4 | SLS 控制台删除 Project | 清理云端数据 |

> 任何一步都可以独立回退，整个过程不影响 Tomcat 业务运行。

---

## 十二、注意事项

1. Logtail 内网传输免费，公网传输收费（ECS 走内网无此问题）
2. SLS 按存储量和查询量计费，初期费用很低（日志量不大的话每月几块钱）
3. Nginx 日志改 JSON 后，原有的日志分析脚本如果依赖原格式需要同步调整
4. 服务器磁盘空间注意监控，Logtail 采集异常时日志文件会持续增长
5. 如果有多台 ECS 服务器，每台都要装 Logtail，控制台配置一次即可自动下发

---

## 附录：操作 Checklist

- [ ] SLS 控制台创建 Project `fanglin-erp-prod`
- [ ] 创建 Logstore `nginx-access`
- [ ] 创建 Logstore `app-log`
- [ ] 创建 Logstore `app-error`
- [ ] Nginx 配置 JSON 日志格式
- [ ] Nginx reload 并验证
- [ ] Log4j 拆分 error.log（可选）
- [ ] Tomcat 重启并验证日志文件
- [ ] 服务器安装 Logtail
- [ ] Logtail 采集配置：nginx-access
- [ ] Logtail 采集配置：app-log
- [ ] Logtail 采集配置：app-error（可选）
- [ ] 索引配置：nginx-access
- [ ] 索引配置：app-log
- [ ] 索引配置：app-error（可选）
- [ ] 验证数据入库
- [ ] 配置告警规则（可选）
