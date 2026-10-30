/**
 * app/js/api/_template.js —— 新模块 API 定义样板
 *
 * ★ 复制本文件改名为你的模块（如 mytask.js），全局把 "template" 替换为模块名即可。
 *   api 定义结构对齐旧 WebContent/js/api/*.js，app.initApi 会自动载入。
 *
 * api 对象结构：
 *   api.index.<pageId> = { url }                       页面路由（菜单跳转用）
 *   api.<module>.<action> = { url, demo?, type?, tranargs?, cache?, server?, intercept?, loading? }
 *
 * 金额精度（重要）：
 *   金额/数量字段后端以"毫"（×1000）存储，需在 api 条目用 tranargs 声明：
 *     - type:'update' 的接口：请求时前端元×1000（app.post 自动）
 *     - type:'query' 的接口：响应时后端毫÷1000（app.post 自动）
 *   未声明 tranargs 的字段需页面手动 app.utils.accMul(x,1000) / accDiv(x,1000)。
 */

// ============ 页面路由（菜单 mid 对应这里） ============
$.extend(api.index, {
    templateIndex:  { url: 'views/template/list.html' },
    templateDetail: { url: 'views/template/form.html' }
});

// ============ 接口定义 ============
$.extend(api, {
    template: {

        // 分页查询：返回 { paging: { data, totalRecords, totalPage, page, rows } }
        pageTemplate: {
            url: 'pageTemplate.do',
            demo: true
        },

        // 不分页查询
        queryTemplate: {
            url: 'queryTemplate.do',
            demo: true
        },

        // 单条查询（按 id）—— 演示 query 类金额精度转换
        queryTemplateById: {
            url: 'queryTemplateById.do',
            type: 'query',
            tranargs: [{ result: 'template', args: ['price'] }]
        },

        // 新增 —— 演示 update 类金额精度转换（请求 price ×1000）
        addTemplate: {
            url: 'addTemplate.do',
            type: 'update',
            tranargs: { args: ['template.price'] },
            validate: { 'template.name': { required: true } }
        },

        // 修改
        updateTemplate: {
            url: 'updateTemplate.do',
            type: 'update',
            tranargs: { args: ['template.price'] },
            validate: { 'template.id': { required: true }, 'template.name': { required: true } }
        },

        // 删除
        deleteTemplate: {
            url: 'deleteTemplate.do',
            validate: { 'template.id': { required: true } }
        }
    }
});
