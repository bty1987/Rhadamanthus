/** app/js/quotation/functionAreaCategory.js —— 功能区-品类规格（弹窗页）
 *  品类下拉(queryCategory 全局字典)添加关联；品类卡片下规格行(规格/公司/备注)行内增删改；
 *  移除品类级联删规格。数据链:functionareacategory(uk faid+cid) → functionareaformat(facid)。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();

    var faid = (app.params.data || {}).functionArea ? app.params.data.functionArea.faid : 0;
    var state = { categorys: [] };

    form.on('select(categorySel)', function () {});

    app.post(api.data.queryCategory, {}, function (res) {
        state.categorys = res.categorys || [];
        var $sel = $('#categoryId');
        $sel.empty().append($('<option value="">请选择品类</option>'));
        $.each(state.categorys, function (i, c) {
            $sel.append($('<option></option>').attr('value', c.cid).text(c.name));
        });
        form.render('select');
    }, null, false);

    $('#btnAddCategory').on('click', function () {
        var cid = $('#categoryId').val();
        if (!cid) { app.showAlert(app.warning, '请选择品类'); return; }
        app.post(api.quotation.addFunctionAreaCategory, { 'functionAreaCategory.faid': faid, 'functionAreaCategory.cid': cid }, function () {
            app.showAlert(app.success, '操作成功');
            load();
        });
    });

    function load() {
        app.post(api.quotation.queryFunctionAreaCategoryByFaid, { 'functionAreaCategory.faid': faid }, function (res) {
            render(res.functionAreaCategorys || []);
        });
    }

    function esc(s) { return (s == null ? '' : String(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function render(categorys) {
        var $list = $('#categoryList').empty();

        $.each(categorys, function (i, c) {
            var $card = $('<div class="layui-card" style="margin-bottom:10px;"><\/div>').appendTo($list);
            var $head = $('<div class="layui-card-header"><\/div>').appendTo($card);
            $head.append($('<strong><\/strong>').text(c.categoryName)).append(' ');
            $('<button class="layui-btn layui-btn-xs layui-btn-danger"><i class="layui-icon layui-icon-delete"><\/i>移除<\/button>').appendTo($head).on('click', function () {
                layer.confirm('移除品类将同时删除其下规格,是否确认?', function (idx) {
                    layer.close(idx);
                    app.post(api.quotation.deleteFunctionAreaCategory, { 'functionAreaCategory.fcid': c.fcid }, function () {
                        app.showAlert(app.success, '操作成功');
                        load();
                    });
                });
            });

            var $body = $('<div class="layui-card-body"><\/div>').appendTo($card);
            var $table = $('<table class="layui-table" style="margin:0;"><thead><tr><th>规格<\/th><th>公司<\/th><th>备注<\/th><th style="width:130px;">操作<\/th><\/tr><\/thead><tbody><\/tbody><\/table>').appendTo($body);
            var $tbody = $table.find('tbody');

            $.each(c.formats, function (j, f) {
                var $tr = $('<tr><\/tr>').appendTo($tbody);
                var $fmt = $('<input class="layui-input" maxlength="64">').val(esc(f.format));
                var $cpn = $('<input class="layui-input" maxlength="64">').val(esc(f.company));
                var $cmt = $('<input class="layui-input" maxlength="128">').val(esc(f.comment));
                $('<td style="width:25%;"><\/td>').append($fmt).appendTo($tr);
                $('<td style="width:25%;"><\/td>').append($cpn).appendTo($tr);
                $('<td style="width:30%;"><\/td>').append($cmt).appendTo($tr);
                var $op = $('<td><\/td>').appendTo($tr);
                $('<button class="layui-btn layui-btn-xs layui-btn-warm"><\/button>').text('保存').css('margin-right', '4px').appendTo($op).on('click', function () {
                    if (!$.trim($fmt.val())) { app.showAlert(app.warning, '规格不能为空'); return; }
                    app.post(api.quotation.updateFunctionAreaFormat, {
                        'functionAreaFormat.ffid': f.ffid,
                        'functionAreaFormat.format': $.trim($fmt.val()),
                        'functionAreaFormat.company': $.trim($cpn.val()),
                        'functionAreaFormat.comment': $.trim($cmt.val())
                    }, function () { app.showAlert(app.success, '操作成功'); });
                });
                $('<button class="layui-btn layui-btn-xs layui-btn-danger"><\/button>').text('删除').appendTo($op).on('click', function () {
                    app.post(api.quotation.deleteFunctionAreaFormat, { 'functionAreaFormat.ffid': f.ffid }, function () {
                        app.showAlert(app.success, '操作成功');
                        load();
                    });
                });
            });

            var $addTr = $('<tr><\/tr>').appendTo($tbody);
            var $nfmt = $('<input class="layui-input" placeholder="规格" maxlength="64">');
            var $ncpn = $('<input class="layui-input" placeholder="公司" maxlength="64">');
            var $ncmt = $('<input class="layui-input" placeholder="备注" maxlength="128">');
            $('<td style="width:25%;"><\/td>').append($nfmt).appendTo($addTr);
            $('<td style="width:25%;"><\/td>').append($ncpn).appendTo($addTr);
            $('<td style="width:30%;"><\/td>').append($ncmt).appendTo($addTr);
            $('<button class="layui-btn layui-btn-xs"><\/button>').text('添加').appendTo($('<td><\/td>').appendTo($addTr)).on('click', function () {
                if (!$.trim($nfmt.val())) { app.showAlert(app.warning, '规格不能为空'); return; }
                app.post(api.quotation.addFunctionAreaFormat, {
                    'functionAreaFormat.fcid': c.fcid,
                    'functionAreaFormat.format': $.trim($nfmt.val()),
                    'functionAreaFormat.company': $.trim($ncpn.val()),
                    'functionAreaFormat.comment': $.trim($ncmt.val())
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    load();
                });
            });
        });
    }

    load();
});
}); // end app.ready
