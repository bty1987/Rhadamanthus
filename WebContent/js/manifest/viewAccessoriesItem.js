/**
 * Created by Administrator on 2016/9/23 0023.
 */


jQuery(function ($) {

    var accessories = {
        orderId: $('#viewPopUp').attr('data-orderId'),
        aid: $('#viewPopUp').attr('data-aid'),
        createTime: $('#viewPopUp').attr('data-createTime'),
        status: $('#viewPopUp').attr('data-status'),
        mtype: 7,
        saveBtn: $("#saveBtn"),
        cancellBtn: $("#cancelBtn"),
        manifestItems: {
            customerName: $("#customer"),
            des: $("#comment"),
        },
        record: {},

    };

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": accessories.orderId
    }, function (res) {
        var $table = $('table.table');
        $table.css({'margin-top': '12%'});
        var $td = $('table.table td');
        $td.css('text-align', 'right');
        var $th = $('table.table th');
        $th.css('text-align', 'center');
        var v = res.decoration;
        $table.find('#villageName').next().text(v.house.village.name + " " + v.house.houseNumber);
        $table.find('#designDepartment').next().text(v.designer.dept.deptName);
        $table.find('#businessDepartment').next().text(v.salesman.dept.deptName);
        $table.find('#houseArea').next().text(v.houseArea + "m²");
        $table.find('#measureTime').next().text(v.measureTime == null || "" ? "----" : v.measureTime);
        $table.find('#status').next().text(v.status);

        $table.find('#customerName').next().text(v.customer.name);
        $table.find('#designer').next().text(v.designer.currentName);
        $table.find('#salesman').next().text(v.salesman.currentName);
        $table.find('#orderTotalPrice').next().text(v.orderTotalPrice);
        $table.find('#contractTime').next().text(v.contractTime == null || "" ? "----" : v.contractTime);
    });

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        })
        accessories.storehouses = storehousesStatus;
    }, null, false);

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '120px', 'margin-top': '12px'}).text('出货');

    var $btnRefuse = $('<a></a>').addClass('btn btn-danger btn-sm').attr({
        'name': 'refuse',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '3px', 'margin-top': '12px'}).text('拒绝');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '3px', 'margin-top': '12px'}).text('取消');
    var $condList1 = $('#viewPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-molv');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:73%;"></div>');
    $div.append($btnConfirm).append($btnRefuse).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        if(com.validate('list','bottom')){
            return;
        }
        var $lines = $('li.line', '#list');
        var flag = true;
        if (!$lines.length) {
            layer.msg("辅料单不能为空");
            return;
        }

        var options = {};

        var manifestTime = accessories.createTime;//– 货单时间
        var type = accessories.mtype;//– 类型
        var comment = $('#comment').val();//– 备注
        var aid = accessories.aid;

        options = {
            "manifest.manifestTime": manifestTime,
            "manifest.total": "0",
            "manifest.type": type,
            "manifest.comment": comment,
            "manifest.attachment": "",//– 附件路径
            "aids[0]": aid,
        };

        var $list = $('li.line', '#list');


        $list.length && $list.each(function (i) {
            var $this = $(this);

            options["manifestItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["manifestItems[" + i + "].color.cid"] = $this.find('.color select').val();
            options["manifestItems[" + i + "].format.fid"] = $this.find('.format select').val();

            options["manifestItems[" + i + "].outstorehouse.shId"] = $this.find('.storehouse select').val();//– 仓库ID

            options["manifestItems[" + i + "].num"] = $this.find('.number').text();//– 数量
            options["manifestItems[" + i + "].unitPrice"] = "0";//– 进货价
            options["manifestItems[" + i + "].comment"] = $this.find('.des input').val();// – 说明


        });

        com.post(api.inventory.addManifestForAS, options, function (data) {
            layer.closeAll();
            layer.msg('添加成功!', {icon: 1}, function () {
                //清空页面
                $('#list').empty();
            });
        }, function (e) {
            com.showAlert(com.info, e.errorMsg);
        });

    });

    $btnRefuse.click(function () {
        com.post(api.inventory.updateAccessoriesForStatus, {
            "accessories.aid": accessories.aid
        }, function (data) {
            layer.closeAll();
            layer.msg('拒绝成功', {icon: 1}, function () {
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
                if(v.cellClass == "des"){
                    $input.attr('maxlength', '128');
                }
                $cell.append($input);
            }

            if (v.hasSelect) {
                var $select = $('<select class="v_required"></select>');
                $select.bindData(accessories.storehouses, "shId", "name");
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
        var index = $('.line', '#list').length;
        com.post(api.inventory.queryAccessoriesItemByAid, {
            "accessoriesItem.aid": aid
        }, function (res) {
            for (var i = 0; i < res.accessoriesItems.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index, i, res);
            }

        });

    }

    accessoriesAdd();

    function autoAddline(index, i, res) {

        index = $('.line', '#list').length;
        addline(1 + index).appendTo('#list');
        var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
        $('#list li:nth-of-type(' + (index + 1) + ')').attr({'data-gid': res.accessoriesItems[i].goods.gid});
        $lineInfoWrap1.find('div.no').text(res.accessoriesItems[i].goods.no);
        $lineInfoWrap1.find('div.name').text(res.accessoriesItems[i].goods.name);

        $lineInfoWrap1.find('div.measurementUnit').text(res.accessoriesItems[i].goods.measurementUnit);
        $lineInfoWrap1.find('div.number').text(res.accessoriesItems[i].num);

        com.post(api.inventory.queryColorForEnableByGid, {
            "color.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.color select').bindData(data.colors, "cid", "name");

        })
        com.post(api.inventory.queryFormatForEnableByGid, {
            "format.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {

            $lineInfoWrap1.find('.format select').bindData(data.formats, "fid", "info");

        })


    }

});
