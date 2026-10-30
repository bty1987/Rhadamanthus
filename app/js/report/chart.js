/** app/js/report/chart.js —— 自定义图表大屏
 * queryChart({chart.type, chart.level}) → res.charts[]; 每个图配置含 api(点号 key)/no/param(附加参数 JSON)/method(渲染模式)。
 * 按 method 分别以 echarts(option)/number(数字卡)/table(列表) 渲染。param 中追加 company。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var lp = app.params.urlLoadParams || app.params || {};
    $('#chartType').val(lp.type != null ? lp.type : '');
    $('#chartLevel').val(lp.level != null ? lp.level : '');

    function getApi(o, props) { var p = props.shift(); if (!props.length) return o ? o[p] : undefined; return o && o[p] ? getApi(o[p], props) : undefined; }
    function getClazz(s) { try { return (s.split('-').pop().split(' ')[0].split('"')[0] | 0); } catch (e) { return 12; } }

    $('#btnSearch').on('click', render);

    function render() {
        var type = $.trim($('#chartType').val()), level = $.trim($('#chartLevel').val());
        app.post(api.data.queryChart, { 'chart.type': type, 'chart.level': level }, function (res) {
            var charts = res.charts || [];
            $('#customize').html('');
            $.each(charts, function (i, v) {
                var param = {}; try { param = JSON.parse(v.param || '{}'); } catch (e) { param = {}; }
                param.company = (app.params.company && app.params.company.cid) || '';
                var md = getClazz(v.clazz) < 6 ? 6 : 12;
                var sty = {}; try { sty = JSON.parse(v.style || '{}'); } catch (e) { sty = {}; }
                var height = (sty.height || '400px');
                $('#customize').append('<div class="layui-col-md' + md + '"><div class="layui-card"><div class="layui-card-header">' + (v.name || v.no) + '</div><div class="layui-card-body" id="box_' + v.no + '" style="height:' + height + ';overflow:auto;"></div></div></div>');
                var ep = getApi(api, (v.api || '').split('.'));
                if (ep == null) { $('#box_' + v.no).html('<div style="padding:20px;color:#999;">接口未定义: ' + v.api + '</div>'); return; }
                app.post(ep, param, function (r) {
                    var option = (r && r.option) ? r.option : r;
                    if (v.method == 'number') { renderNumber('box_' + v.no, option); }
                    else if (v.method == 'table') { renderTable('box_' + v.no, r.title, option); }
                    else { try { echarts.init($('#box_' + v.no)[0]).setOption(option || {}); } catch (e) { $('#box_' + v.no).html('<div style="padding:20px;color:#999;">渲染失败</div>'); } }
                });
            });
        });
    }

    function renderNumber(id, options) {
        var html = '<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;height:100%;">';
        $.each(options || [], function (i, o) { html += '<div style="margin:20px;text-align:center;"><div style="font-size:42px;color:#01AAED;font-weight:bold;">' + o.value + '</div><h5>' + o.key + '</h5></div>'; });
        html += '</div>'; $('#' + id).html(html);
    }
    function renderTable(id, title, options) {
        var html = title ? '<h4 style="margin:0 0 10px;color:#01AAED;">' + title + '</h4>' : '';
        html += '<div>';
        $.each(options || [], function (i, o) { html += '<div style="padding:6px 0;border-bottom:1px dashed #eee;"><span style="color:#666;">' + o.key + '</span><span style="float:right;color:#01AAED;">' + o.value + '</span></div>'; });
        html += '</div>'; $('#' + id).html(html);
    }

    render();
});
});
