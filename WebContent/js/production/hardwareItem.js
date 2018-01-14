$(function () {

    var $hid = params.hid;
    var $hardwareStatus = params.hardwareStatus;
    var $productionStatus = params.productionStatus;

    var displayFunc = (function () {

        var renderList = function(tableId,listData){

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('clearfix item-blue');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"}).html(' ' + v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnDelete = $('<a></a>').addClass('btn btn-minier').html('删除');

                    var total = utils.accMul(v.unitprice,v.num);

                    var propertyArr = [
                        ["数量:", v.num, "grey"],
                        ["单位:", v.measurementunit,"grey"],
                        ["单价:", v.unitprice,"grey"],
                        ["总价:",total,"grey"],
                        ["说明:", v.comment,"grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $btnDiv.append($btnDelete).appendTo($h3);

                    hidBtn($btnDelete,$hardwareStatus)

                    //删除按钮
                    $btnDelete.click(function (e) {
                        e.stopPropagation();
                        layer.confirm('确定要删除吗？', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.deleteHardwareItem, {"hardwareItem.hiid": v.hiid}, function () {
                                layer.closeAll();
                                hardwareItemSearcher.doSearch();
                                com.showAlert(com.info, "删除成功");
                            }, function (e) {
                                layer.closeAll();
                                com.showAlert(com.error, e.exception.errorMessage);
                            });
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
        };
    })();

    var hardwareItemSearcher = new Searcher();

    var _condArr = [];

    hardwareItemSearcher.init(_condArr,"condList",api.production.pageHardwareItemByHid,function(data){

        displayFunc.init("resultList",data);

    },"pagenation","hardwareItemPostData",{"hardware.hid":$hid},false,null,function (){

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'addHardwareItemVersion').css("margin", "0px 3px").html('添加');
        var $back = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'backHardwareVersion').css("margin", "0px 3px").html('返回');

        hidBtn($adda,$hardwareStatus);


        $adda.click(function(){
            com.clearValidator();
            productionUtils.clearForm('form1');
            addHardwareItem(function(){
                if(!com.validate("layerAddItem",null)){
                    calcTotal();
                    addItem();
                }
            });
        });

        $back.click(function () {
            com.switchPage(api.index.hardwareIndex.url);
        });

        return [$adda, $back];
    });


    function addHardwareItem(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "添加五金项",
            content: $('#layerAddItem'),
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
            var list = this.options.list;

            $.each(list, function (index, val) {

                if (val.qiid == k) {
                    $('#layerAddItem').find('#measurementUnit').val(val.measurementunit);
                    $('#layerAddItem').find('#unitPrice').val(val.unitprice);
                }

            });
            return v;
        }
    });




    function addItem(){
        var options = {};
        var $layerAdd = $('#layerAddItem');

        options["hardware.hid"] = $hid;
        options["hardwareItems[0].name"] = $layerAdd.find('#itemName').val();
        options["hardwareItems[0].unitprice"] = $layerAdd.find('#unitPrice').val();
        options["hardwareItems[0].num"] = $layerAdd.find('#itemNum').val();
        options["hardwareItems[0].measurementunit"] = $layerAdd.find('#measurementUnit').val();
        options["hardwareItems[0].total"] = $layerAdd.find('#total').val();
        options["hardwareItems[0].comment"] = $layerAdd.find('#comment').val();

        com.post(api.production.addHardwareItem,options,function(res){
            com.clearValidator();
            productionUtils.clearForm('form1');
            hardwareItemSearcher.doSearch();
            com.showAlert(com.info,"添加成功");
        },function(e){
            com.showAlert(com.info,"添加失败");
        })
    }

    $('#layerAddItem').find("#itemNum").on("change",function(){
        com.clearValidator();
        if(!com.validate('itemNum')){
            calcTotal();
        }
    });

    function calcTotal(){
        var _num =  $('#layerAddItem').find("#itemNum").val();
        var _unitPrice =  $('#layerAddItem').find('#unitPrice').val();
        var _total = utils.accMul(parseFloat(_num+''),parseFloat(_unitPrice+''));
        $('#layerAddItem').find('#total').val(_total);
    }


    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if ($productionStatus == 5 || $productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});