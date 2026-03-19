$(function() {

    var config = {
        qacid: null
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base(
        "condList",                                // 条件容器
        "pagenation",                              // 分页容器
        "resultList",                              // 结果容器
        api.quotation.pageQuotationAssignConfig     // API 接口
    );

    // 查询条件
    searcher.condition([
        "quotation-assign-config-company",
        "quotation-assign-config-enabled"
    ]);

    // 操作按钮（暂时留空，后续添加）
    searcher.button(function() {
        return [];
    });

    // 列表行配置
    var lineprops = [{
        field: "qacid",
        name: "多选",
        type: "checkbox",
        prop: "qacid"
    }, {
        field: "companyVO",
        name: "公司",
        prop: "companyVO.name",
        clazz: "blue"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {
            // 部门ID为NULL表示该公司所有部门
            return v.department ? (v.departmentVO ? v.departmentVO.name : "未知部门") : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "enabled",
        name: "启用状态",
        prop: function(v) {
            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignConfig.enabled.datas[v.enabled];
        },
        clazz: function(v) {
            return v.enabled == 1 ? "green" : "red";
        }
    }, {
        field: "autoAssign",
        name: "分配方式",
        prop: function(v) {
            // 使用 constant 进行枚举转换
            return constant.quotation().quotationAssignConfig.autoAssign.datas[v.autoAssign];
        },
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "grey"
    }, {
        field: "updateTime",
        name: "更新时间",
        prop: "updateTime",
        clazz: "grey"
    }];

    // 行按钮（暂时留空，后续添加编辑、删除等）
    var linebtns = [];

    // 渲染列表（标题显示 "companyVO.name"）
    searcher.line("companyVO.name", lineprops, linebtns).render();

})
