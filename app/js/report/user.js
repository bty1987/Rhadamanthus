/** app/js/report/user.js —— 人员结构统计（library 代理 → echarts）
 * urlLoadParams.company="all" → 全员报表（company/status/jobYears/gender/education）
 * 否则 → 按公司报表（deptType/duty/status/jobYears/dept/education）。mongo=communion。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var lp = app.params.urlLoadParams || app.params || {};
    var company = (app.params.company && app.params.company.cid) || '';
    var all = lp.company == 'all';

    function addBox(id, md) { $('#reportDiv').append('<div class="layui-col-md' + (md || 6) + '"><div id="' + id + '" style="height:500px;"></div></div>'); }
    function lib(id, apiKey, extra) {
        var data = $.extend({ api: apiKey, mongo: 'communion' }, extra || {});
        app.postRaw({ url: 'library' }, data, function (res) {
            var option = (res && res.option) ? res.option : res;
            try { echarts.init($('#' + id)[0]).setOption(option || {}); } catch (e) { console.error(id, e); }
        });
    }

    if (all) {
        [['company', 'user.report.total4group'], ['status', 'user.report.status4group'],
         ['jobYears', 'user.report.servicelength4group'], ['gender', 'user.report.gender4group'],
         ['education', 'user.report.education4group']
        ].forEach(function (it) { addBox(it[0], 6); lib(it[0], it[1], {}); });
    } else {
        var ex = { company: company };
        [['deptType', 'user.report.departmenttype4company'], ['duty', 'user.report.duty4company'],
         ['status', 'user.report.status4company'], ['jobYears', 'user.report.servicelength4company'],
         ['dept', 'user.report.department4company'], ['education', 'user.report.education4company']
        ].forEach(function (it, i) { addBox(it[0], i == 4 ? 12 : (i == 5 ? 12 : 6)); lib(it[0], it[1], ex); });
    }
});
});
