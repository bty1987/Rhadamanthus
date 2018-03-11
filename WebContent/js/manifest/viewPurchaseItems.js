/**
 * Created by Administrator on 2017/4/20.
 */
jQuery(function ($) {

    $('#viewPurchaseItemsPopUp').css({
        'margin': '0 auto',
        'margin-top': '3%',
        'width': '97%',
        'max-height': '500px',
        'overflow': 'hidden',
        'overflow-y': 'scroll'
    });

    var purchase = {
        createTime: $('#viewPurchaseItemsPopUp').attr('data-createTime'),
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            des: $("#comment"),
        },
        record: {},

    };

    //获得仓库
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        })

        purchase.storehouses = storehousesStatus;

    }, null, false);


    var $btnConfirm = $('<a></a>').addClass('btn btn-info btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '120px', 'margin-top': '12px'}).text('入库');


    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '17px', 'margin-top': '12px'}).text('取消');
    var $condList1 = $('#viewPurchaseItemsPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:77%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        savePurchaseChange();
    });

    //选择框操作
    function savePurchaseChange() {

        var options = {};

        var $list = $('input[type="checkbox"]:checked', "#list");
        var flag = false;
        $.extend(options,params["purchases.pids"]);
        $list.length && $list.each(function (i) {

            var $this = $(this);
            var surplus = parseInt($(this).parents('div.line-wrap.order').next().find('.surplus').text()) - parseInt($(this).parents('div.line-wrap.order').next().find('.rnum input').val());
            var rnum = $(this).parents('div.line-wrap.order').next().find('.rnum input').val();
            var ishid = $(this).parents('div.line-wrap.order').next().find('.storehouse select').val();

            if (surplus < 0) {
                flag = false;
                return false;
            } else if (surplus >= 0) {

                options["purchaseItems[" + i + "].piId"] = $(this).parents('li.line').attr('data-piid');
                options["purchaseItems[" + i + "].storehouse.shId"] = ishid;
                options["purchaseItems[" + i + "].num"] = rnum;
                flag = true;
            }

            if ($this.parents('li.line').attr('data-cid') == null || $this.parents('li.line').attr('data-fid') == null || ishid == null) {
                flag = false;
            }
        });

        if ($list.length != 0 && flag) {

            if (checkRowValue($list)) {
                com.post(api.inventory.addManifestForPU, options, function (data) {

                    layer.closeAll();
                    layer.msg("入库成功", {icon: 1});
                    $('#list').empty();
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                });
            }

        } else if ($list.length != 0 && !flag) {
            layer.msg('入库数量不正确!');
        } else {
            layer.msg('请选择入库商品!');
        }
    }


    //取消按钮
    $btnCancel.click(function () {
        layer.closeAll();
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');

        var _label = $('<label></label>');

        var $input = $('<input>').attr({
            "type": "checkbox",
        }).css('width', '0px').addClass('ace ace-checkbox-2');

        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

        _label.append($input).append(_span)

        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').html(_label));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');
        var _lineInfoSet = [
            {cellClass: "no blue"},                          //编号
            {cellClass: "name grey"},                        //名称
            {cellClass: "category grey"},                    //类别
            {cellClass: "brand grey"},                       //品牌
            {cellClass: "measurementUnit grey"},             //单位
            {cellClass: "color grey"},                       //颜色
            {cellClass: "format grey"},                      //规格
            {cellClass: "unitPrice blue"},                   //单价
            {cellClass: "number blue"},                         //总数量
            {cellClass: "surplus blue"},                     //剩余数量
            {cellClass: "storehouse", hasSelect: !0},   //仓库
            {cellClass: "rnum", hasInput: !0},         //入库数量
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(purchase.storehouses, "shId", "name");
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;

    }


    function purchaseAdd() {
        var _params = params.pids;
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryPurchaseItemByPids, _params, function (res) {
            for (var i = 0; i < res.purchaseItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index);
            }

            function autoAddline(index) {
                index = $('.line', '#list').length;
                addline(1 + index).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr('data-gid', res.purchaseItems[i].goods.gid).attr('data-cid', res.purchaseItems[i].color.cid).attr('data-fid', res.purchaseItems[i].format.fid).attr('data-piid', res.purchaseItems[i].piId);
                $lineInfoWrap1.find('div.no').text(res.purchaseItems[i].goods.no);
                $lineInfoWrap1.find('div.name').text(res.purchaseItems[i].goods.name);
                $lineInfoWrap1.find('div.category').text(res.purchaseItems[i].goods.category);
                $lineInfoWrap1.find('div.brand').text(res.purchaseItems[i].goods.brand);
                $lineInfoWrap1.find('div.measurementUnit').text(res.purchaseItems[i].goods.measurementUnit);
                $lineInfoWrap1.find('div.unitPrice').text(res.purchaseItems[i].unitPrice);
                $lineInfoWrap1.find('div.color').text(res.purchaseItems[i].color.name);
                $lineInfoWrap1.find('div.format').text(res.purchaseItems[i].format.info);
                $lineInfoWrap1.find('div.number').text(res.purchaseItems[i].num);
                $lineInfoWrap1.find('div.surplus').text(res.purchaseItems[i].surplus);

            }

        });

    }

    purchaseAdd();

    function checkRowValue($line) {

        var flag = true;

        $.each($line, function (i, v) {
            var num = $(v).parents('li').find('.rnum input');

            var numRex = /^\d+$/;
            if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "top",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "数量输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        });

        return flag;
    }
});
