/** app/js/quotation/quotationWhole.js —— 整装报价编辑扩展（配合 quotationPart.js 加载）
 *  移植旧 quotationWhole.js 的材料配比部分：主材配比列表（queryMaterialModel 选择 → 配比项），
 *  编辑主体（功能区/项/折扣/优惠/保存/打印）复用 quotationPart.js。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();

    setTimeout(function () {
        // 材料配比面板
        var $bar = $('<span id="wholeBar" style="margin-left:12px;"><\/span>');
        $bar.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="btnMaterial"><i class="layui-icon layui-icon-component"><\/i>材料配比<\/button>');
        $('#btnBack').before($bar);

        table.render({ elem: '#materialTable', data: [], page: false, limit: 1000, even: true, id: 'materialTable',
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'model', title: '型号', width: 160 },
                { field: 'brand', title: '品牌', width: 120 },
                { field: 'category', title: '品类', width: 100 },
                { field: 'price', title: '价格', width: 100, templet: function (d) { return quotationCommon.money(d.price); } },
                { field: 'num', title: '数量', width: 80, edit: 'text' },
                { title: '操作', width: 90, templet: function () { return '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除<\/button>'; } } ]] });

        $('#btnMaterial').on('click', function () {
            layer.open({ type: 1, title: '材料配比', content: $('#materialBox'), area: ['820px', '75%'] });
        });
    }, 600);
});
}); // end app.ready
