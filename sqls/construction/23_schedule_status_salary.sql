-- ============================================================================
-- 23_schedule_status_salary.sql
-- construction.constructionschedule.status 新增状态值 3"工费"(未完工,已开放工费)
-- ============================================================================
-- 背景:
--   工费单创建/扣款原闸门=节点须完工(status=2,否则 280003 施工环节未完工)。
--   本次在开工(1)与完工(2)之间增加状态"工费"(值3):节点未完工但已开放工费,
--   处于该状态的节点允许创建/扣款工费单,且仍可正常走完工。
--
-- 状态机:0初始 →(开工)→ 1开工 →(开放工费 updateConstructionScheduleForSalary)→ 3工费 →(完工)→ 2完工
--   (值取3:字典键3空闲,状态机位置在1与2之间靠业务语义表达,数值上排在2后)
--
-- 本脚本只动 communion.constant 字典(改库即生效,零发版,零DDL:
--   constructionschedule.status 为 smallint,值3无需改表):
--   module=construction / clazz=constructionSchedule / type=status 字典
--   现有键0~14,其中键3~14为历史死值(老设计按工种编码状态的残留:
--   3砌墙/4铲大白/5放线/6力工/7水工/8电工/9瓦工/10地面找平/11木工/
--   12油工/13水电验收/14保洁)——生产 status 实际只有 0/1/2 三值
--   (54.9万/8.7万/166.3万行,2026-10-03只读库实测),Java/JS代码零引用
--   STATUS_WALLING_INT 等遗留常量。
--   ① 键3就地改写为"工费"(新状态),打印页立即可用;
--   ② 键4~14一并清理——它们正污染施工进度页"环节状态"筛选下拉
--     (条件组件 schedule-status 已同批改为写死0/1/2/3,不再读本字典)。
--
-- 🔴 字典语义重定义:本字典自本批起=环节状态机(0初始/1开工/2完工/3工费),
--   与节点再无关系。节点含义由两处按公司动态机制承载,勿再回填本字典:
--   · constant.decoration().decoration.projectStatus 镜像
--     (js/com/constant.js loadConstructionNodes:0/1/2固定+queryConstructionNode
--      按公司动态拼节点,键=cnid);
--   · 条件组件"工程状态"(decoration-projectStatus,appresult 0/1/2+动态节点)
--     与"施工节点"(schedule-node-cnid,queryConstructionNode按公司)。
--   实证碰撞(2026-10-03只读库):公司1沈阳方林节点cnid恰为3~13(铲大白3/
--   放线4/.../保洁13),与死字典键3~14错位——inspection.js进度列曾错拿本
--   字典查projectStatus(cnid),公司1长期显示错误节点名,已连带改用上述镜像。
--
-- ⚠️ 幂等:UPDATE/DELETE 按条件命中,重复执行零副作用。
-- ⚠️ 与发版无硬依赖:字典先改,旧版页面看 0/1/2 不受影响(值3出现前无展示);
--    新版页面+四jar(construction/salary/quotation/seiya)发版后全链生效。
--
-- 验证:
--   SELECT cid, field, `key`, value, name FROM communion.constant
--   WHERE module='construction' AND clazz='constructionSchedule' AND type='status'
--   ORDER BY `key`+0;
--   预期:仅 4 行 0初始(STATUS_INIT_INT)/1开工(STATUS_BEGIN_INT)/
--         2完工(STATUS_FINISH_INT)/3工费(STATUS_SALARY_INT)。
-- ============================================================================

-- 1. 键3 历史死值"砌墙"就地改写为"工费"
UPDATE communion.constant
SET field = 'STATUS_SALARY_INT', value = '工费', name = '工费(工程状态)'
WHERE module = 'construction' AND clazz = 'constructionSchedule' AND type = 'status'
  AND `key` = '3' AND value = '砌墙';

-- 2. 清理键4~14死值(工种残留,零数据零引用)
DELETE FROM communion.constant
WHERE module = 'construction' AND clazz = 'constructionSchedule' AND type = 'status'
  AND `key` IN ('4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14');
