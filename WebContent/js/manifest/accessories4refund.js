
jQuery(function ($) {

    if (jQuery().datepicker) {
        com.focusPage('.date-picker').datepicker({
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
            autoclose:true
        });
    }

    var accessories = {
        orderId: com.focusPage('#refundPopUp').attr('data-orderId'),
        aid: com.focusPage('#refundPopUp').attr('data-aid'),
        createTime: com.focusPage('#refundPopUp').attr('data-createTime'),
        status: com.focusPage('#refundPopUp').attr('data-status'),
        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),
        manifestItems: {
            customerName: com.focusPage("#customer"),
            des: com.focusPage("#comment")
        },
        record: {},
        supervisorId: null
    };

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": accessories.orderId
    }, function (res) {

        orderInfo('orderInfo', res.decoration);

    });

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        });
        accessories.storehouses = storehousesStatus;
    }, null, false);

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '120px', 'margin-top': '12px'}).text('退回');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '3px', 'margin-top': '12px'}).text('取消');
    var $condList1 = com.focusPage('#refundPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:73%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        if (com.validate('list', 'bottom')) {
            return;
        }
        var $lines = com.focusPage('li.line', '#list');
        var flag = true;
        if (!$lines.length) {
            layer.msg("辅料单不能为空");
            return;
        }

        var options = {};

        var $list = com.focusPage('li.line', '#list');
        var $fetchTime = com.focusPage('[name="date"]','#fetchTime');

        if($fetchTime.val() == null || $fetchTime.val() == ""){
            layer.alert('请选择领取时间', {
                icon: 0,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
            return;
        }

        options["accessories.orderId"] = accessories.orderId;
        options["accessories.supervisor.userId"] = accessories.supervisorId == null || "" ? "---" : accessories.supervisorId;
        options["accessories.fetchTime"] = $fetchTime.val();


        $list.length && $list.each(function (i) {
            var $this = $(this);

            options["accessoriesItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["accessoriesItems[" + i + "].color.cid"] = $this.find('.color select').val();
            options["accessoriesItems[" + i + "].format.fid"] = $this.find('.format select').val();
            options["accessoriesItems[" + i + "].storehouse.shid"] = $this.find('.storehouse select').val();//– 仓库ID
            options["accessoriesItems[" + i + "].num"] = -$this.find('.number').text();//– 数量

        });

        com.post(api.inventory.refundAccessories, options, function (data) {
            layer.closeAll();
            layer.msg('添加成功!', {icon: 1}, function () {
                //清空页面
                com.focusPage('#list').empty();
            });
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
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
            {cellClass: "no blue"},//编号
            {cellClass: "name grey"},//名称
            {cellClass: "color", hasColorSelect: !0},//颜色
            {cellClass: "format", hasFormatSelect: !0},//规格
            {cellClass: "measurementUnit grey"},//单位
            {cellClass: "storehouse grey", hasSelect: !0},//仓库
            {cellClass: "number blue"},//数量
            {cellClass: "des grey", hasInput: !0}//备注
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                if (v.cellClass == "des") {
                    $input.attr('maxlength', '128');
                }
                $cell.append($input);
            }

            if (v.hasSelect) {
                var $select = $('<select class="v_required"></select>');
                $select.bindData(accessories.storehouses, "shid", "name");
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

    function accessoriesAdd() {
        var aid = accessories.aid;
        var index = com.focusPage('.line', '#list').length;
        com.post(api.inventory.queryAccessoriesItemByAid, {
            "accessoriesItem.aid": aid
        }, function (res) {
            for (var i = 0; i < res.accessoriesItems.length; i++) {
                index = com.focusPage('.line', '#list').length;
                autoAddline(index, i, res);
            }
        });
    }

    accessoriesAdd();

    function autoAddline(index, i, res) {

        index = com.focusPage('.line', '#list').length;
        addline(1 + index).appendTo(com.focusPage('#list'));
        var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + (index + 1) + ') div.content');
        com.focusPage('#list li:nth-of-type(' + (index + 1) + ')').attr({'data-gid': res.accessoriesItems[i].goods.gid});
        $lineInfoWrap1.find('div.no').text(res.accessoriesItems[i].goods.no);
        $lineInfoWrap1.find('div.name').text(res.accessoriesItems[i].goods.name);

        $lineInfoWrap1.find('div.measurementUnit').text(res.accessoriesItems[i].goods.measurementUnit);
        $lineInfoWrap1.find('div.number').text(res.accessoriesItems[i].num);

        com.post(api.inventory.queryColorForEnableByGid, {
            "color.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.color select').bindData(data.colors, "cid", "name");

        });
        com.post(api.inventory.queryFormatForEnableByGid, {
            "format.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.format select').bindData(data.formats, "fid", "info");
        })
    }

    function orderInfo(tableId, v) {

        com.focusPage('#' + tableId).html(null);
        var $tableWrap = com.focusPage('#' + tableId);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var status ={
            '0':'初始', '1':'定金' , '2' : '签约' ,'3' : '重签' , '4' : '废单','5' : '终止','6' : '决算','7' : '完结'
        };
        accessories.supervisorId = v.supervisor.userId;
        var propertyArr = [
            ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
            ["客户名:", v.customer.name, "grey"],
            ["设计部:", v.designer.dept.deptName, "grey"],
            ["设计师:", v.designer.currentName, "grey"],
            ["业务部:", v.salesman.dept.deptName, "grey"],
            ["业务员:", v.salesman.currentName, "grey"],
            ["监理:", v.supervisor.currentName == null ||"" ? "----" : v.supervisor.currentName, "grey"],
            ["面积:", v.house.buildArea + "m²", "blue"],
            ["合同报价:", v.orderTotalPrice, "blue"],
            ["签单时间:", v.contractTime == null || "" ? "----" : v.contractTime, "green"],
            ["量房时间:", v.measureTime == null || "" ? "----" : v.measureTime, "green"],
            ["状态:", status[v.status], "red"]
        ];
        $.each(propertyArr, function (index, value) {
            var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $ulProperty.appendTo($tableWrap);

    }

});
