$(function () {

    var goodsSuit = {
        'flag': true,
    };

    var _goodsPackage = params['goods'];

    var $btnConfirm = $('<a></a>').addClass('btn btn-info').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css('margin-left', '85%').text('添加');

    var $btnCancel = $('<a></a>').addClass('btn').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css('margin-left', '10px').text('取消');
    var $condList1 = $('#fl-container .layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-7%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    function addlinePackge(data, cid, colorName, fid, formatInfo, num) {

        var $line = $('<li></li>').addClass('line').attr({
            'data-gid': data.gid,
            'data-cid': cid,
            'data-fid': fid,
            'data-num': num
        });
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index'));//.text('')
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no blue", value: data.no},//编号
            {cellClass: "name grey", value: data.name},//名称
            {cellClass: "barcode grey", value: data.barcode},//条形码
            {cellClass: "category grey", value: data.category},//品类
            {cellClass: "brand grey", value: data.brand},//品牌
            {cellClass: "color grey", value: colorName},//颜色
            {cellClass: "format grey", value: formatInfo},//规格
            {cellClass: "measurementUnit grey", value: data.measurementUnit},//单位
            {cellClass: "number blue", value: num},//数量
            {cellClass: "status red", value: data.status == 0 ? '启用' : '禁用'}//状态
        ];
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass).text(v.value);

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btndel.click(function (e) {
            $(this).parents('.line.current').remove();
        });

        return $line;

    }

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: !0},//名称
            {cellClass: "barcode"},//条形码
            {cellClass: "category"},//品类
            {cellClass: "brand"},//品牌
            {cellClass: "color", hasSelectColor: !0},//颜色
            {cellClass: "format", hasSelectFormat: !0},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "accessoriesTypeName"},//辅类
            {cellClass: "number", hasInput: !0},//数量
            {cellClass: "status"}//状态
        ];
        var $btncheck = $('<a class="color-green green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $select;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_required');
                if (v.cellClass == "name") {
                    $input.addClass('v_required');
                }
                if (v.cellClass == "number") {
                    $input.addClass('v_number');
                }
                $cell.append($input);
            }
            if (v.hasSelectColor) {
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }
            if (v.hasSelectFormat) {
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        com.initTypeahead(".name input", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
            $.each(list, function (index, val) {
                if (val.gid == k) {
                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.barcode').text(val.barcode);
                    $lineInfoWrap.find('.category').text(val.category);
                    $lineInfoWrap.find('.brand').text(val.brand).attr('data-bid', val.bid);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $lineInfoWrap.find('.accessoriesTypeName').text(val.accessoriesType.name == null ? "" : val.accessoriesType.name);
                    $lineInfoWrap.find('.status').text(val.status == "0" ? "启用" : "禁用");
                    $line.attr({'data-gid': val.gid, 'data-type': val.type});
                    com.post(api.data.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        if (res.colors.length != 0) {
                            goodsSuit.flag = true;
                            com.focusPage('li[data-gid="' + val.gid + '"] .color select').bindData(res.colors, "cid", "name");
                        } else {
                            goodsSuit.flag = false;
                            com.showAlert(com.warning, '该商品暂无颜色信息,请录入')
                        }

                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    });

                    com.post(api.data.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        if (res.formats.length != 0) {
                            goodsSuit.flag = true;
                            com.focusPage('li[data-gid="' + val.gid + '"] .format select').bindData(res.formats, "fid", "info");
                        } else {
                            goodsSuit.flag = false;
                            com.showAlert(com.warning, '该商品暂无规格信息,请录入')
                        }

                    }, function (e) {
                        com.showAlert(com.error, e.errorMsg);
                    })
                }
            });

            return v;
        });

        $btncheck.click(function (e) {
            e.stopPropagation();
            if (com.validate('addGoodsPackage', 'bottom')) {
                return;
            }
            var gid = $(this).parents('li.line.current').attr('data-gid');
            var cid = $(this).parents('li.line.current').find('.color select').val();
            var colorName = $(this).parents('li.line.current').find('.color select option:selected').text();
            var fid = $(this).parents('li.line.current').find('.format select').val();
            var formatInfo = $(this).parents('li.line.current').find('.format select option:selected').text();
            var num = $(this).parents('li.line.current').find('.number input').val();
            if (checkRowValue($line)) {
                com.post(api.data.queryGoodsByGId, {
                    'goods.gid': gid
                }, function (data) {
                    com.focusPage('#list').empty();
                    addline(1).addClass('current');
                    addlinePackge(data.goods, cid, colorName, fid, formatInfo, num).addClass('current').appendTo('#showList');
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                })
            }

        });

        $btndel.click(function (e) {

            com.focusPage('#list').empty();

            addline(1).addClass('current');

        });

        return $line;

    }

    addline(1).addClass('current');

    function checkRowValue($line) {

        var flag = true;

        var bid = $line.find('.brand').attr('data-bid');

        if (bid != _goodsPackage['goods.bid']) {
            com.showAlert(com.warning, "品牌不一致");
            flag = false;
        }

        var type = $line.attr('data-type');

        if (type != 0) {
            com.showAlert(com.warning, "不可添加套餐商品");
            flag = false;
        }

        return flag;
    }

    $btnConfirm.click(function (e) {
        e.stopPropagation();
        var _option = {};

        $.extend(_option, params.goods);

        var packageList = com.focusPage('#showList', '#goodsSuitPopUp').find('li');
        $.each(packageList, function (i, v) {
            var _this = $(v);
            _option["goodsPackages[" + i + "].goods.gid"] = _this.attr('data-gid');
            _option["goodsPackages[" + i + "].color.cid"] = _this.attr('data-cid');
            _option["goodsPackages[" + i + "].format.fid"] = _this.attr('data-fid');
            _option["goodsPackages[" + i + "].num"] = _this.attr('data-num')
        });

        if (packageList.length == 0) {
            com.showAlert(com.warning, "请添加套餐商品");
            return false;
        }

        com.post(api.data.addPackage, _option, function () {

            com.showAlert(com.info, "操作成功");

            com.focusPage('#showList').empty();
            com.focusPage('#list').empty();
        });
    });

    $btnCancel.click(function () {
        com.closePopup();
    });

});