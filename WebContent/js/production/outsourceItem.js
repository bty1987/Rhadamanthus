$(function () {

    var backBtn = com.focusPage('#backBtn');
    var addBtn = com.focusPage('#addBtn');
    var oid = params.oid;
    var outsourceStatus = params.outsourceStatus;
    var productionStatus = params.productionStatus;

    //var total=$("#total");

    var displayFunc = (function () {

        var renderList = function(tableId,listData){

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('clearfix item-orange');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

                   // var total = utils.accMul(v.unitprice,v.num);

                    var propertyArr = [
                        ["高:", v.height, "blue"],
                        ["宽:", v.width, "blue"],
                        ["厚:", v.thick, "blue"],
                        ["造型:", v.modelling, "grey"],
                        ["数量:", v.num, "blue"],
                        ["单价:", v.unitprice, "blue"],
                        ["总价:", v.total, "blue"],
                        ["说明:", v.comment, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $btnDiv.append($btnDelete);
                    $h3.append($title).append($btnDiv);

                    hidBtn($btnDelete,outsourceStatus);

                    $btnDelete.click(function (e) {
                        com.showConfirm("是否确认删除", function(){
                            com.post(api.production.deleteOutsourceItem, {"outsourceItem.oiid": v.oiid}, function () {
                                outsourceSeacher.doSearch();
                                com.showAlert(com.info, "操作成功");
                            });
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
        };
    })();

    var outsourceSeacher = new Searcher();

    var _condArr = [];

    outsourceSeacher.init( _condArr, "condList", api.production.pageOutsourceItemByOid, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "outsourcePostData", {"outsourceItem.oid": oid}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info').css("margin", "0px 3px").html('添加');

        var $backBtn = $('<a></a>').addClass('btn btn-xs').css("margin", "0px 3px").html('返回');

        hidBtn($adda,outsourceStatus);

        $adda.click(function(){
            com.clearValidator();
            productionUtils.clearForm('form1');
            addOutsourceItem(function(){
                if(!com.validate("layerAddItem",null)){
                    calcTotal();
                    addItem();
                }
            });
        });

        $backBtn.click(function() {
            com.switchPage(api.index.outsourceIndex.url)
        });

        return [$adda,$backBtn];
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
            var list = this.options.list;

            $.each(list, function (index, val) {

                if (val.qiid == k) {
                    com.focusPage('#layerAddItem').find('#measurementUnit').val(val.measurementunit);
                    com.focusPage('#layerAddItem').find('#unitPrice').val(val.unitprice);
                }

            });
            return v;
        }
    });

    function addOutsourceItem(callback){
        com.closePopup();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加外协项",
            content: com.focusPage('#layerAddItem'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
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

    function addItem(){
        var options = {};
        var $layerAdd = com.focusPage('#layerAddItem');
        var modeling = $layerAdd.find('#modelling').val();

        options["outsource.oid"] = oid;
        options["outsourceItems[0].name"] = $layerAdd.find('#itemName').val();
        options["outsourceItems[0].height"] = $layerAdd.find('#height').val();
        options["outsourceItems[0].width"] = $layerAdd.find('#width').val();
        options["outsourceItems[0].thick"] = $layerAdd.find('#thick').val();
        options["outsourceItems[0].modelling"] = modeling ? modeling : '';
        options["outsourceItems[0].num"] = $layerAdd.find('#itemNum').val();
        options["outsourceItems[0].unitprice"] = $layerAdd.find('#unitPrice').val();
        options["outsourceItems[0].total"] = $layerAdd.find('#total').val();
        options["outsourceItems[0].comment"] = $layerAdd.find('#comment').val();

        com.post(api.production.addOutsourceItem,options,function(res){
            com.clearValidator();
            productionUtils.clearForm('form1');
            outsourceSeacher.doSearch();
            com.showAlert(com.info,"添加成功");
        },function(e){
            com.showAlert(com.info,"添加失败");
        })
    }

    com.focusPage('#layerAddItem').find("#itemNum").on("change",function(){
        com.clearValidator();
        if(!com.validate('itemNum')){
            calcTotal();
        }
    });

    function calcTotal(){
        var _num =  com.focusPage('#layerAddItem').find("#itemNum").val();
        var _unitPrice =  com.focusPage('#layerAddItem').find('#unitPrice').val();
        var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
        com.focusPage('#layerAddItem').find('#total').val(_total);
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (productionStatus == 5 || productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});