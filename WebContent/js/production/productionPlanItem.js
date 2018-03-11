/**
 * Created by Administrator on 2017/7/26 0026.
 */
jQuery(function ($) {

    var ppid = params["productionPlan.ppid"];
    var $productionStatus = params["production"];
    var $productionPlanStatus = params["productionPlan.status"];

    var displayFunc = (function () {
        var renderList = function(tableId,listData){
            var $tableWrap = $('#'+tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){
                $.each(listData,function(i,v){

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var $btnDel = $('<a></a>').addClass(' btn btn-minier btn-danger').html('删除');

                    var propertyArr = [
                        ["类型编号:", v.typeno, "blue"],
                        ["高:",v.height,"blue"],
                        ["宽:",v.width,"blue"],
                        ["厚:",v.thick,"blue"],
                        //["面积(平方米):",utils.accMul(parseFloat(utils.accDiv(v.height,100)),parseFloat(utils.accDiv(v.width,100))),"grey"],
                        ["颜色:",v.color,"grey"],
                        //["单价:",v.unitprice,"grey"],
                        ["数量:",v.num,"blue"],
                        //["总价:",v.total,"grey"],
                        ["说明:",v.comment,"grey"],
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $btnDiv.append($btnDel);
                    $h3.append($title).append($btnDiv);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    hidBtn($btnDel,$productionPlanStatus);

                    $btnDel.click(function () {
                        layer.confirm('是否删除？', {
                            btn: ['确定', '取消'] //按钮
                        }, function (index, layero) {
                            var ppiid = v.ppiid;
                            deleteProductionPlanItem(ppiid);
                        }, function () {
                        });
                    });

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        }
    })();

    var searcher  = new Searcher();

    searcher.init([],'condList',api.production.pageProductionPlanItemByPpid,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation","productionPlanItemPostData",{"productionPlanItem.productionPlan.ppid" :ppid},false,null,function () {

        var $adda = $('<a></a>').addClass('btn btn-xs btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px").html("添加");

        hidBtn($adda,$productionPlanStatus);

        $adda.click(function () {
            productionUtils.clearForm('form1');
            com.clearValidator();
            addProductionPlanItem(function (index,lyero) {
                if(!com.validate("layerAddItem",null)){
                    addItem();
                }
            });
        });

        var $back = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $backi = $('<i></i>').addClass('m-icon-swapleft').appendTo($back);
        var $backspan = $('<span></span>').text('返回').appendTo($back);

        $back.click(function () {
            com.switchPage(api.index.productionPlanIndex.url);
        });

        return [$adda,$back];

    });

    $('#layerAddItem').find("#itemName").typeahead({
        url: api.production.queryQuoteItemByPinyin,
        list: [],
        postData: {},
        source: function (query, process) {
            var params = $.extend({"quoteItem.name": query, "quoteItem.pinyin": query}, this.options.postData);
            com.post(this.options.url, params, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data['quoteItems'];
            this.flprocess(this.options.list, 'qiid', 'name');
        },
        isResultTypeMap: true
        , flupdater: function (k, v) {
            //k: key, v:value
            var list = this.options.list;
            $.each(list, function (index, val) {

                if (val.qiid == k) {
                    $('#layerAddItem').find('#measurementUnit').val(val.measurementunit);
                    $('#layerAddItem').find('#typeNo').val(val.format);
                }


            });
            return v;
        }
    });

    function addProductionPlanItem(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加计划项",
            content: $('#layerAddItem'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9999,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index,layero)
            },
            btn2: function (index, layero) {

            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    function addItem() {
        var option = [];
        var $color = $('#color').val();

        option["productionPlanItem.productionPlan.ppid"] = ppid;
        option["productionPlanItem.typeno"] = $('#typeNo').val();
        option["productionPlanItem.name"] = $('#itemName').val();
        option["productionPlanItem.height"] = $('#height').val();
        option["productionPlanItem.width"] = $('#width').val();
        option["productionPlanItem.thick"] = $('#thick').val();
        option["productionPlanItem.color"] = $color ? $color : ' ';
        option["productionPlanItem.unitprice"] = 0;
        option["productionPlanItem.num"] = $('#num').val();
        option["productionPlanItem.total"] = 0;
        option["productionPlanItem.comment"] = $('#comment').val();
        com.post(api.production.addProductionPlanItem,option,function (res) {
            layer.msg("添加成功");
            searcher.doSearch();
            productionUtils.clearForm('form1');
        },function () {
            layer.msg("添加失败");
        })

    }

    function deleteProductionPlanItem(id) {
        if(id){
            com.post(api.production.deleteProductionPlanItem,{
                "productionPlanItem.ppiid":id
            },function (res) {
                searcher.doSearch();
                layer.closeAll();
                layer.msg('删除成功');
            },function () {
                layer.msg('删除失败')
            })
        }
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if ($productionStatus == 5 || $productionStatus == 4 || $productionStatus == 3) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

    //$('#layerAddItem').find(".num input").on("change",function(){
    //    com.clearValidator();
    //    if(com.validate("layerAddItem","top")){
    //        return false;
    //    }
    //    calcTotal();
    //})

    //function calcTotal(){
    //    var _num =  $('#layerAddItem').find('.num input').val();
    //    var _unitPrice =  $('#layerAddItem').find('.unitPrice').attr('data-unitPrice');
    //    var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
    //    $('#layerAddItem').find('.total').text(_total);
    //}

});