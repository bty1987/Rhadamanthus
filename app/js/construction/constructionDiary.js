/** app/js/construction/constructionDiary.js —— 施工日志（进离场记录 + 图片管理）
 *  行按钮：图片（queryConstructionDiaryDrawingByCdid 图库 + addConstructionDiaryDrawing 上传 +
 *  deleteConstructionDiaryDrawing 删除）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var nodeMap = constructionCommon.loadNodeMap();
    var pageConfig = constructionCommon.getPageConfig('constructionDiary');
    var state = { page: 1, rows: 10, total: 0, current: null };

    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstructionDiary;
    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 130, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'atttype', title: '类型', width: 90, templet: function (d) { return constructionCommon.badge(E.diaryAtttype, d.atttype); } },
            { field: 'cnid', title: '工程状态', width: 100, templet: function (d) { var t = constructionCommon.projectStatusName(nodeMap, d.cnid); return t != '' ? t : '-'; } },
            { field: 'isUpload', title: '是否上传图片', width: 110, templet: function (d) { return constructionCommon.badge(E.diaryIsUpload, d.isUpload); } },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
            { field: 'content', title: '内容', minWidth: 220 },
            { field: 'createTime', title: '创建时间', width: 165 },
            { title: '操作', width: 120, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'picture' && btnVisible('picture')) {
            state.current = obj.data;
            manageDrawing(obj.data.cdid);
        }
    });

    // —— 图库 ——
    function manageDrawing(cdid) {
        $('#constructionDrawing').html('');
        app.post(api.construction.queryConstructionDiaryDrawingByCdid, { 'constructionDiaryDrawing.cdid': cdid }, function (res) {
            $.each(res.constructionDiaryDrawings || [], function (i, v) {
                appendGallery(v);
            });
        }, null, false);
        layer.open({ type: 1, title: '施工日志图片 - ' + (state.current.decoration ? state.current.decoration.orderId : ''), content: $('#drawingBox'), area: ['760px', '70%'] });
        bindUpload();
    }

    function appendGallery(value) {
        var $li = $('<li id="gallery_li' + value.cddid + '"><\/li>').appendTo($('#constructionDrawing'));
        var $img = $('<img>').appendTo($li);
        app.showImg($img, value.drawingUrl, 130, 130, '');
        $img.on('click', function () {
            layer.photos({ photos: { data: [{ src: /^[a-z]+:\/\//.test(value.drawingUrl) ? value.drawingUrl : (app.config.media + value.drawingUrl) }] }, anim: 5 });
        });
        $('<div class="tools">删除<\/div>').on('click', function () {
            app.post(api.construction.deleteConstructionDiaryDrawing, { 'constructionDiaryDrawing.cddid': value.cddid }, function () {
                $('#gallery_li' + value.cddid).remove();
                query(state.page);
            });
        }).appendTo($li);
    }

    // —— 上传 ——
    function bindUpload() {
        var v = state.current;
        app.uploadImage({
            elem: '#constructionUpload',
            multiple: true,
            done: function (data) {
                app.post(api.construction.addConstructionDiaryDrawing, {
                    'constructionDiaryDrawing.cid': v.cid,
                    'constructionDiaryDrawing.csid': v.csid,
                    'constructionDiaryDrawing.cdid': v.cdid,
                    'constructionDiaryDrawing.cnid': v.cnid,
                    'constructionDiaryDrawing.drawingName': data.strutsUploadsFileName || '',
                    'constructionDiaryDrawing.drawingUrl': data.resUrl,
                    'constructionDiaryDrawing.drawingAddUrl': data.resUrl,
                    'constructionDiaryDrawing.filesize': data.filesize,
                    'constructionDiaryDrawing.cuid': v.cuid,
                    'constructionDiaryDrawing.type': 0,
                    'constructionDiaryDrawing.schedule': v.schedule
                }, function (res) {
                    appendGallery(res.constructionDiaryDrawing || {});
                    query(state.page);
                });
            }
        });
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
