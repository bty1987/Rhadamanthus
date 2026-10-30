/** app/js/report/decorationRank.js —— 装修业绩排名（按 paytype/type 展示多组排名）
 * urlLoadParams.type: 0设计/1业务/2主材/3总；paytype: region/depte/designer/(空=高级)。
 * 新前端无 typeahead，人员/部门/分区改为直接填 ID（与 buildingHouse4create 一致）。 */
app.ready(function () {
layui.use(['laydate', 'jquery'], function () {
    var laydate = layui.laydate, $ = layui.jquery;

    var lp = (app.params.urlLoadParams || app.params || {});
    var conf = { paytype: lp.paytype || '', type: lp.type != null ? lp.type : 0 };

    // type → 业绩字段/标题
    var achi, title;
    if (conf.type == 0 || conf.type == 1) { achi = 'rank'; title = '装修-'; }
    else if (conf.type == 2) { achi = 'sachi'; title = '主材-'; }
    else { achi = 'tachi'; title = '总业绩-'; }

    laydate.render({ elem: '#year', type: 'year', format: 'yyyy' });
    laydate.render({ elem: '#month', type: 'month', format: 'yyyy-MM' });

    $('#btnSearch').on('click', function () {
        if (app.validate('searchForm')) return;
        resultList();
    });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); });

    function vals() {
        return {
            month: $.trim($('#year').val()) + $.trim($('#month').val()),
            designer: $.trim($('#designer').val()),
            depte: $.trim($('#depte').val()),
            region: $.trim($('#region').val())
        };
    }

    // 取嵌套字段值
    function el(o, props) { var p = props.split('.'); for (var i = 0; i < p.length; i++) { o = o ? o[p[i]] : undefined; } return o || ''; }

    function rank(ep, name, list, v, cardTitle) {
        var opt = {};
        opt['decorationRank.month'] = v.month;
        opt['decorationRank.type'] = conf.type == 1 ? 1 : 0;
        if (v.designer) opt['decorationRank.designer.userId'] = v.designer;
        if (v.depte) opt['decorationRank.depte.did'] = v.depte;
        if (v.region) opt['decorationRank.region.did'] = v.region;
        app.post(ep, opt, function (res) {
            var ranks = res.ranks || [];
            ranks.sort(function (a, b) {
                return conf.type == 2 ? (b.sachi - a.sachi) : conf.type == 3 ? (b.tachi - a.tachi) : (b.rank - a.rank);
            });
            var html = '<div class="layui-col-md4"><div class="layui-card"><div class="layui-card-header">' + cardTitle + '</div><div class="layui-card-body layui-text" style="max-height:420px;overflow:auto;">';
            if (!ranks.length) { html += '<div style="padding:20px;text-align:center;color:#999;">无可用数据提供</div>'; }
            for (var i = 0; i < ranks.length; i++) {
                var r = ranks[i];
                html += '<div style="padding:6px 0;border-bottom:1px dashed #eee;"><b style="color:#01AAED;">' + el(r, name) + '</b>';
                $.each(list, function (idx, it) { html += '<span style="margin-left:12px;color:#666;">' + it[0] + el(r, it[1]) + '</span>'; });
                html += '</div>';
            }
            html += '</div></div></div>';
            $('#rankList').append(html);
        });
    }

    function resultList() {
        var v = vals();
        $('#rankList').html('');
        var regionProps = [['总业绩:', achi]];
        var deptProps = [['分区:', 'region.name'], ['总业绩:', achi]];
        var designerDeptProps = [['部门:', 'depte.name'], ['总业绩:', achi]];
        var designerRegionProps = [['分区:', 'region.name'], ['总业绩:', achi]];
        var designerAllProps = [['分区:', 'region.name'], ['部门:', 'depte.name'], ['总业绩:', achi]];

        var T = function (t) { return conf.type == 1 ? t.replace(title, '业务') : t; };

        if (conf.paytype == 'region') {
            rank(api.report.queryDecorationRegionRank, 'region.name', regionProps, v, T('分区排名'));
            rank(api.report.queryDecorationDepartmentRank, 'depte.name', deptProps, v, T('部门排名'));
            rank(api.report.queryDecorationRank, 'designer.currentName', designerRegionProps, v, T('人员排名'));
        } else if (conf.paytype == 'depte') {
            rank(api.report.queryDecorationRegionRank, 'region.name', regionProps, v, T('分区排名'));
            rank(api.report.queryDecorationDepartmentRank, 'depte.name', deptProps, v, T('部门排名'));
            rank(api.report.queryDecorationRank, 'designer.currentName', designerDeptProps, v, T('人员部门排名'));
        } else if (conf.paytype == 'designer') {
            rank(api.report.queryDecorationRank, 'designer.currentName', designerRegionProps, v, T('人员分区排名'));
            rank(api.report.queryDecorationRank, 'designer.currentName', designerDeptProps, v, T('人员部门排名'));
        } else {
            rank(api.report.queryDecorationDepartmentRank, 'depte.name', deptProps, v, T('部门排名'));
            rank(api.report.queryDecorationRank, 'designer.currentName', designerAllProps, v, T('人员全员排名'));
            rank(api.report.queryDecorationRegionRank, 'region.name', regionProps, v, T('分区排名'));
        }
    }

    resultList();
});
});
