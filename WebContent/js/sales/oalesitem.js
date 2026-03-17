jQuery(function($) {

    var oalesitem = {

        // 页面参数
        oid: null,  // 外销单ID

        // 分页参数
        page: {
            pageNo: 1,
            pageSize: 20,
            total: 0
        }
    };

    // 从URL参数获取外销单ID
    var urlParams = com.getUrlParams();
    if (urlParams.oid) {
        oalesitem.oid = urlParams.oid;
    } else if (params.urlLoadParams && params.urlLoadParams.oid) {
        oalesitem.oid = params.urlLoadParams.oid;
    }

    // 如果没有外销单ID，提示错误
    if (!oalesitem.oid) {
        com.showAlert(com.error, '缺少外销单ID参数');
        return;
    }

    // 初始化查询条件
    var conditions = [];
    var options = {};

    // 查询条件配置
    com.initCondition('sales-oalesItem', oalesitem.page, conditions, options, function() {
        // 初始化完成后加载列表
        loadList();
    });

    /**
     * 加载外销项列表
     */
    function loadList() {
        com.showLoading('正在加载...');

        var params = {};

        // 添加外销单ID过滤
        if (oalesitem.oid) {
            params['oalesItem.oid'] = oalesitem.oid;
        }

        com.post(api.sales.pageOalesItem, {
            filters: com.getFilters(conditions, options),
            paging: oalesitem.page
        }, function(res) {
            com.hideLoading();

            // 渲染列表
            renderList(res.oalesItems);

            // 更新分页
            oalesitem.page.total = res.page.total;
            com.pagination('pagenation', oalesitem.page, loadList);
        }, function(res) {
            com.hideLoading();
            com.showAlert(com.error, res.errorMsg || '加载失败');
        });
    }

    /**
     * 渲染外销项列表
     */
    function renderList(list) {
        var html = '';

        if (!list || list.length === 0) {
            html = '<tr><td colspan="9" class="text-center">暂无数据</td></tr>';
        } else {
            $.each(list, function(index, item) {
                html += '<tr>';
                html += '<td>' + (index + 1) + '</td>';  // 序号
                html += '<td>' + (item.name || '') + '</td>';  // 商品名称
                html += '<td>' + (item.format || '') + '</td>';  // 规格
                html += '<td>' + (item.color || '') + '</td>';  // 颜色
                html += '<td>' + (item.model || '') + '</td>';  // 型号
                html += '<td>' + com.formatMoney(item.price / 1000, 3) + '</td>';  // 价格（元）
                html += '<td>' + item.num + '</td>';  // 数量
                html += '<td>' + com.formatMoney(item.total / 1000, 3) + '</td>';  // 小计（元）
                html += '<td>' + (item.comment || '') + '</td>';  // 备注
                html += '<td>';
                html += '  <button class="btn btn-xs btn-danger deleteBtn" data-oiid="' + item.oiid + '">删除</button>';
                html += '</td>';
                html += '</tr>';
            });
        }

        com.focusPage('#resultList').html(
            '<table class="table table-striped table-bordered table-hover">' +
            '  <thead>' +
            '    <tr>' +
            '      <th width="50">序号</th>' +
            '      <th>商品名称</th>' +
            '      <th>规格</th>' +
            '      <th>颜色</th>' +
            '      <th>型号</th>' +
            '      <th>价格（元）</th>' +
            '      <th>数量</th>' +
            '      <th>小计（元）</th>' +
            '      <th>备注</th>' +
            '      <th width="80">操作</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>' + html + '</tbody>' +
            '</table>'
        );
    }

    /**
     * 删除外销项
     */
    com.focusPage('#resultList').on('click', '.deleteBtn', function() {
        var oiid = $(this).data('oiid');

        com.showConfirm('确认删除该外销项吗？', function() {
            com.showLoading('正在删除...');

            com.post(api.sales.deleteOalesItem, {
                'oalesItem.oiid': oiid
            }, function(res) {
                com.hideLoading();
                com.showAlert(com.info, '删除成功');
                loadList();  // 重新加载列表
            }, function(res) {
                com.hideLoading();
                com.showAlert(com.error, res.errorMsg || '删除失败');
            });
        });
    });

    /**
     * 导出外销项
     */
    com.exportExcel = function() {
        var params = {};

        // 添加外销单ID过滤
        if (oalesitem.oid) {
            params['oalesItem.oid'] = oalesitem.oid;
        }

        // 添加查询条件
        var filters = com.getFilters(conditions, options);
        $.each(filters, function(key, value) {
            params[key] = value;
        });

        // 构建导出URL
        var url = config.server + 'exportOalesItem.do?';
        url += $.param(params);
        url += '&authentication=' + window.authentication;

        // 下载文件
        window.location.href = url;
    };
});
