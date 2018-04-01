jQuery(function ($) {
    $('#AARPopUp').css({
        'margin': '0 auto',
        'margin-top': '3%',
        'width': '97%',
        'max-height': '500px',
        'overflow': 'hidden',
        'overflow-y': 'scroll'
    });
    $('#AARPopUp').parent().css({
        'overflow':'hidden'
    })

    var manifest = {
        mid: $('#AARPopUp').attr('data-mid'),
        status: $('#AARPopUp').attr('data-status'),
        mtype: 2,
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            customerName: $("#customer"),
            des: $("#comment"),
        },
        record: {},

    };

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '150px', 'margin-top': '12px'}).text('退货');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '8px', 'margin-top': '12px'}).text('取消');

    var $condList1 = $('#AARPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');

    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:73%;"></div>');

    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        var _params = {};
        var $menus = $('input[type="checkbox"]:checked', '#list');
        var $miid = [];

        if (!$menus.length) {
            layer.msg('请选择需要退货的商品!', {icon: 2});
            return;
        }

        $.each($menus, function (i, v) {
            var $v = $(v);
            var aarNum = $v.parents("div.line-wrap.order").next().find('.aarNum input').val();
            $v.attr('data-aarNum', aarNum);
            $miid.push([$v.attr('data-miid'), $v.attr('data-gid'), $v.attr('data-cid'), $v.attr('data-fid'), $v.attr('data-shId'), $v.attr('data-num'), $v.attr('data-aarNum'), $v.attr('data-comment')]);
        });
        $menus.length && $menus.each(function (i) {
            _params["manifestItems[" + i + "].miId"] = $miid[i][0];
            _params["manifestItems[" + i + "].num"] = $miid[i][6];//– 数量

        });

        var mid = manifest.mid;
        var status = manifest.status;
        var type = manifest.mtype;//– 类型
        var comment = $('#comment').val();//– 备注

        var options = {
            "manifest.mid": mid,
            "manifest.status": status,
            "manifest.comment": comment
        };

        options = $.extend(options, _params);

        if (checkRowValue($menus.parents("li.line")) && $menus.length > 0) {
            com.post(api.inventory.addManifestForCR, options, function (data) {
                layer.closeAll();
                layer.msg('保存成功!', {icon: 1});
                $('#list').empty();
            }, function (e) {
                com.showAlert(com.error, e.errorMsg);
            });
        }
    });

    $btnCancel.click(function () {
        layer.closeAll();
    });

    //添加一个空行
    function addline(lineindex, data) {

        var $line = $('<li></li>').addClass('line');
        var $label = $('<label></label>').addClass('control-label').css({
            'color': '#478fca !important',
            'font-size': '17px'
        });

        var _label = $('<label></label>');

        var $input = $('<input style="width: 0px">').attr({
            "type": "checkbox",
            "data-miid": data[lineindex - 1].miId,
            "data-gid": data[lineindex - 1].goods.gid,
            "data-cid": data[lineindex - 1].color.cid,
            "data-fid": data[lineindex - 1].format.fid,
            "data-shId": data[lineindex - 1].instorehouse.shId,
            "data-num": data[lineindex - 1].num,
            "data-comment": data[lineindex - 1].comment
        }).addClass('ace ace-checkbox-2');

        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

        _label.append($input).append(_span).appendTo($label)


        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').html($label).attr({
            "type": "checkbox",
            "data-miid": data[lineindex - 1].miId,
            "data-gid": data[lineindex - 1].goods.gid,
            "data-cid": data[lineindex - 1].color.cid,
            "data-fid": data[lineindex - 1].format.fid,
            "data-shId": data[lineindex - 1].instorehouse.shId,
            "data-num": data[lineindex - 1].num,
            "data-comment": data[lineindex - 1].comment
        }));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var _lineInfoSet = [
            {cellClass: "no blue"},//编号
            {cellClass: "name grey"},//名称
            {cellClass: "color grey"},//颜色
            {cellClass: "format grey"},//规格
            {cellClass: "measurementUnit grey"},//单位
            {cellClass: "storehouse grey"},//仓库
            {cellClass: "number blue"},//数量
            {cellClass: "pieceNum blue"},//件数
            {cellClass: "aarNum", hasInput: !0},
            {cellClass: "des grey"},//备注
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;

    }

    function accessoriesAdd() {
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryManifestItemByMid, {
            "manifest.mid": manifest.mid
        }, function (res) {
            for (var i = 0; i < res.manifestItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index, res.manifestItems);
            }

            function autoAddline(index, data) {
                index = $('.line', '#list').length;
                addline(1 + index, data).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr({
                    'data-gid': res.manifestItems[i].goods.gid,
                    'data-miid': res.manifestItems[i].miId,
                    'data-cid': res.manifestItems[i].color.cid,
                    'data-fid': res.manifestItems[i].format.fid,
                    'data-shId': res.manifestItems[i].instorehouse.shId,
                });
                $lineInfoWrap1.find('div.no').text(res.manifestItems[i].goods.no);
                $lineInfoWrap1.find('div.name').text(res.manifestItems[i].goods.name);
                $lineInfoWrap1.find('div.measurementUnit').text(res.manifestItems[i].goods.measurementUnit);
                $lineInfoWrap1.find('div.color').text(res.manifestItems[i].color.name);
                $lineInfoWrap1.find('div.format').text(res.manifestItems[i].format.info);
                $lineInfoWrap1.find('div.storehouse').attr('data-storehouse', res.manifestItems[i].instorehouse.shId).text(res.manifestItems[i].instorehouse.name);
                $lineInfoWrap1.find('div.number').text(res.manifestItems[i].num);
                $lineInfoWrap1.find('div.pieceNum').text(res.manifestItems[i].goods.pieceNum);
                $lineInfoWrap1.find('div.des').text(res.manifestItems[i].comment == null ? "" : res.manifestItems[i].comment);
            }

        });

    }

    accessoriesAdd();

    function checkRowValue($line) {
        var flag = true;
        $.each($line, function (i, v) {
            var aarNum = $(v).find('.aarNum input');
            var num = $(v).find('.number').text();
            var flagNum = parseInt(aarNum.val()) > parseInt(num) ? true : false;
            var numRex = /^\d+$/;
            if (!(numRex.test(aarNum.val()) && parseFloat(aarNum.val()) > 0) || flagNum) {
                aarNum.focus().select();
                aarNum.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "top",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "数量输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                aarNum.popover('destroy');
            }
        });

        return flag;
    }
});
