/** app/js/report/rank.js —— 业绩排行榜（类型 × 范围 组合）
 * 组合 query{Type}{Scope}Rank：Decoration/MaterialDesigner × ''/Department/Region。
 * 数据项为排名条目，展示 编号 + 名称（兼容 designer.currentName / designerName / name）。 */
app.ready(function () {
layui.use(['form', 'jquery'], function () {
    var form = layui.form, $ = layui.jquery;

    // 类型/范围 → URL 片段映射（构造 api.report 的 key）
    var TYPE = { Decoration: 'Decoration', MaterialDesigner: 'MaterialDesigner', Zaterial: '' };
    var SCOPE = { Designer: '', Department: 'Department', Region: 'Region' };
    var NAME = { Designer: ['designer.currentName', 'designerName', 'name'], Department: ['depte.name', 'designerDeptName', 'name'], Region: ['region.name', 'designerRegionName', 'name'] };

    form.render('select');
    $('#btnSearch').on('click', queryRankInfo);
    $('#rankType,#rankRegion').on('change', queryRankInfo);

    function getName(v, candidates) {
        for (var i = 0; i < candidates.length; i++) {
            var parts = candidates[i].split('.'), val = v;
            for (var j = 0; j < parts.length; j++) { val = val ? val[parts[j]] : undefined; }
            if (val) return val;
        }
        return '-';
    }

    function queryRankInfo() {
        var type = $('#rankType').val(), scope = $('#rankRegion').val();
        var key = 'query' + TYPE[type] + SCOPE[scope] + 'Rank';
        var ep = api.report[key];
        $('#rankInfo').html('');
        if (!ep) { $('#rankInfo').html('<div class="layui-col-md12"><div class="layui-bg-gray" style="padding:30px;text-align:center;">无可用数据提供</div></div>'); return; }
        app.post(ep, {}, function (res) {
            var ranks = res.ranks || [];
            if (!ranks.length) { $('#rankInfo').html('<div class="layui-col-md12"><div class="layui-bg-gray" style="padding:30px;text-align:center;">无可用数据提供</div></div>'); return; }
            var length = ranks.length, lineNum = Math.ceil(length / 3), cols;
            if (length > 50) {
                insertTable('layui-col-md4', 1, ranks.slice(0, lineNum), scope);
                insertTable('layui-col-md4', lineNum + 1, ranks.slice(lineNum, lineNum * 2), scope);
                insertTable('layui-col-md4', 2 * lineNum + 1, ranks.slice(lineNum * 2), scope);
            } else {
                insertTable('layui-col-md4 layui-col-md-offset4', 1, ranks, scope);
            }
        });
    }

    function insertTable(colxs, index, data, scope) {
        var cands = NAME[scope], html = '<div class="' + colxs + '"><table class="layui-table" lay-size="sm"><tbody>';
        for (var i = 0; i < data.length; i++) {
            html += '<tr><td style="width:60px;">' + (index + i) + '</td><td>' + getName(data[i], cands) + '</td></tr>';
        }
        html += '</tbody></table></div>';
        $('#rankInfo').append(html);
    }

    queryRankInfo();
});
});
