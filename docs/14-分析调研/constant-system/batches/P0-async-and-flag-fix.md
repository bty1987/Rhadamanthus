# P0 · 同步请求改异步预取 + 标志位笔误修正

> 实施日期：2026-07-27
> 状态：✅ 已完成
> 改动面：2 个文件，零业务调用点改动

---

## 目标

1. 消除菜单点击时的 UI 卡顿（同步 AJAX 阻塞主线程）。
2. 修复 `index.js:962` 标志位名字写错（`"update"` 应为 `"load"`）的隐患。

## 设计决策：为何不直接翻转默认值为异步？

直接把 `com.post(..., false)` 默认改异步会引入竞态：异步请求未返回时，业务代码（3000+ 调用点）同步访问 `constant.decoration().decoration.typeness.keys[x]` 会拿到**未填满的对象**（keys 为空），导致翻译结果为 undefined。

**采用策略**：保持业务调用的同步语义不变（向下兼容），改为在"用户尚未访问该模块"的时机（菜单点击）**异步预取**。这样：
- 预取期间 UI 不冻结（async:true）
- 业务页面真正访问时，`load=true` 已置位，走 `handle()` 的同步返回分支（constant.js:48-50），命中缓存、零阻塞
- 即使预取未完成业务就访问，最坏情况退化为原有的同步请求行为，不会出错

## 改动点

### 1. `WebContent/js/com/constant.js`

**`handle()` 新增 `opts` 参数**（透传 async 开关）：
```javascript
var handle = function(module, clazz, type, opts) {
    opts = opts || {};
    // ...
    // asyncFlag 透传给 com.post：false=同步（默认，兼容旧调用），true=异步（预取不阻塞 UI）。
    var asyncFlag = opts.async === true ? true : false;
    com.post(api.data.queryConstant, options, function(res) { ... }, null, asyncFlag);
}
```

**`module/clazz/type` 方法透传 opts**：
```javascript
module: function(module, opts) { return handle(module, null, null, opts); },
clazz:  function(module, clazz, opts) { return handle(module, clazz, null, opts); },
type:   function(module, clazz, type, opts) { return handle(module, clazz, type, opts); },
```

默认行为（不传 opts 或 `opts.async!==true`）= 同步，**完全兼容** 3000+ 旧调用点。

### 2. `WebContent/js/index.js:962`

```diff
- if (module && (!constant[module] || !constant[module]["update"])) {
-     Constant().module(module);
- }
+ // 菜单点击时异步预取该模块常量，不阻塞 UI。
+ // 业务页面真正访问 constant.<module>() 时大概率已命中 load=true 的同步缓存分支。
+ // 标志位须与 constant.js 一致使用 "load"（旧代码误写成 "update" 永远不命中）。
+ if (module && (!constant[module] || !constant[module]["load"])) {
+     Constant().module(module, { async: true });
+ }
```

两处修正：
- `"update"` → `"load"`：与 constant.js 的标志位命名一致
- `Constant().module(module)` → `Constant().module(module, { async: true })`：异步预取

## 验证

- [x] constant.js 语法正确（handle/module/clazz/type 签名一致）
- [x] index.js 标志位与 constant.js 一致
- [x] 默认行为不变（不传 opts 时 asyncFlag=false，仍是同步）
- [ ] 人工冒烟：登录 → 点击各模块菜单 → 验证无卡顿 + 常量翻译正常

## 回滚

git revert 这两个文件的本次改动即可，无副作用。
