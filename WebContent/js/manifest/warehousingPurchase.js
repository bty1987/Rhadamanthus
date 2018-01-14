jQuery(function ($) {

    $('#warehousingPopUp').css({'margin': '0 auto', 'margin-top': '3%', 'width': '97%','max-height':'500px','overflow':'hidden','overflow-y':'scroll'});

    var purchase = {
        pid: $('#warehousingPopUp').attr('data-pid'),
        mtype: 6,
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        purchaseItems: {
            pid: $("#pId"),
        },
        record: {},
    };

    var $btnSave = $('<a></a>').addClass('btn btn-info btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '120px', 'margin-top': '12px'}).text('入库');

    var $btnCancel = $('<a></a>').addClass('btn btn-grey btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '17px', 'margin-top': '12px'}).text('取消');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:73%;"></div>');
    var $condList1 = $('#warehousingPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    $div.append($btnSave).append($btnCancel).appendTo($condList1);

    var no = "";
    //获取采购单信息
    com.post(api.inventory.queryPurchaseByPid, {"purchase.pid": purchase.pid}, function (res) {

        $('#no').text(res.purchase.no);                            //– 采购单编号
        $('[name="date"]', '#form').val(res.purchase.createTime);  //– 创建时间
        no = res.purchase.no;
    });

    //获取仓库列表
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status==0){
                storehousesStatus.push(v);
            }
        })
        purchase.storehouses = storehousesStatus;
    }, null, false);

    //声明piId数组，用于接收所以采购项piId
    var $piId = [];

    //获取采购单下采购项
    function getPurchaseItem() {
        $('#list').empty();
        com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": purchase.pid}, function (res) {
            $.each(res.purchaseItems, function (i, v) {
                //添加一条空行
                addline(i + 1, getLineInfoSet(v)).addClass('current').attr({
                    'data-pid': v.pid,
                    'data-piid': v.piId,
                    'data-gid': v.goods.gid,
                    'data-cid': v.color.cid,
                    'data-fid': v.format.fid,
                    'data-unitPrice': v.unitPrice,
                }).appendTo('#list');
                $piId[i] = v.piId;
            });

        });
    };
    getPurchaseItem();

    //表单提交
    $btnSave.click(function () {
        saveOptionChange();
    });

    //关闭弹窗
    $btnCancel.click(function () {
        layer.closeAll();
    });


    //选择框操作
    function saveOptionChange() {

        var options = {
            "manifest.type": purchase.mtype,
            "manifest.comment": "",
            "manifest.attachment": "",//– 附件路径
            "pids[0]": purchase.pid,
        };
        var $menus = $('input[type="checkbox"]:checked', "#list");
        var flag = false;
        var rnum = "";
        var ishid = "";
        //options = $.extend(options,params.pids);
        $menus.length && $menus.each(function (i) {

            var surplus = parseInt($(this).parent().parent().parent().next().find('.surplus').text()) - parseInt($(this).parent().parent().parent().next().find('.rnum input').val());

            rnum = $(this).parent().parent().parent().next().find('.rnum input').val();

            ishid = $(this).parent().parent().parent().next().find('.storehouses select').val();

            if (surplus < 0) {
                flag = false;
                return false;
            } else if (surplus >= 0) {
                options["purchaseItems[" + i + "].piId"] = $(this).parent().parent().parent().parent().attr('data-piid');
                options["purchaseItems[" + i + "].surplus"] = surplus;
                flag = true;
            }

            options["manifestItems[" + i + "].goods.gid"] = $(this).parent().parent().parent().parent().attr('data-gid');     //商品ID
            options["manifestItems[" + i + "].color.cid"] = $(this).parent().parent().parent().parent().attr('data-cid');     //颜色ID
            options["manifestItems[" + i + "].format.fid"] = $(this).parent().parent().parent().parent().attr('data-fid');    //规格ID
            options["manifestItems[" + i + "].instorehouse.shId"] = ishid;                                           //入库仓库
            options["manifestItems[" + i + "].num"] = rnum;                                                          //– 数量
            options["manifestItems[" + i + "].unitPrice"] = $(this).parent().parent().parent().parent().attr('data-unitPrice');       //– 单价
            options["manifestItems[" + i + "].comment"] = "";                                                        // – 说明

        });


        if ($menus.length != 0 && flag ) {

            if(checkRowValue($menus)){
                com.post(api.inventory.addManifestForPU, options, function (data) {

                    layer.closeAll();
                    layer.msg("入库成功", {icon: 1});
                    $('#list').empty();
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                });
            }

        } else if (!flag && $menus.length != 0) {
            layer.msg('入库数量不正确!');
        } else {
            layer.msg('请选择入库商品!');
        }


    }


    //处理采购单项信息
    function getLineInfoSet(v) {

        var _lineInfoSet = [];

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "no", value: v ? v.goods.no : null};                           //商品编号

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "name", value: v ? v.goods.name : null};                       //商品名称

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "category", value: v ? v.goods.category : null};               //商品类别

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "brand", value: v ? v.goods.brand : null};                     //品牌

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "measurementUnit", value: v ? v.goods.measurementUnit : null}; //单位

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "color", value: v ? v.color.name : null};                      //颜色

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "format", value: v ? v.format.info : null};                    //规格

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "unitPrice", value: v ? v.unitPrice : null};                    //单价

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "number", value: v ? v.num : null};                               //数量

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "surplus", value: v.surplus + ""};                              //剩余数量

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "storehouses", hasSelect: !0};                                //仓库

        _lineInfoSet[_lineInfoSet.length] = {cellClass: "rnum", hasInput: !0};                                         //入库数量

        return _lineInfoSet;
    }


    //添加一行
    function addline(lineindex, _lineInfoSet, titleFlag) {

        var $line = $('<li></li>').addClass('line');

        var _label = $('<label></label>');

        var $input = $('<input>').attr({
            "type": "checkbox",
        }).css('width','0px').addClass('ace ace-checkbox-2');

        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

        _label.append($input).append(_span)

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label).attr({"data-pid": purchase.pid}));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(purchase.storehouses, "shId", "name");
                $cell.append($select);
            }

            if (!v.hasInput && !v.hasSelect) {
                $cell.text(v.value ? v.value : '');
            }

            if (v.hasInput) {
                $input = $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').val(v.value ? v.value : null);
                v.readonly && $input.attr('readonly', true);
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
                        $line.attr('data-gid', val.gid);
                    }
                });

                return v;
            }

        });


        $line.append($indexWrap).append($lineInfoWrap);

        return $line;

    }

    function checkRowValue($line) {

        var flag = true;

        $.each($line,function(i,v){
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
