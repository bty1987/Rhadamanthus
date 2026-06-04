# CentOS 6.x Yum 源配置指南

> CentOS 6 已于 2020 年 11 月 30 日停止维护（EOL），官方常规镜像站已移除 CentOS 6 的源。
> 所有可用源均已迁移至各镜像站的 `centos-vault` 归档目录。
> 本文档记录当前仍可用的源地址及配置方法。（2026年6月验证通过）

---

## 一、查看系统版本

```bash
cat /etc/redhat-release    # 例：CentOS release 6.10 (Final)
uname -r                   # 例：2.6.32-754.el6.x86_64
getconf LONG_BIT           # 例：64
```

---

## 二、可用源地址一览

### 国内镜像（推荐）

| 源 | 地址前缀 |
|----|---------|
| 阿里云 | https://mirrors.aliyun.com/centos-vault/ |
| 清华大学 | https://mirrors.tuna.tsinghua.edu.cn/centos-vault/ |
| 华为云 | https://mirrors.huaweicloud.com/centos-vault/ |
| 网易163 | http://mirrors.163.com/centos-vault/ |
| 腾讯云 | https://mirrors.cloud.tencent.com/centos-vault/ |

### 海外镜像

| 源 | 地址前缀 |
|----|---------|
| CentOS Vault（官方） | https://vault.centos.org/ |
| kernel.org | http://archive.kernel.org/centos-vault/ |
| CERN | http://linuxsoft.cern.ch/centos-vault/ |
| LiU（瑞典） | http://mirror.nsc.liu.se/centos-store/ |

---

## 三、CentOS 6.10 源配置

### 1. 备份原有源

```bash
mkdir -p /etc/yum.repos.d/bak
mv /etc/yum.repos.d/*.repo /etc/yum.repos.d/bak/
```

### 2. 创建新源文件

```bash
vi /etc/yum.repos.d/CentOS-Base.repo
```

写入以下内容：

```ini
[base]
name=CentOS-6.10 - Base
baseurl=https://mirrors.aliyun.com/centos-vault/6.10/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

[updates]
name=CentOS-6.10 - Updates
baseurl=https://mirrors.aliyun.com/centos-vault/6.10/updates/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

[extras]
name=CentOS-6.10 - Extras
baseurl=https://mirrors.aliyun.com/centos-vault/6.10/extras/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

[centosplus]
name=CentOS-6.10 - Plus
baseurl=https://mirrors.aliyun.com/centos-vault/6.10/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

[contrib]
name=CentOS-6.10 - Contrib
baseurl=https://mirrors.aliyun.com/centos-vault/6.10/contrib/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
```

### 3. 清除缓存并重建

```bash
yum clean all
yum makecache
```

### 4. 验证

```bash
yum repolist
```

正常输出类似：

```
repo id            repo name                       status
base               CentOS-6.10 - Base              6,713
extras             CentOS-6.10 - Extras               47
updates            CentOS-6.10 - Updates            1,273
repolist: 8,033
```

---

## 四、CentOS 6.9 源配置

与 6.10 配置方法相同，只需将版本号 `6.10` 替换为 `6.9`：

```ini
baseurl=https://mirrors.aliyun.com/centos-vault/6.9/os/$basearch/
baseurl=https://mirrors.aliyun.com/centos-vault/6.9/updates/$basearch/
baseurl=https://mirrors.aliyun.com/centos-vault/6.9/extras/$basearch/
```

---

## 五、切换备用源

如果阿里云源不可用，全局替换域名即可。例如切换到清华源：

```bash
sed -i 's|mirrors.aliyun.com/centos-vault|mirrors.tuna.tsinghua.edu.cn/centos-vault|g' /etc/yum.repos.d/CentOS-Base.repo
yum clean all
yum makecache
```

各备用源域名对照：

| 源 | 域名替换值 |
|----|-----------|
| 清华大学 | mirrors.tuna.tsinghua.edu.cn/centos-vault |
| 华为云 | mirrors.huaweicloud.com/centos-vault |
| 网易163 | mirrors.163.com/centos-vault |
| 腾讯云 | mirrors.cloud.tencent.com/centos-vault |
| 官方Vault | vault.centos.org |

---

## 六、常见问题

### Q1: yum 报错 "Cannot find a valid baseurl"

- 检查网络连通性：`ping mirrors.aliyun.com`
- 确认源地址正确，版本号与系统版本一致
- 尝试切换备用源

### Q2: yum 报错 "SSL certificate problem"

CentOS 6 的 curl/openssl 版本较老，可能不支持 HTTPS。改用 HTTP：

```bash
sed -i 's|https://|http://|g' /etc/yum.repos.d/CentOS-Base.repo
yum clean all
yum makecache
```

### Q3: 安装软件提示依赖冲突

CentOS 6 已停止维护，部分软件包不再更新。建议：
- 使用 EPEL 归档源：`https://mirrors.aliyun.com/epel-archive/6/`
- 考虑升级到 CentOS 7 或其他仍在维护的系统

---

## 七、EPEL 源配置（可选）

EPEL 提供额外的高质量软件包：

```bash
# 安装 EPEL
rpm -ivh https://mirrors.aliyun.com/epel-archive/6/x86_64/epel-release-6-8.noarch.rpm

# 或手动配置
vi /etc/yum.repos.d/epel.repo
```

```ini
[epel]
name=Epel - 6
baseurl=https://mirrors.aliyun.com/epel-archive/6/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-6
```

---

*最后更新：2026-06-04 | 所有源地址已验证可用*
