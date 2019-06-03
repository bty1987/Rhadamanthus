$(function(){
    var productionPostData={};
    var $layerAdd = com.focusPage('#layerAdd');
    var transferData= {};

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

                listData && listData.length && ($.each(listData,function(i, v){

                    var $liLine = $('<li></li>').addClass('clearfix item-orange');
                    var $h3 = $('<h3></h3>').addClass('oid')
                    var $title = $('<small></small>').addClass('blue').html(' ' + v.pno);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var $btnsigned = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('签约');
                    var $btndeliver = $('<a></a>').addClass(' btn btn-minier btn-success').html('送货');
                    var $btnAfter = $('<a></a>').addClass(' btn btn-minier btn-warning').html('售后');
                    var $btnconfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('核对');
                    var $btnquote = $('<a></a>').addClass(' btn btn-minier btn-danger').html('报价');
                    var $btnPlan = $('<a></a>').addClass(' btn btn-minier btn-pink').html('计划');
                    var $btnHard = $('<a></a>').addClass(' btn btn-minier btn-purple').html('五金');
                    var $btnOut = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('外协');
                    var $btnBind = $('<a></a>').addClass(' btn btn-minier btn-success').html('绑定');
                    var $btnAbandon = $('<a></a>').addClass(' btn btn-minier btn-warning').html('废弃');
                    var $btnPicture = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('图纸');

                    var status = "";
                    var diliverystatus = "";
                    var _type = "";
                    
                    switch (v.status){
                        case 0: status = "初始"; break;
                        case 1: status = "签约"; break;
                        case 2: status = "已审核"; break;
                        case 3: status = "生产"; break;
                        case 4: status = "废单"; break;
                        case 5: status = "完结"; break;
                    }

                    switch (v.diliverystatus){
                        case 0: diliverystatus = "未送货"; break;
                        case 1: diliverystatus = "已送货"; break;
                    }

                    switch (v.type){
                        case 0: _type = "生产单"; break;
                        case 1: _type = "售后单"; break;
                    }

                    var remainDate = dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
                    var remainDay = 0 ;  //显示剩余工期

                    if(v.status == 4 || v.status == 5){
                        remainDay = "订单已结束";
                    }else if(remainDate < 0){
                        remainDay = "已超过期限"+Math.abs(remainDate)+"天";
                    }else {
                        remainDay = "剩余工期"+Math.abs(remainDate)+"天"
                    }

                    var propertyArr = [
                        ["装修单号:", v.orderId, "blue"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "blue"],
                        ["创建人:", v.creater.userName, "grey"],
                        ["创建时间:", v.createTime , "green"],
                        ["设计师:", v.designer.userName, "grey"],
                        ["确认时间:", v.confirmTime , "green"],
                        ["拆单时间:", v.diliveryTime , "green"],
                        ["订单状态:", status, "red"],
                        ["送货状态:", diliverystatus, "red"],
                        ["送货时间:", v.diliveryTime , "green"],
                        ["总额:", v.total, "blue"],
                        ["工期:", v.timeLimit, "green"],
                        ["订单类型:", _type, "red"],
                        ["父级生产单号:", (v.spid == 0 ? null: v.spid) , "blue"],
                        ["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")]
                    ];

                    $.each(propertyArr,function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').addClass(value[2]).html(value[1]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnDiv.append($btnBind).append($btnquote).append($btnPlan)
                           .append($btnHard).append($btnOut).append($btnPicture);

                    if( v.status == 0 ){
                        $btnDiv.append($btnsigned).append($btnAbandon);
                    }else if( v.status == 1){
                        $btnDiv.append($btnconfirm).append($btnAbandon);
                    }else if( v.status == 2){
                        $btnDiv.append($btnAbandon);
                    } else if ( v.status == 3 && v.diliverystatus == 0){
                        $btnDiv.append($btndeliver).append($btnAfter).append($btnAbandon);
                    }else if ( v.status == 3 && v.diliverystatus == 1){
                        $btnDiv.append($btnAfter).append($btnAbandon);
                    }

                    $h3.append($title).append($btnDiv);

                    $btnsigned.click(function(){
                        com.showConfirm("是否确认签约", function(){
                            com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 1}, function (res) {
                                productionSearcher.doSearch();
                                com.showAlert(com.info, "操作成功");
                            });
                        });
                    });

                    $btnBind.click(function () {
                        transferData = {};
                        transferData.pid = v.pid;
                        transferData.status = v.status;
                        transferData.orderId = v.orderId;
                        params["transferData"] = transferData;

                        com.switchPage(api.index.productionSalesIndex.url);

                    });

                    $btnAbandon.click(function(){
                        com.showConfirm("是否确认废弃", function(){
                            com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 4}, function (res) {
                                productionSearcher.doSearch();
                                com.showAlert(com.info, "操作成功");
                            });
                        });
                    });

                    $btndeliver.click(function(){
                        com.showConfirm("是否确认送货", function(){
                            com.post(api.production.updateProductionForDeliveryStatus, {"production.pid": v.pid, "production.diliverystatus": 1}, function (res) {
                                productionSearcher.doSearch();
                                com.showAlert(com.info, "操作成功");
                            });
                        });
                    });

                    $btnAfter.click(function(){

                        productionUtils.clearForm('form1');
                        com.clearValidator();
                        var productionOptions = {};

                        $layerAdd.find("input[name = 'orderId']").val(v.orderId);
                        $layerAdd.find("input[name = 'designer']").val(v.designer.userName);

                        com.post(api.decoration.queryDecorationForCommonByOrderId,{"decoration.orderId":v.orderId},function (data) {
                                $layerAdd.find("input[name='orderAddr']").val(data.decoration.house.village.name+"  "+data.decoration.house.houseNumber);
                            });

                        openlayer(function (index, layero) {

                            if(!com.validate("layerAdd",null)){

                                productionOptions["production.orderId"] = v.orderId;
                                //productionOptions["production.houseNumber"] = v.houseNumber;
                                productionOptions["production.house.hid"] = v.house.hid;
                                productionOptions["production.designer.userId"] = v.designer.userId;
                                productionOptions["production.type"] = 1;
                                productionOptions["production.spid"] = v.pno;
                                productionOptions["production.total"] = 0;
                                productionOptions["production.timeLimit"] = $layerAdd.find("input[name='timeLimit']").val();

                                com.post(api.production.addProduction,productionOptions,function(res){
                                    com.showAlert(com.info, "操作成功");
                                    productionSearcher.doSearch();
                                });
                            }

                        });

                    });

                    $btnconfirm.click(function(){
                        com.showConfirm("是否确认进入流转", function(){
                            com.post(api.production.updateProductionForStatus, {"production.pid": v.pid, "production.status": 2}, function (res) {
                                productionSearcher.doSearch();
                                com.showAlert(com.info, "操作成功");
                            });
                        });
                    });

                    $btnquote.click(function(){
                        params["pid"] = v.pid;
                        params["status"] = v.status;
                        params["address"] = v.house.village.name + " " + v.house.houseNumber;

                        com.switchPage(api.index.puotationIndex.url);
                    });

                    $btnOut.click(function(){
                        params["pid"] = v.pid;
                        params["status"] = v.status;

                        com.switchPage(api.index.outsourceIndex.url);
                    });

                    $btnHard.click(function(){
                        params["pid"] = v.pid;
                        params["status"] = v.status;

                        com.switchPage(api.index.hardwareIndex.url);
                    });

                    $btnPlan.click(function(){
                        params["pid"] = v.pid;
                        params["status"] = v.status;

                        com.switchPage(api.index.productionPlanIndex.url);
                    });

                    $btnPicture.click(function(){
                        params["pid"] = v.pid;
                        params["status"] = v.status;

                        com.switchPage(api.index.productionPictureIndex.url);
                    });

                }));

                $ul.appendTo($tableWrap);

        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        };

    })();

    /*分页*/
    var _condArr = ["p_orderId","p_productionPNo","p_productionStatus"];

    var productionSearcher = new Searcher();

    productionSearcher.init( _condArr, "condList", api.production.pageProduction, function(data){

        displayFunc.init('resultList', data);

    }, "pagenation", "salesPostData", null, false, null,function(){

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'addProductionVersion').css('margin-top', '-2px').html('添加');

        $adda.click(function (){
            productionUtils.clearForm("form1");
            com.clearValidator();
            productionPostData = {};
            openlayer(function (index, layero) {
                saveData();
            });
        });
        return [$adda];
    },'resultList');

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:"添加" ,
            content:com.focusPage('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 ) + "px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                //按钮[按钮二]的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    //设计师人员查询
    $layerAdd.find('input[name="designer"]').typeahead({
        url: api.personel.queryUserByPinyin,//获取下拉列表的接口
        list: [],
        postData: {"departmentType.name": "设计部", "user.status":"0"},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function(data){
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list,["key"], ["value"]);
        },
        isResultTypeMap : true //必填值为true,获取key,value的标识
        , flupdater: function(k,v){//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            return v;
        }
    });

    $layerAdd.find("input[name = 'orderId']").on('change',(function () {

        var option = {};

        option["decoration.orderId"] = $layerAdd.find("input[name='orderId']").val();

        com.post(api.decoration.queryDecorationForCommonByOrderId,option,function (data) {

            //$layerAdd.find("input[name='orderAddr']").val(data.decorationOrder.village.villageName+"  "+data.decorationOrder.houseNumber);
            $layerAdd.find("input[name='orderAddr']").val(data.decoration.house.village.name+"  "+data.decoration.house.houseNumber);
            //装修订单id
            productionPostData["production.orderId"] = com.focusPage('#layerAdd').find("input[name='orderId']").val();
            //房源id
            productionPostData["production.house.hid"] = data.decoration.house.hid;
            //楼盘编号
            //if(data.decorationOrder.houseNumber==null){
            //    productionPostData["production.houseNumber"] ="";
            //}else{
            //    productionPostData["production.houseNumber"] = data.decorationOrder.houseNumber;
            //}

        });
    }));

    function saveData(callback){

        if(!com.validate("layerAdd",null)){

            productionPostData["production.type"] = 0;
            productionPostData["production.spid"] = 0;
            productionPostData["production.designer.userId"] = $layerAdd.find('input[name="designer"]').attr('data-typeahead-key');
            productionPostData["production.total"] = 0;
            productionPostData["production.timeLimit"] = $layerAdd.find("input[name = 'timeLimit']").val();

            com.post(api.production.addProduction,productionPostData,function(res){
                productionSearcher.doSearch();
                com.showAlert(com.info, "操作成功");
            });
        }
    }

    function dateDiffer(createTime,timeLimit){
        var currentDate,createDate,createDateList,unit,workingDate,remainDate;
        unit = utils.accMul(24,utils.accMul(3600,1000));//转换单位
        currentDate = new Date();
        createDateList = createTime.split("-");
        createDate = new Date(createDateList[1]+"-"+createDateList[2]+"-"+createDateList[0]);

        workingDate = parseInt( utils.accDiv(utils.accSub(currentDate,createDate),unit));
        remainDate = utils.accSub(timeLimit,workingDate);

        return remainDate;
    }

});