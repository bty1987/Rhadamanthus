$(function(){
    
    var salesBalance4detail= {
        _sid : com.focusPage('#viewPopUp').attr('data-sid'),
        dompanyFlag : com.focusPage('#viewPopUp').attr('data-dompany')
    };
    
    if(salesBalance4detail.dompanyFlag == 'true'){

        com.post(api.sales.querySalesBySid,{"sales.sid" : salesBalance4detail._sid}, function (res) {
            var v = res.sales;
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $small = $('<small></small>').addClass('blue').html(v.orderId);
            var $btnPre = $('<a></a>').addClass('btn btn-minier btn-yellow').html('预结算');
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

            var propertyArr = [
                ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                ["客户名:", v.customer.name, "grey"],
                ["渠道:", v.salesman.currentName, "grey"],
                ["部门:", v.dept.name, "grey"],
                ["分区:", v.region.name, "grey"],
                ["导购:", v.guider.currentName, "grey"],
                ["驻店:", v.instorer.currentName, "grey"],
                ["品牌:", v.brand, "grey"],
                ["定金:", v.depositpay, "blue"],
                ["补款:", v.fullpay, "blue"],
                ["等级:", v.grade, "red"],
                ["总额:", v.total, "grey"],
                ["抹零:", v.maling, "blue"],
                ["厂商抹零:", v.venderMaling, "blue"],
                ["券值:", v.coupon, "blue"],
                ["券信息:", v.couponInfo, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["结算时间:", v.balanceTime, "green"],
                ["补款时间:", v.fullpayTime, "green"],
                ["备注:", v.comment, "grey"]
            ];
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $liLine.appendTo($ul);
            $small.appendTo($h3);
            $btnDiv.append($btnPre).appendTo($h3);
            $liLine.append($h3).append($ulProperty);
            $ul.appendTo(com.focusPage("#condList1"));

            $btnPre.click(function () {

                var _option = {};

                _option["sid[0]"] = v.sid;

                com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单进行预结算吗?', function (index, layero) {
                    com.post(api.sales.preSalesBalance, _option, function (res) {
                        com.showAlert(com.info, "预结算成功");
                    });
                });
            });
        });
    }

    var initList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.goods.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $selectCtype = $('<select></select>').css({'margin-right':'5px'}).addClass('hide');

                    com.post(api.ds.manifest,{},function(res){
                        $selectCtype.bindData(res.priceTypes,'key','value');
                    });

                    var $btnInput = $('<input></input>').css({'width':'100px','height':'26px','margin-right':'5px'}).addClass('hide v_required');
                    var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-info hide').html('确定');
                    var $btnQCheck = $('<a></a>').addClass('btn btn-minier hide').html('取消');
                    var $btnCtype = $('<a></a>').addClass('btn btn-minier btn-success').html(v.ctype==0?"底价":"点位");

                    var profit = 0;

                    if(v.ctype==1){
                        profit = utils.accMul(utils.accSub(v.price, utils.accMul(v.disPrice, utils.accSub(1, v.cvalue))), v.num);
                    }else{
                        profit = utils.accMul(utils.accSub(v.price, v.cvalue),v.num);
                    }
                    
                    var propertyArr = [
                        ["商品品类:", v.goods.category, "grey", "category"],
                        ["商品颜色:", v.color.name, "grey", "color"],
                        ["商品规格:", v.format.info, "grey", "format"],
                        ["售价:", v.selling, "blue", "selling"],
                        ["折扣价:", v.disPrice, "blue", "disPrice"],
                        ["折让价:", v.price, "blue", "price"],
                        ["数量:", v.num, "blue", "num"],
                        ["总价:", v.total, "blue", "total"],
                        ["原结算方式:", v.rawCtype==0?"底价":"点位", "red", "rawCtype"],
                        ["原结算值:", v.rawCvalue, "blue", "rawCvalue"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "red", "ctype"],
                        ["结算值:", v.cvalue, "blue", "cvalue"],
                        ["利润:", profit, "blue", "profit"],
                        ["备注:", v.comment, "grey", "comment"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnCtype.click(function(){
                        $btnCtype.addClass('hide');
                        $selectCtype.removeClass('hide');
                        $btnInput.removeClass('hide');
                        $btnCheck.removeClass('hide');
                        $btnQCheck.removeClass('hide');
                        $selectCtype.val(v.ctype);
                    });

                    $btnCheck.click(function(){

                        var cvalue = $btnInput.val();
                        var ctype = $selectCtype.find('option:selected').val();

                        if(ctype==0){
                            $btnInput.removeClass('v_discount').addClass('v_float_3');
                        }else if(ctype==1){
                            $btnInput.removeClass('v_float_3').addClass('v_discount');
                        }

                       if(com.validate('viewPopUp','top')==false){

                           var _option = {
                               "salesItem.siid":v.siid,
                               "salesItem.ctype":ctype,
                               "salesItem.cvalue":cvalue
                           };
                           com.post(api.sales.updateSalesItemForBalance,_option,function(res){
                               com.showAlert(com.info, "更改成功");
                               viewSalesItems(salesBalance4detail._sid);
                           });
                       }
                    });

                    $btnQCheck.click(function(){
                        $btnCtype.removeClass('hide');
                        $selectCtype.addClass('hide');
                        $btnInput.addClass('hide');
                        $btnCheck.addClass('hide');
                        $btnQCheck.addClass('hide');
                    });

                    $small.appendTo($h3);

                    if(salesBalance4detail.dompanyFlag == 'true'){
                        $btnDiv.append($selectCtype).append($btnInput).append($btnCheck).append($btnQCheck).append($btnCtype).appendTo($h3);
                    }

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                });
                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();

    viewSalesItems(salesBalance4detail._sid);

    function viewSalesItems(sid) {
        com.post(api.sales.querySalesItemBySid, {
            "sales.sid": sid
        }, function (res) {
            initList.init('resultList1', res.salesItems);

        });
    }

});