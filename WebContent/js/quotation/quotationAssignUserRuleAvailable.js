$(function() {

    // ==================== 页面元素声明 ====================

    var $company = com.focusPage('#availCompany');
    var $department = com.focusPage('#availDepartment');
    var $decorationType = com.focusPage('#availDecorationType');
    var $searchBtn = com.focusPage('#availSearchBtn');
    var $resultList = com.focusPage('#availResultList');
    var $emptyTip = com.focusPage('#availEmptyTip');

    // 状态映射
    var statusMap = {
        1: '可用',
        2: '制作中',
        3: '停止'
    };

    // 装修类型映射
    var typeMap = {
        '-1': '通用',
        '0': '半包',
        '1': '整装'
    };

    // ==================== 初始化下拉框 ====================

    // 初始化公司下拉框
    com.post(api.system.queryCompany, {}, function(res) {

        if (res.companys && res.companys.length > 0) {
            $company.bindData(res.companys, "cid", "name", true);
        }
    }, null, false);

    // 公司变化 → 联动部门
    $company.on('change', function() {

        var cid = $(this).val();

        $department.empty().append('<option value="">全部部门</option>');

        if (cid) {
            com.post(api.communion.queryDepartment, {
                "department.company.cid": cid
            }, function(res) {

                if (res.deptList && res.deptList.length > 0) {
                    $department.bindData(res.deptList, "did", "name", true);
                }
            }, null, false);
        }
    });

    // ==================== 查询按钮事件 ====================

    $searchBtn.on('click', function() {

        var company = $company.val();

        if (!company) {
            com.showAlert(com.warning, '请选择公司');
            return;
        }

        var params = {
            "company": company
        };

        var department = $department.val();
        if (department) {
            params["department"] = department;
        }

        var decorationType = $decorationType.val();
        if (decorationType !== '') {
            params["decorationType"] = decorationType;
        }

        com.post(api.quotation.queryQuotationAssignUserRuleForAvaile, params, function(res) {

            renderResult(res.quotationAssignUserRules || []);

        }, function(err) {

            $resultList.empty().append('<div class="alert alert-danger">查询失败，请重试。</div>');
        });
    });

    // ==================== 结果渲染 ====================

    function renderResult(rules) {

        $resultList.empty();

        if (!rules || rules.length === 0) {
            $resultList.append('<div class="alert alert-warning"><i class="icon-warning-sign"></i> 未找到符合条件的可分配预算员。</div>');
            return;
        }

        var $table = $('<table class="table table-striped table-bordered table-hover" style="margin-top:10px;"></table>');
        var $thead = $('<thead><tr>' +
            '<th class="center" style="width:40px;">序号</th>' +
            '<th>预算员</th>' +
            '<th>状态</th>' +
            '<th>当前任务</th>' +
            '<th>最后完成时间</th>' +
            '<th>创建时间</th>' +
            '</tr></thead>');
        var $tbody = $('<tbody></tbody>');

        $.each(rules, function(i, rule) {

            var user = rule.user || {};
            var statusText = statusMap[rule.status] || '未知';
            var statusClazz = rule.status == 1 ? 'label-success' : (rule.status == 3 ? 'label-danger' : 'label-warning');

            var $row = $('<tr></tr>');
            $row.append('<td class="center">' + (i + 1) + '</td>');
            $row.append('<td><span class="blue">' + (user.currentName || '-') + '</span></td>');
            $row.append('<td><span class="label ' + statusClazz + '">' + statusText + '</span></td>');
            $row.append('<td>' + (rule.currentTaskCount || 0) + '</td>');
            $row.append('<td class="green">' + (rule.lastFinishTime || '-') + '</td>');
            $row.append('<td class="green">' + (rule.createTime || '-') + '</td>');

            $tbody.append($row);
        });

        $table.append($thead).append($tbody);
        $resultList.append($table);

        // 显示统计信息
        var $info = $('<div class="well well-sm" style="margin-top:10px;">共找到 <strong class="blue">' + rules.length + '</strong> 位可分配预算员</div>');
        $resultList.append($info);
    }

    // ==================== 初始状态 ====================

    $emptyTip.show();

});
