/**
 * Created by Administrator on 2017/7/26 0026.
 */
jQuery(function ($) {

    var ppid = params["productionPlan.ppid"];
    var $productionStatus = params["production"];
    var $productionPlanStatus = params["productionPlan.status"];

    var displayFunc = (function () {
        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#'+tableId);
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
                        ["颜色:",v.color,"grey"],
                        ["数量:",v.num,"blue"],
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
                        com.showConfirm("是否确认删除", function(){
                            deleteProductionPlanItem(v.ppiid);
                        });
                    });

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
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

    com.focusPage('#layerAddItem').find("#itemName").typeahead({
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
                    com.focusPage('#layerAddItem').find('#measurementUnit').val(val.measurementunit);
                    com.focusPage('#layerAddItem').find('#typeNo').val(val.format);
                }


            });
            return v;
        }
    });

    function addProductionPlanItem(callback){
        com.closePopup();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加计划项",
            content: com.focusPage('#layerAddItem'),
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
        var $color = com.focusPage('#color').val();

        option["productionPlanItem.productionPlan.ppid"] = ppid;
        option["productionPlanItem.typeno"] = com.focusPage('#typeNo').val();
        option["productionPlanItem.name"] = com.focusPage('#itemName').val();
        option["productionPlanItem.height"] = com.focusPage('#height').val();
        option["productionPlanItem.width"] = com.focusPage('#width').val();
        option["productionPlanItem.thick"] = com.focusPage('#thick').val();
        option["productionPlanItem.color"] = $color ? $color : ' ';
        option["productionPlanItem.unitprice"] = 0;
        option["productionPlanItem.num"] = com.focusPage('#num').val();
        option["productionPlanItem.total"] = 0;
        option["productionPlanItem.comment"] = com.focusPage('#comment').val();
        com.post(api.production.addProductionPlanItem,option,function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            productionUtils.clearForm('form1');
        });

    }

    function deleteProductionPlanItem(id) {
        if(id){
            com.post(api.production.deleteProductionPlanItem,{
                "productionPlanItem.ppiid":id
            },function (res) {
                searcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
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

});