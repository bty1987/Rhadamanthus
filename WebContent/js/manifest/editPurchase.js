/**
 * Created by Administrator on 2017/4/23 0023.
 */


jQuery(function ($) {

    com.focusPage('#editPopUp').css({'height': '100%', 'margin': 0});

    var purchase = {
        pid: com.focusPage('#editPopUp').attr('data-pid'),
        purchaseItems: {
            pid: com.focusPage("#pId")
        },
        record: {},
        validator: {
            num: {
                type: "v_num",
                regex: /^[0-9]*[1-9][0-9]*$/,
                errorMsg: "数量输入内容格式错误"
            },
            selling: {
                type: "v_selling",
                regex: /^(\d+|\d+\.[0-9]{1,4})$/,
                errorMsg: "单价输入内容格式错误"
            }
        }
    };

    $.extend(com.validator, purchase.validator);

    var $btnSave = $('<a></a>').addClass('btn btn-info').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '120px', 'margin-top': '12px'}).text('保存');

    var $btnCancel = $('<a></a>').addClass('btn gray').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '17px', 'margin-top': '12px'}).text('取消');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:73%;"></div>');
    var $condList1 = com.focusPage('#editPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    $div.append($btnSave).append($btnCancel).appendTo($condList1);

    //创建表头
    addline('', [
        {value: '商品编号'},
        {value: '商品名称'},
        {value: '商品类别'},
        {value: '品牌'},
        {value: '单位'},
        {value: '颜色'},
        {value: '规格'},
        {value: '采购单价'},
        {value: '数量'},
        {value: '件数'}
    ], !0).appendTo('#title');

    //获取采购单信息
    com.post(api.inventory.queryPurchaseByPid, {"purchase.pid": purchase.pid}, function (res) {

        com.focusPage('#no').text(res.purchase.no);                            //– 采购单编号
        com.focusPage('[name="date"]', '#form').val(res.purchase.createTime);  //– 创建时间

        com.focusPage('#comment').val(res.purchase.comment);                   //– 说明

    });


    //获取采购单下采购项
    function getPurchaseItem() {
        com.focusPage('#list').empty();
        com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": purchase.pid}, function (res) {
            $.each(res.purchaseItems, function (i, v) {
                //添加一条空行
                addline(i + 1, getLineInfoSet(v)).addClass('current').attr({
                    'data-pid': v.pid,
                    'data-piid': v.piId
                }).appendTo(com.focusPage('#list'));
            });

        });
    }

    getPurchaseItem();

    //添加一条空行
    com.focusPage('#addPurchase').click(function () {
        if(com.validate('list')){
            return;
        }
        var num = com.focusPage('ul#list .line').length;
        var returnFlag = false;
        var $lines = com.focusPage('.line', '#list');
        $lines.each(function () {
            var $this = $(this);
        });
        if (returnFlag) return;

        var $line = addlineC(num + 1);
        $line.appendTo(com.focusPage('#list'));

    });

    //关闭弹窗
    $btnCancel.click(function () {
        layer.closeAll();
    });


    //表单提交
    $btnSave.click(function () {
        if(com.validate('list')){
            return;
        }
        var options = {};

        var $lines = com.focusPage('li.line', '#list');
        if (!checkInfo()) return;
        if (!$lines.length) {
            layer.msg('请填写商品');
            return;
        }

        var returnFlag = false;
        $lines.each(function () {
            var $this = $(this);
        });

        if (returnFlag) return;


        if (purchase.totalSum < 0) {
            layer.msg("当前录入采购单总数小于0", {time: 3000});
            return false;
        }

        var comment = com.focusPage('#comment').val();                      //– 说明

        options = {
            "purchase.pid": purchase.pid,
            "purchase.comment": comment
        };

        var btn = $(this);
        btn.button('loading');

        com.post(api.inventory.updatePurchase, options, function (res) {
            btn.button('reset');
            layer.closeAll();
            layer.msg('保存成功!', {icon: 1});
            com.focusPage('#list').empty();
            com.focusPage('[name="date"]', '#form').val(null);
            com.focusPage('#comment').val(null);
        }, function (e) {
            btn.button('reset');
            com.showAlert(com.error, e.errorMsg);
        });

    });

    //处理采购单项信息
    function getLineInfoSet(v) {

        var _lineInfoSet = [];

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "no blue", value: v ? v.goods.no : null};                          //商品编号

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "name grey", value: v ? v.goods.name : null};                       //商品名称

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "category grey", value: v ? v.goods.category : null};               //商品类别

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "brand grey", value: v ? v.goods.brand : null};                     //品牌

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "measurementUnit grey", value: v ? v.goods.measurementUnit : null}; //单位

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "color grey", value: v ? v.color.name : null};                      //颜色

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "format grey", value: v ? v.format.info : null};                    //规格

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "unitPrice", hasInput: !0, value: v ? v.unitPrice : null};   //单价

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "number", hasInput: !0, value: v ? v.num : null};                //数量

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "pieceNum blue", value: v ? v.goods.pieceNum : null};               //件数

        return _lineInfoSet;
    }

    //添加一个空行
    function addlineC(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "no blue"},                         //商品编号
            {cellClass: "name grey", hasInput: !0},        //商品名称
            {cellClass: "category grey"},                   //商品类别
            {cellClass: "brand grey"},                      //品牌
            {cellClass: "measurementUnit grey"},            //单位
            {cellClass: "color grey", hasSelectColor: !0},    //颜色
            {cellClass: "format grey", hasSelectFormat: !0},  //规格
            {cellClass: "unitPrice", hasInput: !0},   //采购单价
            {cellClass: "number", hasInput: !0},         //数量
            {cellClass: "pieceNum blue"}                   //件数
        ];

        var $btncheck = $('<a id="trueBtn" class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                if(v.cellClass == "name"){
                    $input.addClass('v_required');
                }
                if(v.cellClass == "unitPrice"){
                    $input.addClass('v_selling');
                }
                if(v.cellClass == "number"){
                    $input.addClass('v_num');
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

        $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({
                    "goods.name": query,
                    "goods.pinyin": query,
                    "goods.no": query
                }, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data['goodes'];
                this.flprocess(this.options.list, 'gid', 'name');
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                //k: key, v:value
                var list = this.options.list;
                $.each(list, function (index, val) {
                    if (val.gid == k) {
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.name input').val(val.name);
                        $lineInfoWrap.find('.category').text(val.category);
                        $lineInfoWrap.find('.brand').text(val.brand);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-pgid', val.gid);
                        $line.attr('data-gid', val.gid + "_" + lineindex);
                        com.post(api.inventory.queryColorForEnableByGid, {
                            "color.gid": val.gid
                        }, function (res) {
                            com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .color select').bindData(res.colors, "cid", "name");
                        });
                        com.post(api.inventory.queryFormatForEnableByGid, {
                            "format.gid": val.gid
                        }, function (res) {
                            com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .format select').bindData(res.formats, "fid", "info");
                        });
                    }
                });

                return v;
            }

        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            e.stopPropagation();
            if(com.validate('list','bottom')){
                return;
            }
            var dataDivDom = $(this).parent().parent().prev()[0];
            //校验新增输入
            //if (checkRowValue($line)) {
                //插入新采购项后，改变新增采购项单元格样式
            var btn = $(this);
            if ($(dataDivDom.childNodes[1]).find("input").length != 0) {
                addPurchaseItem($line, dataDivDom, btn);
            }

        });


        $btndel.click(function (e) {
            e.stopPropagation();
            var btn = $(this);
            layer.confirm('确定要删除吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (indexo, layero) {
                $line.remove();
                reorder();
                if ($line.attr('data-piid')) {
                    com.post(api.inventory.deletePurchaseItem, {
                        "purchase.pid": $line.attr('data-pid'),
                        "purchaseItem.piId": $line.attr('data-piid')
                    }, function () {
                    }, function () {
                        layer.msg('操作失败', {icon: 2});
                        getPurchaseItem()
                    });
                }

                layer.close(indexo);
            });

        });

        return $line;

    }

    //添加一行
    function addline(lineindex, _lineInfoSet, titleFlag) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell').addClass(v.cellClass == undefined ? "" : v.cellClass);

            if (!v.hasInput && !v.hasSelect) {
                $cell.text(v.value ? v.value : '');
            }

            if (v.hasInput) {
                $input = $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').val(v.value ? v.value : null);
                v.readonly && $input.attr('readonly', true);
                if(v.cellClass == "unitPrice"){
                    $input.addClass('v_selling');
                }
                if(v.cellClass == "number"){
                    $input.addClass('v_num');
                }
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $lineInfoWrap.find('.no input').length && $lineInfoWrap.find('.no input').typeahead({
            url: api.inventory.queryGoodsByNo,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({"goods.no": query}, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data['goodes'];
                this.flprocess(this.options.list, 'gid', 'no');
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                //k: key, v:value
                var list = this.options.list;
                $.each(list, function (index, val) {
                    if (val.gid == k) {
                        $lineInfoWrap.find('.name').text(val.name);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-gid', val.gid);
                    }
                });

                return v;
            }

        });

        $lineInfoWrap.find('.name input').length && $lineInfoWrap.find('.name input').typeahead({
            url: api.inventory.queryGoodsByName,
            list: [],
            postData: {},
            source: function (query, process) {
                var params = $.extend({
                    "goods.name": query,
                    "goods.pinyin": query,
                    "goods.no": query
                }, this.options.postData);
                com.post(this.options.url, params, $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data['goodes'];
                this.flprocess(this.options.list, 'gid', 'name');
            },
            isResultTypeMap: true
            , flupdater: function (k, v) {
                //k: key, v:value
                var list = this.options.list;
                $.each(list, function (index, val) {
                    if (val.gid == k) {
                        $lineInfoWrap.find('.no').text(val.no);
                        $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                        $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                        $line.attr('data-gid', val.gid);
                    }
                });

                return v;
            }

        });


        if (!titleFlag) {
            var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
            var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
            $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

            $btncheck.click(function (e) {
                e.stopPropagation();
                if(com.validate('list','bottom')){
                    return;
                }

                var btn = $(this);
                updatePurchaseItem($line, btn);

            });

            $btndel.click(function (e) {
                e.stopPropagation();
                var btn = $(this);
                layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function (indexo, layero) {
                    $line.remove();
                    reorder();
                    if ($line.attr('data-piid')) {
                        com.post(api.inventory.deletePurchaseItem, {
                            "purchase.pid": $line.attr('data-pid'),
                            "purchaseItem.piId": $line.attr('data-piid')
                        }, function () {
                        }, function () {
                            layer.msg('操作失败', {icon: 2});
                            getPurchaseItem();

                        });
                    }
                    layer.close(indexo);
                }, function () {
                    btn.button('reset');
                });

            });
        } else {
            $optWrap.append($('<div></div>').addClass('cell option').html('操作'));
        }
        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        return $line;

    }

    //校验一行
    function checkRowValue($line) {

        var flag = true;

        var num = $line.find('.number input');
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

        var unitPrice = $line.find('.unitPrice input');
        var unitPriceRex = /^(\d+|\d+\.[0-9]{1,4})$/;
        if (!(unitPriceRex.test(unitPrice.val()) && parseFloat(unitPrice.val()) > 0)) {
            unitPrice.focus().select();
            unitPrice.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "单价输入内容格式错误!"
            }).popover('show');
            flag = false;
        } else {
            unitPrice.popover('destroy');
        }


        var des = $line.find('.des input');
        if (des.val() && des.val().length > 128) {
            des.focus().select();
            des.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "备注信息长度需要小于128!"
            }).popover('show');
            flag = false;
        } else {
            des.popover('destroy');
        }
        return flag;
    }

    //重排序
    function reorder() {
        var $list = com.focusPage('.line', '#list');
        $list.length && $list.each(function (i) {
            var $this = $(this);
            $this.find('.index').text(i + 1);
        });
    }

    //校验日期
    function checkInfo() {

        var flag = true;

        var date = com.focusPage('[name="date"]', '#form');
        if (!date.val()) {
            date.focus().select();

            date.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "请选择日期"

            }).popover('show');

            flag = false;
        } else {
            date.popover('destroy');
        }

        return flag;

    }

    function updatePurchaseItem($line, btn) {
        var params = {
            "purchase.pid": purchase.pid,
            "purchaseItem.piId": $line.attr('data-piid'),
            "purchaseItem.num": $line.find('.number input').val(),
            "purchaseItem.unitPrice": $line.find('.unitPrice input').val()
        };
        if(com.validate('list', 'bottom')){
            return;
        }
        com.post(api.inventory.updatePurchaseItem, params, function (res) {
            btn.button('reset');
            layer.msg('修改成功', {icon: 1, time: 800});
        }, function (e) {
            btn.button('reset');
            com.showAlert(com.error, e.errorMsg);
        });
    }

    function addPurchaseItem($line, dataDivDom, btn) {
        var params = {
            "purchase.pid": purchase.pid,
            "purchaseItem.piId": $line.attr('data-piid'),
            "purchaseItem.goods.gid": $line.attr('data-pgid'),
            "purchaseItem.color.cid": $line.find('.color select').val(),
            "purchaseItem.format.fid": $line.find('.format select').val(),
            "purchaseItem.unitPrice": $line.find('.unitPrice input').val(),
            "purchaseItem.num": $line.find('.number input').val()
        };
        com.post(api.inventory.addPurchaseItem, params, function (data) {
            btn.button('reset');
            layer.msg('新增成功!', {icon: 1}, function () {
            });
            com.focusPage(dataDivDom.childNodes[1]).html(com.focusPage(dataDivDom.childNodes[1]).find("input").val());
            com.focusPage(dataDivDom.childNodes[5]).html(com.focusPage(dataDivDom.childNodes[5]).find("option:selected").text());
            com.focusPage(dataDivDom.childNodes[6]).html(com.focusPage(dataDivDom.childNodes[6]).find("option:selected").text());
        }, function (e) {
            btn.button('reset');
            com.showAlert(com.error, e.errorMsg);
        });
    }

});
