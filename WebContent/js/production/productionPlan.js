/**
 * Created by Administrator on 2017/7/26 0026.
 */
jQuery(function ($) {

	var $layerImport = $("#layerImport");
    var pid = params.pid;
    var $productionStatus = params["status"];
    var productionPlan ={
        pid : null,
        configFlag : false,
    };

    if (jQuery().datepicker) {
        $('.date-picker').datepicker({
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
            autoclose:true
        });
    }

    var displayFunc = (function () {
        var renderList = function(tableId,listData){
            var $tableWrap = $('#'+tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){
                $.each(listData,function(i,v){
                  
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var $btnSub = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
                    var $btnPrograss = $('<a></a>').addClass('btn btn-minier btn-success').html('生产进度');
                    var $btnUpload = $('<a></a>').addClass('btn btn-minier btn-warning').html('上传');
                    var $product = $('<a></a>').addClass('btn btn-minier btn-inverse').html('开始生产');
                    var $btnStorehouse = $('<a></a>').addClass('btn btn-minier btn-danger').html('入库');
                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-pink').html('编辑');
                    var $btnDelivery = $('<a></a>').addClass('btn btn-minier btn-purple').html('送货');
                    var propertyArr = [
                        ["投料时间:", v.startTime, "green"],
                        ["出货时间:", v.endTime, "green"],
                        ["状态:", v.status == 0 ? '初始' : v.status == 1 ? '入库' : v.status == 2 ? '送货' : '生产中', "red"],
                        ["备注:",v.comment,"grey"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    if($productionStatus == 4 || $productionStatus == 5){
                        $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload);
                    }else{

                        if(v.status == 0){//状态为初始
                            $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($product).append($btnEdit);
                        }

                        if(v.status == 3){//状态为生产中
                            $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($btnStorehouse);
                        }

                        if(v.status == 1){//状态为入库
                            $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($btnDelivery);
                        }

                        if(v.status == 2 ){//状态为送货
                            $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload);
                        }
                    }

                    $h3.append($title).append($btnDiv);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    
                    $btnSub.click(function () {
                        params["productionPlan.ppid"] = v.ppid;
                        params["productionPlan.status"] = v.status;
                        params["production"] = $productionStatus;
                        com.switchPage(api.index.productionPlanItemIndex.url);
                    });

                    $btnPrograss.click(function () {
                        params["productionPlan.ppid"] = v.ppid;
                        params["productionPlan.status"] = v.status;
                        params["production.status"] = $productionStatus;
                        com.switchPage(api.index.productionPlanDetailIndex.url);

                    });

                    $btnUpload.click(function(){

                        $("#layerImport").find('.infobox').remove();
                        openlayerImport();

                        if(v.path){
                            createLine(v.path, v.comment);
                        }

                        $('#importProductionPlanExcel').empty();

                        hidBtn($('#importProductionPlanExcel'), v.status);

                        $("#importProductionPlanExcel").Huploadify({
                            'debug': false, // 开启调试
                            'auto': true, // 是否自动上传
                            'successTimeout': 99999, // 超时时间
                            'formData': { // 附带值
                                'uploadType': 2
                            },
                            'buttonClass': 'btn btn-success blue',
                            'buttonText': "添加上传文件",
                            'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
                            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
                            'uploader':config.media + api.common.uploadOther.url, // 上传处理程序
                            'width' : '100',
                            'height': '30', // 浏览按钮的高度
                            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
                            'fileTypeExts': "*.xlsx", // 允许上传的文件后缀
                            'fileSizeLimit': '5MB', // 上传文件的大小限制
                            'multi': true,
                            'queueSizeLimit': 1, // 上传数量
                            'onUploadSuccess': function (file, data, response) {
                                updateProductionPlanPath(data, v.ppid);
                                // 上传到服务器，服务器返回相应信息到data里
                            }});

                    });

                    $btnEdit.click(function () {
                        productionPlan.ppid = v.ppid;
                        $('#startTime').val(v.startTime);
                        $('#endTime').val(v.endTime);
                        $('#comment').val(v.comment);
                        editProductionPlan(function () {
                            if(checkTime()==true){
                                var startTime = $('#startTime').val();
                                var endTime = $('#endTime').val();
                                var comment = $('#comment').val();
                                var ppid = productionPlan.ppid;
                                com.post(api.production.updateProductionPlan,{
                                    "productionPlan.ppid" : ppid,
                                    "productionPlan.startTime" : startTime,
                                    "productionPlan.endTime" : endTime,
                                    "productionPlan.comment" : comment
                                },function (res) {
                                    layer.closeAll();
                                    $('#layerAdd').find('input').val("");
                                    layer.msg("修改成功");
                                    searcher.doSearch();
                                },function () {
                                    layer.msg("修改失败");
                                })
                            }else{
                                layer.msg("请检查投料时间和出货时间");
                            }
                        });
                    });

                    $btnStorehouse.click(function () {
                        var status = v.status;
                        var ppid = v.ppid;

                        com.post(api.production.updateProductionPlanForStatus,{
                            "productionPlan.ppid" : ppid,
                            "productionPlan.status" : 1
                        },function (res) {
                            layer.msg("已入库");
                            searcher.doSearch();
                        })
                    });

                    $product.click(function () {
                        var status = v.status;
                        var ppid = v.ppid;


                        if($productionStatus == 0 || $productionStatus == 1){
                            layer.msg("未审核无法进行生产");
                            return false;
                        }
                        //将生产单的状态更改为生产
                        com.post(api.production.updateProductionPlanForStatus,{
                            "productionPlan.ppid" : ppid,
                            "productionPlan.status" : 3
                        },function (res) {
                            searcher.doSearch();
                            if($productionStatus != 3 ){
                                com.post(api.production.updateProductionForStatus,{"production.pid":pid,"production.status":3}
                                ,function (res) {
                                        $productionStatus = 3;//更改当前js文件内的状态，防止多次生产报错
                                        layer.msg("开始进行生产");
                                    },null,false)
                            }

                        })
                    });

                    $btnDelivery.click(function () {
                        var status = v.status;
                        var ppid = v.ppid;

                        com.post(api.production.updateProductionPlanForStatus,{
                            "productionPlan.ppid" : ppid,
                            "productionPlan.status" : 2
                        },function (res) {
                            layer.msg("已送货");
                            searcher.doSearch();
                        })

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

    var _arr = ["p_startTime","p_endTime","p_productionPlanStatus"];

    searcher.init(_arr,'condList',api.production.pageProductionPlan,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation","productionPlanPostData",{"production.pid" : pid},false,null,function () {

        var $adda = $('<a></a>').addClass('btn btn-xs btn-info pull-left').attr('name', 'add').css("margin", "0px 3px").html('添加');

        hidBtn($adda,0);

        $adda.click(function () {
            $('#layerAdd').find('input').val("");
            addProductionPlan(function () {

                if(submitValidate() == true && checkTime() == true){
                    addProduction();
                }else{
                    layer.msg("请检查投料时间和出货时间");
                }

            });
        });

        var $back = $('<a></a>').addClass('btn btn-xs pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $backi = $('<i></i>').addClass('m-icon-swapleft').appendTo($back);
        var $backspan = $('<span></span>').text('返回').appendTo($back);

        $back.click(function () {
            com.switchPage(api.index.productionIndex.url);
        });
        return [$adda,$back];

    });
    
    function addProductionPlan(addCallBack) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "新增",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {

                addCallBack(index,layero)
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    function editProductionPlan(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "编辑",
            content: $('#layerAdd'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index,layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            }
        });
    }

    var submitValidate = function () {
        var flag = true;
        if($('#startTime').val() == ""){
            layer.msg("请填写投料时间");
            flag = false;
        }
        if($('#endTime').val() == ""){
            layer.msg("请填写出货时间");
            flag = false;
        }
        return flag;
    };

    function checkTime(){

        var flag = true;
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();

        if(startTime == "" || endTime == ""){
            flag = false;
        }
        var beginTime = new Date(startTime);
        var finishTime = new Date(endTime);
        if(beginTime.getTime() > finishTime.getTime()){
            flag = false;
        }
        return flag;
    }

    function addProduction() {
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            var comment = $('#comment').val();
            com.post(api.production.addProductionPlan,{
                "productionPlan.pid" : pid,
                "productionPlan.startTime" : startTime,
                "productionPlan.endTime" : endTime,
                "productionPlan.comment" : comment
            },function () {
                layer.closeAll();
                layer.msg("添加成功");
                searcher.doSearch();
            },function () {
                layer.msg("添加失败");
            });

    }

    function openlayerImport(){
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "导入excel",
            content: $('#layerImport'),
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layers, index) {

            },
            end: function () {

            }
        });
    }


    function createLine(path, comment){

        var $line = $layerImport.find(".infobox-container");

        var $name = comment+".xlsx";

        var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");

        var $iconGrouop = $("<div></div>").addClass("infobox-icon");
        var $icondownload = $("<a></a>").addClass("icon-download-alt");
        com.downloadFile($icondownload, path, $name);

        var $dataGrouop = $("<div></div>").addClass("infobox-data");
        var $name = $("<div></div>").addClass("infobox-content").html($name);

        $dataGrouop.append($name);
        $iconGrouop.append($icondownload);
        $box.append($iconGrouop).append($dataGrouop);
        $line.append($box)

    }


    function updateProductionPlanPath(data,ppid){

        var dateObj = eval("(" + data + ")");
        var option = {};

        option["productionPlan.ppid"] = ppid;

        if (dateObj.errorCode == 0) {
            option["productionPlan.path"] = dateObj.resUrl;
        }else{
            layer.msg('上传失败',{icon:2,time:2000});
        }

        com.post(api.production.updateProductionPlan,option,function(res){
            layer.closeAll();
            layer.msg('上传成功',{icon:1,time:2000});
            searcher.doSearch();
        },function(){
            layer.closeAll();
            layer.msg('上传失败',{icon:2,time:2000});
            searcher.doSearch();
        })
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if($productionStatus == 5 || $productionStatus == 4 || $productionStatus == 3) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});

