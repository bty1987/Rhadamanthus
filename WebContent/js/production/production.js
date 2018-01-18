$(function(){
    var productionPostData={};
    var $layerAdd = $('#layerAdd');
    var transferData= {};

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

                listData && listData.length && ($.each(listData,function(i, v){

                    var $liLine = $('<li></li>').addClass('clearfix item-blue');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('blue').css({"font-weight":"bold"}).html(' ' + v.pno);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnsigned = $('<a></a>').addClass(' btn btn-minier btn-grey ').html('签约');
                    var $btndeliver = $('<a></a>').addClass(' btn btn-minier btn-success').html('送货');
                    var $btnAfter = $('<a></a>').addClass(' btn btn-minier btn-warning').html('售后');
                    var $btnconfirm = $('<a></a>').addClass(' btn btn-minier btn-danger').html('核对');
                    var $btnquote = $('<a></a>').addClass(' btn btn-minier btn-info').html('报价');
                    var $btnPlan = $('<a></a>').addClass(' btn btn-minier btn-purple').html('计划');
                    var $btnHard = $('<a></a>').addClass(' btn btn-minier btn-pink').html('五金');
                    var $btnOut = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('外协');
                    var $btnBind = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('绑定');
                    var $btnAbandon = $('<a></a>').addClass(' btn btn-minier btn-danger').html('废弃');
                    var $btnPicture = $('<a></a>').addClass(' btn btn-minier btn-primary').html('图纸');

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
                        ["订单编号:", v.orderId, "grey"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                        ["创建人:", v.creater.userName, "grey"],
                        ["创建时间:", v.createTime , "grey"],
                        ["设计师:", v.designer.userName, "grey"],
                        ["确认时间:", v.confirmTime , "grey"],
                        ["拆单时间:", v.diliveryTime , "grey"],
                        ["订单状态:", status, "grey"],
                        ["送货状态:", diliverystatus, "grey"],
                        ["送货时间:", v.diliveryTime , "grey"],
                        ["总额:", v.total, "grey"],
                        ["工期:", v.timeLimit, "grey"],
                        ["订单类型:", _type, "grey"],
                        ["父级生产单号:", (v.spid == 0 ? null: v.spid) , "grey"],
                        ["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"grey")]
                    ];

                    $.each(propertyArr,function (index,value) {
                        var $liProperty = $('<li></li>').css({"border-bottom":"0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
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

                    $btnDiv.appendTo($h3);

                    $btnsigned.click(function(){
                        var options = {};

                        options["production.pid"] = v.pid;
                        options["production.status"] = 1;

                        layer.confirm('确认订单已签约 ?', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.updateProductionForStatus, options, function (res) {
                                productionSearcher.doSearch();
                                layer.msg('确认成功', {icon: 1});
                            }, function () {
                                layer.msg('确认失败', {icon: 2});
                            });
                        }, function () {

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
                        var options = {};

                        options["production.pid"] = v.pid;
                        options["production.status"] = 4;

                        layer.confirm('确定要将此条生产单废弃,废弃后无法恢复 ?', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.updateProductionForStatus, options, function (res) {
                                productionSearcher.doSearch();
                                layer.msg('确认成功', {icon: 1});
                            }, function () {
                                layer.msg('确认失败', {icon: 2});
                            });
                        }, function () {

                        });
                    });

                    $btndeliver.click(function(){
                        var options = {};

                        options["production.pid"] = v.pid;
                        options["production.diliverystatus"] = 1;

                        layer.confirm('确认生产完毕开始送货 ?', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.updateProductionForDeliveryStatus, options, function (res) {
                                productionSearcher.doSearch();
                                layer.msg('确认成功', {icon: 1});
                            }, function () {
                                layer.msg('确认失败', {icon: 2});
                            });
                        }, function () {

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

                               // productionOptions["production.village.villageId"] = data.decorationOrder.village.villageId;

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
                                    layer.closeAll();
                                    layer.msg('添加成功', {icon: 1, time: 2e3});
                                    productionSearcher.doSearch();
                                });
                            }

                        });

                    });


                    $btnconfirm.click(function(){

                        var option = {};
                        option["production.pid"] = v.pid;
                        option["production.status"] = 2;

                        layer.confirm('确定已经核对生产单信息并进行流转?', {
                            btn: ['确定', '取消']
                        }, function (index, layero) {
                            com.post(api.production.updateProductionForStatus, option, function (res) {
                                productionSearcher.doSearch();
                                layer.msg('确认成功', {icon: 1});
                            }, function () {
                                layer.msg('确认失败', {icon: 2});
                            });
                        }, function () {

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
                $('#' + tableId).html(null);
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

        var $adda = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'addProductionVersion').css('margin-top', '-2px').html('添加');

        $adda.click(function (){
            productionUtils.clearForm("form1");
            com.clearValidator();
            productionPostData = {};
            openlayer(function (index, layero) {
                    saveData(function () {
                        layer.closeAll();
                        productionSearcher.doSearch();
                    });
            });
        });
        return [$adda];
    },'resultList');

    function openlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            title:"添加" ,
            content:$('#layerAdd'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9000,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);
            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调
            },
            cancel: function(){
                //右上角关闭回调
            }
        });
    }

    //设计师人员查询
    $layerAdd.find('input[name="designer"]').typeahead({
        url: api.personel.queryUserForNameByDuty,//获取下拉列表的接口
        list: [],
        postData: {"duty" : "设计师","user.status":"0"},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function(data){
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list,["key"], ["value"]);
        },
        isResultTypeMap : true //必填值为true，获取key，value的标识，
        , flupdater: function(k,v){//下拉列表选中时的一些处理，必填对选中项的key和value做处理
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
            productionPostData["production.orderId"] = $('#layerAdd').find("input[name='orderId']").val();
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
                        callback();
                        layer.msg('添加成功', {icon: 1, time: 2e3});
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