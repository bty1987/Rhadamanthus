# app/ —— 纯 LayUI 前端骨架

> 与旧 `WebContent/` 同级，纯 layui 2.13.8，零 ace/bootstrap 依赖。
> 完整规范见 `../docs/10-指南手册/NEW_PAGE_LAYUI_SCAFFOLD.md`。

## 本地运行（连真实后端，可登录）

### 前置
- 本机 node（任意现代版本即可，开发服务器零依赖）
- 能访问内网后端 `192.168.5.21`（已验证可达）

### 启动
```bash
# 在项目根目录执行
node app/dev-server.js                 # 默认端口 8088，后端 192.168.5.21

# 自定义端口 / 后端
node app/dev-server.js 9090            # 端口 9090
node app/dev-server.js 9090 10.0.0.5   # 端口 9090，后端 10.0.0.5
```

### 访问
浏览器打开 **http://localhost:8088/login.html**

输入内网账号密码 + 验证码 → 登录成功 → 自动跳 `index.html` → 加载菜单 → 进入 operation 等页面。

### 工作原理
`dev-server.js`（node 内置 `http` 模块，零依赖）做了三件事：
1. **静态服务**：把 `app/` 目录当网站根（`/login.html`、`/layui/*`、`/views/*`、`/js/*`）
2. **接口反代**：所有 `*.do` 请求透传到 `http://192.168.5.21/`（与现有 ERP 后端同源策略一致）
3. **Cookie 改写**：把后端 `Set-Cookie` 里的 `Domain=192.168.5.21` 去掉，让 `authentication` Cookie 落在 `localhost`

这样浏览器看到的全是同源（localhost），登录/认证/CORS 全部自然解决，**可完整登录并跑通 operation 列表的增改删**。

> ⚠️ 这是**开发工具**，不参与打包、不被业务页引用。生产部署走 nginx 或容器。

### 看不到 operation 菜单？
operation 页不在默认菜单里（菜单是后端按权限动态返回的）。直接浏览器访问：
```
http://localhost:8088/views/system/operation.html
```
可独立验证列表/分页/弹窗（需先在 login.html 登录拿到 Cookie）。

## 目录速查
```
login.html / index.html / home.html      入口
views/system/operation.html              首实例业务页（列表+弹窗增改删）
views/template/{list,form}.html          新模块模板（复制改名即用）
js/app/*                                 核心运行时（config/post/core/validate/bootstrap）
js/api/system.js                         首实例 API 定义
dev-server.js                            本地反代服务器
```

## 验证 operation 页端到端契约
登录后访问 `http://localhost:8088/views/system/operation.html`：
- ✅ 列表查询：`pageOperation.do` + `paging.*` + `filters[N].*`
- ✅ 分页：laypage，page>=60 上限保护
- ✅ 搜索：操作说明(cn) / 操作(cn) / 类型(eq)
- ✅ 新增/编辑：layer 弹窗 + 校验 + addOperation/updateOpperation
- ✅ 删除：showConfirm + deleteOperation

若列表报"员工不存在"等错误，是登录态/Cookie 问题，重新登录即可。
