$(function() {

	    var QREC = constant.quotation().quotationAssignRecord;

	    // ==================== 页面元素声明 ====================
    var config = {
        modals: {},
        items: {},
        btns: {},
        plugins: {},
        lists: {},

        data: {
            keyword: null
        }
    };

    // 初始化 Searcher
    var searcher = new Searcher();

    // 基础配置
    searcher.base("condList", // 条件容器
    "pagenation", // 分页容器
    "resultList", // 结果容器
    api.quotation.pageQuotationAssignRecord // API 接口
    );

    // 查询条件
    searcher.condition(["assign-record-company", "assign-record-user", "assign-record-orderId"]);

    // 顶部按钮（无操作按钮）
    searcher.button(function() {
        return [];
    });

    // 列表行配置
    var lineprops = [{
        field: "qarid",
        name: "多选",
        type: "checkbox",
        prop: "qarid"
    }, {
        field: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "company",
        name: "公司",
        prop: function(v) {

            // 从公司ID获取公司名称
            return v.company ? v.company.name : "未知";
        },
        clazz: "grey"
    }, {
        field: "department",
        name: "部门",
        prop: function(v) {

            // 部门ID为NULL表示该公司所有部门
            return v.department ? v.department.name : "所有部门";
        },
        clazz: "grey"
    }, {
        field: "decorationType",
        name: "装修类型",
        prop: function(v) {

	            return QREC.decorationType.keys[v.decorationType] || "未知";
        },
        clazz: "grey"
    }, {
        field: "budgetUser",
        name: "预算员",
        prop: function(v) {

            return v.budgetUser ? v.budgetUser.currentName : "未知";
        },
        clazz: "blue"
    }, {
        field: "assignType",
        name: "分配方式",
        prop: function(v) {

	            return QREC.assignType.keys[v.assignType] || "未知";
        },
        clazz: function(v) {

            return v.assignType == QREC.ASSIGN_TYPE_FORWARD_AUTO_INT || v.assignType == QREC.ASSIGN_TYPE_REVERSE_AUTO_INT ? "green" : "blue";
        }
    }, {
        field: "assignTime",
        name: "分配时间",
        prop: "assignTime",
        clazz: "grey"
    }, {
        field: "finishTime",
        name: "完成时间",
        prop: function(v) {

            return v.finishTime || "-";
        },
        clazz: "grey"
	    }, {
	        field: "assignResult",
	        name: "状态",
	        prop: function(v) {
	            return QREC.assignResult.keys[v.assignResult] || "未知";
	        },
	        clazz: function(v) {
	            return v.assignResult == QREC.ASSIGN_RESULT_SUCCESS_INT ? "green" : "grey";
	        }
	    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "grey"
    }];

    // 行按钮（只有查看详情按钮）
    var linebtns = [{
        name: "查看详情",
        clazz: "btn-info",
        handle: function(v) {

            viewRecordDetail(v);
            return false;
        }
    }];

    // 配置行
    searcher.line(lineprops, linebtns);

    // 渲染列表
    searcher.render();

    // ==================== 查看详情 ====================

    // 查看分配记录详情
    function viewRecordDetail(row) {

        com.post(api.quotation.queryQuotationAssignRecordById, {
            "quotationAssignRecord.qarid": row.qarid
        }, function(res) {

            if (res.quotationAssignRecord) {
                var record = res.quotationAssignRecord;

                // 构建详情HTML
                var html = '<div class="row">';
                html += '<div class="col-xs-12">';
                html += '<table class="table table-bordered table-striped">';

                html += '<tbody>';
                html += '<tr><th style="width: 150px;">装修单号</th><td>' + (record.orderId || '-') + '</td></tr>';
                html += '<tr><th>公司</th><td>' + (record.company ? record.company.name : '-') + '</td></tr>';
                html += '<tr><th>部门</th><td>' + (record.department ? record.department.name : '所有部门') + '</td></tr>';
html += '<tr><th>装修类型</th><td>' + (QREC.decorationType.keys[record.decorationType] || '未知') + '</td></tr>';
	                html += '<tr><th>预算员</th><td>' + (record.budgetUser ? record.budgetUser.currentName : '-') + '</td></tr>';
	                html += '<tr><th>分配方式</th><td>' + (QREC.assignType.keys[record.assignType] || '未知') + '</td></tr>';
                html += '<tr><th>分配时间</th><td>' + (record.assignTime || '-') + '</td></tr>';
                html += '<tr><th>完成时间</th><td>' + (record.finishTime || '-') + '</td></tr>';

	                html += '<tr><th>状态</th><td>' + (QREC.assignResult.keys[record.assignResult] || '未知') + '</td></tr>';

                html += '<tr><th>备注</th><td>' + (record.remark || '-') + '</td></tr>';
                html += '<tr><th>创建时间</th><td>' + (record.createTime || '-') + '</td></tr>';
                html += '</tbody>';

                html += '</table>';
                html += '</div>';
                html += '</div>';

                // 显示详情弹窗
                bootbox.dialog({
                    title: '分配记录详情',
                    message: html,
                    buttons: {
                        close: {
                            label: '关闭',
                            className: 'btn-default'
                        }
                    }
                });
            }
        });
    }

})
