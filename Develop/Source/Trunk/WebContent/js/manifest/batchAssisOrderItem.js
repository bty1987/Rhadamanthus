/**
 * Created by Administrator on 2017/4/19.
 */
/**
 * Created by Administrator on 2016/9/23 0023.
 */


jQuery(function ($) {
    $('#shipmentPopUp').css({
        'margin': '0 auto',
        'margin-top': '3%',
        'width': '97%',
        'max-height': '500px',
        'overflow': 'hidden',
        'overflow-y': 'scroll'
    });

    var assisOrder = {
        createTime: $('#shipmentPopUp').attr('data-createTime'),
        mtype: 7,
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            customerName: $("#customer"),
            des: $("#comment"),
        },
        record: {},

    };

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {

        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        })

        assisOrder.storehouses = storehousesStatus;
    }, null, false);

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '50px', 'margin-top': '12px'}).text('出货');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({'name': 'cancelbtn', 'href': 'javascript:void(0);'}).css({'margin-left': '3px', 'margin-top': '12px'}).text('取消');
    var $condList1 = $('#shipmentPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:83%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        if(com.validate('shipmentPopUp'))
            return;


        var options = {};

        var manifestTime = assisOrder.createTime;//– 货单时间
        var type = assisOrder.mtype;//– 类型
        var comment = $('#comment').val();//– 备注

        options = {
            "manifest.manifestTime": manifestTime,
            "manifest.total": "0",
            "manifest.type": type,
            "manifest.comment": comment,
            "manifest.attachment": "",//– 附件路径
        };

        options = $.extend(options, params.aoids);

        var $list = $('li.line', '#list');
        $list.length && $list.each(function (i) {
            var $this = $(this);


            options["manifestItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["manifestItems[" + i + "].color.cid"] = $this.find('.color select').val();//– 商品编号
            options["manifestItems[" + i + "].format.fid"] = $this.find('.format select').val();//– 商品名

            options["manifestItems[" + i + "].outstorehouse.shId"] = $this.find('.storehouse select').val();//– 仓库ID

            options["manifestItems[" + i + "].num"] = $this.find('.number').text();//– 数量
            options["manifestItems[" + i + "].unitPrice"] = "0";//– 进货价
            options["manifestItems[" + i + "].comment"] = $this.find('.des input').val();// – 说明

        });


        com.post(api.inventory.addManifestForAS, options, function (data) {
            layer.closeAll();
            layer.msg('保存成功!', {icon: 1}, function () {
                $('#list').empty();
            });
        }, function (e) {
            com.showAlert(com.info, e.errorMsg);
        });
    });

    $btnCancel.click(function () {
        layer.closeAll();
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col8');
        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name"},//名称
            {cellClass: "color", hasColorSelect: !0},//颜色
            {cellClass: "format", hasFormatSelect: !0},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "storehouse", hasSelect: !0},//仓库
            {cellClass: "number"},//数量
            {cellClass: "des", hasInput: !0},//备注
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            if (v.hasSelect) {
                var $select = $('<select class="v_required"></select>');
                $select.bindData(assisOrder.storehouses, "shId", "name");
                $cell.append($select);
            }

            if (v.hasColorSelect) {
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            if (v.hasFormatSelect) {
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;

    }

    function assisOrderAdd() {
        var _params = params.aoids;
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryAssisOrderItemByAoids, _params, function (res) {
            for (var i = 0; i < res.assisOrderItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index, i, res);
            }


        });

    }

    assisOrderAdd();

    function autoAddline(index, i, res) {
        index = $('.line', '#list').length;
        addline(1 + index).appendTo('#list');
        var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
        $('#list li:nth-of-type(' + (index + 1) + ')').attr({'data-gid': res.assisOrderItems[i].goods.gid});
        $lineInfoWrap1.find('div.no').text(res.assisOrderItems[i].goods.no);
        $lineInfoWrap1.find('div.name').text(res.assisOrderItems[i].goods.name);
        $lineInfoWrap1.find('div.measurementUnit').text(res.assisOrderItems[i].goods.measurementUnit);
        $lineInfoWrap1.find('div.number').text(res.assisOrderItems[i].num);

        com.post(api.inventory.queryColorForEnableByGid, {
            "color.gid": res.assisOrderItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.color select').bindData(data.colors, "cid", "name");
        })
        com.post(api.inventory.queryFormatForEnableByGid, {
            "format.gid": res.assisOrderItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.format select').bindData(data.formats, "fid", "info");
        })

    }
});
