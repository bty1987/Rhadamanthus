$(function(){

    var _sid = $('#viewPopUp').attr('data-sid');

    var initList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix')
                    var $h3 = $('<h3></h3>').addClass('siid')
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').css('font-size','14px');

                    var $selectCtype = $('<select></select>').css({'margin-right':'5px'}).addClass('hide');

                    com.post(api.ds.manifest,{},function(res){
                        $selectCtype.bindData(res.priceTypes,'key','value');
                    })

                    var $btnInput = $('<input></input>').css({'width':'100px','height':'26px','margin-right':'5px'}).addClass('hide v_required').attr({'data-rel':'popover','data-placement':'top'});
                    var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-info hide').html('确定');
                    var $btnQCheck = $('<a></a>').addClass('btn btn-minier hide').html('取消');
                    var $btnCtype = $('<a></a>').addClass('btn btn-minier btn-success').html(v.ctype==0?"底价":"点位");

                    var propertyArr = [
                        ["商品品类:", v.goods.category, "grey", "category"],
                        ["商品颜色:", v.color.name, "grey", "color"],
                        ["商品规格:", v.format.info, "grey", "format"],
                        ["售价:", v.selling, "grey", "selling"],
                        ["折扣价:", v.disPrice, "grey", "disPrice"],
                        ["折让价:", v.price, "grey", "price"],
                        ["数量:", v.num, "grey", "num"],
                        ["总价:", v.total, "grey", "total"],
                        ["原结算方式:", v.rawCtype==0?"底价":"点位", "grey", "rawCtype"],
                        ["原结算值:", v.rawCvalue, "grey", "rawCvalue"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "grey", "ctype"],
                        ["结算值:", v.cvalue, "grey", "cvalue"],
                        ["备注:", v.comment, "grey", "conment"],
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnCtype.click(function(){
                        $btnCtype.addClass('hide')
                        $selectCtype.removeClass('hide')
                        $btnInput.removeClass('hide')
                        $btnCheck.removeClass('hide')
                        $btnQCheck.removeClass('hide')
                        $selectCtype.val(v.ctype)
                    })

                    $btnCheck.click(function(){

                        var cvalue = $btnInput.val()
                        var ctype = $selectCtype.find('option:selected').val()

                        if(ctype==0){
                            $btnInput.removeClass('v_discount').addClass('v_float')
                        }else if(ctype==1){
                            $btnInput.removeClass('v_float').addClass('v_discount')
                        }

                       if(com.validate('viewPopUp','top')==false){

                           var _option = {
                               "salesItem.siid":v.siid,
                               "salesItem.ctype":ctype,
                               "salesItem.cvalue":cvalue,
                           }

                           com.post(api.inventory.updateSalesItemForBalance,_option,function(res){
                               layer.msg('更改成功')
                               viewSalesItems(_sid);
                           })
                       }


                    })

                    $btnQCheck.click(function(){
                        $btnCtype.removeClass('hide')
                        $selectCtype.addClass('hide')
                        $btnInput.addClass('hide')
                        $btnCheck.addClass('hide')
                        $btnQCheck.addClass('hide')
                        $btnInput.popover('destroy')
                    })


                    $label.append(v.goods.name).appendTo($h3);

                    $btnDiv.append($selectCtype).append($btnInput).append($btnCheck).append($btnQCheck).append($btnCtype).appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);



                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();


    viewSalesItems(_sid);

    function viewSalesItems(sid) {
        com.post(api.inventory.querySalesItemBySid, {
            "sales.sid": sid
        }, function (res) {

            initList.init('resultList1', res.salesItems);

        })
    }

})