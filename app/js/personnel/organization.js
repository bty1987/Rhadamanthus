/** organization.js —— 组织架构（左侧部门树 + 右侧按 no 过滤的员工列表） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery', 'tree'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, currentNo: null, deptList: [] };

    loadDeptTree();
    initTable();

    function loadDeptTree() {
        app.post(api.communion.queryDepartment, {}, function (res) {
            state.deptList = res.deptList || [];
            renderTree();
        }, null, false);
    }

    function renderTree() {
        var dids = {};
        $.each(state.deptList, function (i, v) { dids[v.did] = true; });
        // 构建两级树（按 fatherDept）
        var nodes = [];
        var byDid = {};
        $.each(state.deptList, function (i, v) {
            if (v.fatherDept == null || v.fatherDept.did == null || v.fatherDept.did == 0) {
                nodes.push(v);
            }
        });
        $.each(nodes, function (i, n) { collectChildren(n); });

        function collectChildren(node) {
            node.children = [];
            $.each(state.deptList, function (j, v) {
                if (v.fatherDept && v.fatherDept.did == node.did) { node.children.push(v); collectChildren(v); }
            });
        }

        var html = '<ul style="list-style:none;padding-left:8px;">';
        $.each(nodes, function (i, n) { html += renderNode(n, 0); });
        html += '</ul>';
        $('#deptTreeBox').html(html);
        $('#deptTreeBox .dept-node').on('click', function (e) {
            e.stopPropagation();
            var no = $(this).attr('data-no');
            state.currentNo = no;
            $('#deptTreeBox .dept-node').css('background', '');
            $(this).css('background', '#e6f7ff');
            query(1);
        });
    }

    function renderNode(n, level) {
        var pad = level * 16;
        var html = '<li><div class="dept-node" data-did="' + n.did + '" data-no="' + (n.no || '') + '" style="padding:4px 8px;cursor:pointer;border-radius:3px;">' + n.name + '</div>';
        if (n.children && n.children.length) {
            html += '<ul style="list-style:none;padding-left:' + (pad + 8) + 'px;">';
            $.each(n.children, function (i, c) { html += renderNode(c, level + 1); });
            html += '</ul>';
        }
        html += '</li>';
        return html;
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 100 },
                { field: 'loginId', title: '用户名', width: 120 },
                { field: 'userName', title: '姓名', width: 120 },
                { field: 'dept', title: '部门', width: 160, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'role', title: '角色', width: 120, templet: function (d) { return d.role ? d.role.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140 } ]] });
    }

    function query(page) {
        if (!state.currentNo) { table.reload('resultTable', { data: [] }); return; }
        state.page = page || 1;
        app.post(api.personel.pageUser, {
            'paging.page': state.page, 'paging.rows': state.rows,
            'filters[0].field': 'no', 'filters[0].data': state.currentNo, 'filters[0].op': 'eq'
        }, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }
});
}); // end app.ready
