# 系统管理模块 (system)

[根目录](../../../../CLAUDE.md) > [src/com/fanglin](../../) > **system**

> 最后更新：2025-12-01 14:58:35

---

## 模块职责

**系统管理模块**是 Rhadamanthus ERP 系统的基础设施模块,负责系统级配置、用户权限管理、组织架构、区域管理等核心功能,为所有业务模块提供底层支撑。

**核心价值**
- 用户与角色权限管理 (RBAC)
- 组织架构与公司管理
- 区域城市数据管理
- 系统参数配置
- 版本管理
- 对象存储配置

---

## 入口与启动

### 主入口 Action
- **SystemConfigAction.java** - 系统配置管理
- **CompanyAction.java** - 公司管理
- **OrganizationAction.java** - 组织架构管理
- **RoleAction.java** - 角色权限管理
- **ModuleAction.java** - 功能模块管理
- **OperationAction.java** - 操作权限管理
- **RegionAction.java** - 区域管理
- **CityAction.java** - 城市管理
- **CityProperAction.java** - 城市属性管理
- **OssConfigAction.java** - 对象存储配置
- **VersionAction.java** - 版本管理

### 访问路径
```
前端页面: WebContent/views/system/
API 端点: *.do
示例: pageRole.do, createCompany.do
```

---

## 对外接口

### 核心 API 端点

| 接口名称 | 请求方式 | 路径 | 功能描述 |
|---------|---------|------|---------|
| pageRole | POST | /pageRole.do | 分页查询角色列表 |
| createRole | POST | /createRole.do | 创建新角色 |
| updateRole | POST | /updateRole.do | 更新角色信息 |
| deleteRole | POST | /deleteRole.do | 删除角色 |
| updateRoleModule | POST | /updateRoleModule.do | 更新角色的模块权限 |
| pageCompany | POST | /pageCompany.do | 分页查询公司列表 |
| createCompany | POST | /createCompany.do | 创建新公司 |
| updateCompany | POST | /updateCompany.do | 更新公司信息 |
| pageOrganization | POST | /pageOrganization.do | 分页查询组织架构 |
| updateOrganization | POST | /updateOrganization.do | 更新组织信息 |
| pageRegion | POST | /pageRegion.do | 分页查询区域列表 |
| pageCity | POST | /pageCity.do | 分页查询城市列表 |
| querySystemConfig | POST | /querySystemConfig.do | 查询系统配置 |
| updateSystemConfig | POST | /updateSystemConfig.do | 更新系统配置 |
| queryOssConfig | POST | /queryOssConfig.do | 查询OSS配置 |
| updateOssConfig | POST | /updateOssConfig.do | 更新OSS配置 |
| pageVersion | POST | /pageVersion.do | 查询版本列表 |

---

## 关键依赖与配置

### 依赖的模块
- **core** - 核心框架组件
- **utils** - 工具类

### 配置文件
- `conf/ApplicationContext.xml` - Spring 配置
- `conf/struts.xml` - Struts2 路由配置
- `conf/sysconfig.properties` - 系统参数配置

### 关键常量
- 角色类型: 1-系统管理员, 2-公司管理员, 3-普通用户
- 组织类型: 1-总公司, 2-分公司, 3-部门, 4-小组
- 区域级别: 1-省, 2-市, 3-区/县

---

## 数据模型

### 核心实体 (PO)

#### RolePO - 角色表
```java
@Entity
@Table(name = "role")
public class RolePO {
    @Id private String roleId;                   // 角色ID (主键)
    private String roleName;                     // 角色名称
    private String roleDesc;                     // 角色描述
    private Short roleType;                      // 角色类型
    private String companyId;                    // 所属公司ID
    private Short status;                        // 状态 (0-禁用,1-启用)
    private Timestamp createTime;                // 创建时间
    private Timestamp updateTime;                // 更新时间
}
```

#### RoleModulePO - 角色模块关联表
```java
@Entity
@Table(name = "role_module")
public class RoleModulePO {
    @Id private String id;                       // 关联ID
    private String roleId;                       // 角色ID
    private String moduleId;                     // 模块ID
    private Short access;                        // 访问权限 (0-无,1-只读,2-读写)
}
```

#### ModulePO - 功能模块表
```java
@Entity
@Table(name = "module")
public class ModulePO {
    @Id private String moduleId;                 // 模块ID
    private String moduleName;                   // 模块名称
    private String moduleCode;                   // 模块编码
    private String parentId;                     // 父模块ID
    private Short moduleLevel;                   // 模块层级
    private String moduleIcon;                   // 模块图标
    private String moduleUrl;                    // 模块URL
    private Short orderNum;                      // 排序号
    private Short status;                        // 状态
}
```

#### OperationPO - 操作权限表
```java
@Entity
@Table(name = "operation")
public class OperationPO {
    @Id private String operationId;              // 操作ID
    private String operationName;                // 操作名称
    private String operationCode;                // 操作编码
    private String moduleId;                     // 所属模块ID
    private Short status;                        // 状态
}
```

#### CompanyPO - 公司表
```java
@Entity
@Table(name = "company")
public class CompanyPO {
    @Id private String companyId;                // 公司ID
    private String companyName;                  // 公司名称
    private String companyCode;                  // 公司编码
    private Short companyType;                   // 公司类型 (1-总公司,2-分公司)
    private String parentId;                     // 父公司ID
    private String contactPerson;                // 联系人
    private String contactPhone;                 // 联系电话
    private String address;                      // 公司地址
    private Short status;                        // 状态
    private Timestamp createTime;                // 创建时间
}
```

#### OrganizationPO - 组织架构表
```java
@Entity
@Table(name = "organization")
public class OrganizationPO {
    @Id private String organizationId;           // 组织ID
    private String organizationName;             // 组织名称
    private String organizationCode;             // 组织编码
    private String companyId;                    // 所属公司ID
    private String parentId;                     // 父组织ID
    private Short organizationType;              // 组织类型
    private Short orderNum;                      // 排序号
    private Short status;                        // 状态
}
```

#### RegionPO - 区域表
```java
@Entity
@Table(name = "region")
public class RegionPO {
    @Id private String regionId;                 // 区域ID
    private String regionName;                   // 区域名称
    private String regionCode;                   // 区域编码
    private String parentId;                     // 父区域ID
    private Short regionLevel;                   // 区域层级 (1-省,2-市,3-区)
    private Short orderNum;                      // 排序号
}
```

#### CityPO - 城市表
```java
@Entity
@Table(name = "city")
public class CityPO {
    @Id private String cityId;                   // 城市ID
    private String cityName;                     // 城市名称
    private String provinceId;                   // 省份ID
    private String provinceName;                 // 省份名称
    private Short status;                        // 状态
}
```

#### SystemConfigPO - 系统配置表
```java
@Entity
@Table(name = "system_config")
public class SystemConfigPO {
    @Id private String configKey;                // 配置键
    private String configValue;                  // 配置值
    private String configDesc;                   // 配置描述
    private String configGroup;                  // 配置分组
    private Timestamp updateTime;                // 更新时间
}
```

#### OssConfigPO - OSS配置表
```java
@Entity
@Table(name = "oss_config")
public class OssConfigPO {
    @Id private String id;                       // ID
    private String ossType;                      // OSS类型 (aliyun/qiniu/huawei)
    private String endpoint;                     // 访问端点
    private String accessKeyId;                  // AccessKey ID
    private String accessKeySecret;              // AccessKey Secret
    private String bucketName;                   // Bucket名称
    private String domain;                       // 访问域名
    private Short status;                        // 状态 (0-禁用,1-启用)
}
```

#### VersionPO - 版本表
```java
@Entity
@Table(name = "version")
public class VersionPO {
    @Id private String versionId;                // 版本ID
    private String versionNo;                    // 版本号
    private String versionDesc;                  // 版本描述
    private Timestamp releaseTime;               // 发布时间
    private Short status;                        // 状态
}
```

---

## 测试与质量

### 当前状态
- ❌ 未发现单元测试
- ❌ 未发现集成测试
- ⚠️ 主要依赖手工测试

### 建议测试用例
1. **权限管理测试**
   - 测试角色创建与权限分配
   - 测试权限继承与覆盖
   - 测试权限验证逻辑

2. **组织架构测试**
   - 测试树形结构构建
   - 测试父子节点关联
   - 测试组织删除的级联处理

3. **系统配置测试**
   - 测试配置读取与缓存
   - 测试配置更新与生效
   - 测试配置格式校验

---

## 常见问题 (FAQ)

### Q1: 如何添加新的系统配置项?
A: 在 `system_config` 表中插入新记录,指定 `configKey`、`configValue`、`configGroup`,系统会自动加载到配置缓存中。

### Q2: 角色权限如何生效?
A: 系统采用 RBAC 模型,用户通过角色关联获得权限。权限检查在拦截器 (Interceptor) 中进行,读取 `role_module` 和 `role_operation` 表判断用户是否有访问权限。

### Q3: 如何管理多公司架构?
A: 通过 `CompanyPO` 和 `OrganizationPO` 建立公司与组织的树形结构,数据隔离通过 `companyId` 字段实现。

### Q4: 区域数据如何维护?
A: 区域数据 (省市区) 存储在 `region` 表,采用三级结构 (省-市-区),通过 `parentId` 建立层级关系。初始数据通过 SQL 脚本导入。

### Q5: OSS配置支持哪些存储类型?
A: 当前支持阿里云OSS、七牛云、华为云OBS。配置在 `oss_config` 表,通过 `ossType` 字段区分存储类型。

---

## 相关文件清单

### Action 层
```
SystemConfigAction.java                  - 系统配置管理
CompanyAction.java                       - 公司管理
OrganizationAction.java                  - 组织架构管理
RoleAction.java                          - 角色管理
ModuleAction.java                        - 模块管理
OperationAction.java                     - 操作管理
RegionAction.java                        - 区域管理
CityAction.java                          - 城市管理
CityProperAction.java                    - 城市属性管理
OssConfigAction.java                     - OSS配置管理
VersionAction.java                       - 版本管理
```

### Service 层
```
service/SystemConfigService.java
service/impl/SystemConfigServiceImpl.java
service/CompanyService.java
service/impl/CompanyServiceImpl.java
service/RoleService.java
service/impl/RoleServiceImpl.java
(其他对应 Service 类...)
```

### DAO 层
```
dao/SystemConfigDao.java
dao/impl/SystemConfigDaoImpl.java
(其他对应 DAO 类...)
```

### PO 层
```
SystemConfigPO.java                      - 系统配置
CompanyPO.java                           - 公司
OrganizationPO.java                      - 组织架构
RolePO.java                              - 角色
RoleModulePO.java                        - 角色模块关联
ModulePO.java                            - 功能模块
OperationPO.java                         - 操作权限
RoleOperationPO.java                     - 角色操作关联
RegionPO.java                            - 区域
CityPO.java                              - 城市
CityProperPO.java                        - 城市属性
OssConfigPO.java                         - OSS配置
VersionPO.java                           - 版本
```

### VO 层
```
vo/SystemConfigVO.java                   - 系统配置视图
vo/CompanyVO.java                        - 公司视图
vo/OrganizationVO.java                   - 组织架构视图
vo/RoleVO.java                           - 角色视图
(其他 VO 类...)
```

---

## 变更记录

### 2025-12-01 14:58:35
- 初始化系统管理模块文档
- 记录核心 API 接口与数据模型
- 添加常见问题解答
