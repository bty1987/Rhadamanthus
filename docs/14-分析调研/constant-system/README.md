# 前台常量体系审计与优化

> 本目录归档 Rhadamanthus 前台常量（`communion.constant`）体系的审计结论与分批优化方案。
> 所有后续调整按本目录下的批次文档执行，避免散落、便于回溯。

## 目录结构

| 文件 | 用途 |
|------|------|
| `00-AUDIT.md` | 现状审计报告（常量 vs 魔法数、表结构、缓存机制、性能痛点） |
| `01-OPTIMIZATION-PLAN.md` | 分批优化方案总览（P0/P1/P2/P3 优先级矩阵） |
| `batches/` | 各批次实施记录（每完成一批落地一份） |

## 当前进度

| 批次 | 主题 | 状态 | 实施记录 |
|------|------|------|----------|
| P0 | constant.js 同步改异步 + index.js 标志位笔误修正 | ✅ 已完成 | [P0-async-and-flag-fix.md](batches/P0-async-and-flag-fix.md) |
| P1-a | 切公司刷新彻底化 + projectStatus 同步等待 | ✅ 已完成 | [P1-abc-cache-and-schema.md](batches/P1-abc-cache-and-schema.md) |
| P1-b | constant 表去重 + 唯一约束 + 索引（SQL 脚本） | 📄 待 DBA 执行 | [P1-abc-cache-and-schema.md](batches/P1-abc-cache-and-schema.md) |
| P1-c | ConstantPO 补 updateTime 映射 | ⏸️ 推迟（依赖 P1-b） | [P1-abc-cache-and-schema.md](batches/P1-abc-cache-and-schema.md) |
| P2-a | 登录后并发预加载（消除首次访问竞态） | 🔴 已回退（破坏 condition） | [P2-preload-and-magic-numbers.md](batches/P2-preload-and-magic-numbers.md) |
| P2-b | 收敛 status 0/1 魔法数（approval 模块示范） | ✅ approval/balance/building/decorationContract 已完成 | [P2-preload-and-magic-numbers.md](batches/P2-preload-and-magic-numbers.md) |
| P3 | 后端聚合接口 + ETag（长期最优） | ⬜ 待开始（可选） | — |

> 状态标记：⬜ 待开始 / 🔄 进行中 / ✅ 已完成 / 📄 脚本就绪待执行 / ⏸️ 阻塞待前置

> 状态标记：⬜ 待开始 / 🔄 进行中 / ✅ 已完成

## 一句话结论

> 常量体系的**骨架是健康的**（3000+ 处已常量化、模块级懒加载去重已做对），真正要治的是三件事：
> ① **同步请求阻塞 UI**（P0，改一个参数即可）；
> ② **`status==0/1` 横切魔法数失控**（分模块渐进收敛）；
> ③ **`constant` 表缺唯一约束和查询索引**（数据完整性 + 性能双收益）。
>
> `Constant().get/valueOf/...` 新 API 推广失败（业务 0 调用），建议**不再强推**，把精力放在收敛魔法数上更划算。
