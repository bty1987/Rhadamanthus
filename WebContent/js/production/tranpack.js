$(function(){

    var tranpack = {

        saveBtn: com.focusPage("#saveBtnTranpack"),

        modals: {
            tranpackModal: com.focusPage("#tranpackModal"),
        },

        items: {
            pno : com.focusPage("#productionPno"),
            type : com.focusPage("#type"),
            rid : com.focusPage("#rid")
        },
        tranpackStatus : {}
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    com.post(api.ds.production, {}, function (res) {
        tranpack.tranpackStatus = res.tranpackStatus.split("key", "value");
    },null, false);

    var displayFunc = (function(){

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue') .html(v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $qrcode = $('<a></a>').addClass('btn btn-minier btn-yellow').html('二维码');
            var $btnInstore = $('<a></a>').addClass(' btn btn-minier btn-success').html('仓储');
            var $btnReceipt = $('<a></a>').addClass(' btn btn-minier btn-warning').html('物流');
            var $btnConfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('运输');
            var $btnInstall = $('<a></a>').addClass(' btn btn-minier btn-danger').html('安装');;
            var $btnComplete = $('<a></a>').addClass(' btn btn-minier btn-pink').html('完成');
            var $btnaBolition = $('<a></a>').addClass(' btn btn-minier btn-purple').html('丢失');

            var type = "";

            switch (v.type) {
                case 0:
                    type =  "外协";
                    break;
                case 1:
                    type = "五金";
                    break;
                case 2:
                    type = "计划";
                    break;
            }

            var propertyArr = [];

            $.each(pageConfig.propertyArr, function (pi, pv) {
                switch (pv) {
                    case "productionNo":
                        propertyArr.push(["生产单号:",v.production.pno,"blue"]);
                        break;
                    case "orderId":
                        propertyArr.push(["装修单号:", v.production.orderId, "blue"]);
                        break;
                    case "address":
                        propertyArr.push(["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"]);
                        break;
                    case "creater":
                        propertyArr.push(["创建人:", v.creater.userName, "grey"]);
                        break;
                    case "sender":
                        propertyArr.push(["送货人:", v.sender.userName, "grey"]);
                        break;
                    case "mounter":
                        propertyArr.push(["安装人:", v.mounter.userName, "grey"]);
                        break;
                    case "type":
                        propertyArr.push(["订单类型:",type,"red"]);
                        break;
                    case "createTime":
                        propertyArr.push(["创建时间:", v.createTime , "green"]);
                        break;
                    case "planTime":
                        propertyArr.push(["物流时间:", v.planTime , "green"]);
                        break;
                    case "tranTime":
                        propertyArr.push(["送货时间:", v.tranTime , "green"]);
                        break;
                    case "mountTime":
                        propertyArr.push(["安装时间:",v.mountTime,"green"]);
                        break;
                    case "status":
                        propertyArr.push( ["状态:", tranpack.tranpackStatus[v.status],"red"]);
                        break;
                }
            });

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(pageConfig.pageBtn, function (k, b) {
                switch (b) {
                    case "btnQrcode"://二维码
                            $btnDiv.append($qrcode);
                        break;
                    case "btnIntstore"://仓储
                        if (v.status == 0) {
                            $btnDiv.append($btnInstore);
                        }
                        break;
                    case "btnReceipt"://物流
                        if (v.status == 1) {
                            $btnDiv.append($btnReceipt);
                        }
                        break;
                    case "btnTransport"://运输
                        if (v.status == 2) {
                            $btnDiv.append($btnConfirm);
                        }
                        break;
                    case "btnInstall"://安装
                        if (v.status == 3) {
                            $btnDiv.append($btnInstall);
                        }
                        break;
                    case "btnComplete"://完成
                        if (v.status == 4) {
                            $btnDiv.append($btnComplete);
                        }
                        break;
                    case "btnBolition"://丢失
                        if ([0, 1, 2, 3].indexOf(v.status) != -1) {
                            $btnDiv.append($btnaBolition);
                        }
                        break;
                }
                $h3.append($title).append($btnDiv);
            });

            $liLine.append($h3).append($ulProperty);

            $qrcode.click(function(){
                com.focusPage('#qrcodeModal').modal('show');
                com.focusPage('#Qrcode').html("");

                com.focusPage('#Qrcode').qrcode({
                    render: "canvas", //也可以替换为table
                    width: 150,
                    height: 150,
                    text: "fanglinserver:"+v.no
                });
            });

            $btnInstore.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'1');
                });
            });

            $btnReceipt.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'2');
                });
            });

            $btnConfirm.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'3');
                });
            });

            $btnInstall.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'4');
                });
            });

            $btnComplete.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'5');
                });
            });

            $btnaBolition.click(function () {
                com.showConfirm("是否确认", function(){
                    updateStatus(v.tid,'6');
                });
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var tranpackSearcher = new Searcher();

    tranpackSearcher.init( pageConfig.condArr, "tranpackCondList", pageConfig.apiPage, function(data){
        displayFunc.init("tranpackResultList",data);
    }, "tranpackPagenation", pageConfig.postDataName, null, false, null,function(){},"tranpackResultList");

    function updateStatus(id,status){

        var url;

        switch (status) {
            case '1': url = api.production.instoreTranpack;
                break;
            case '2': url = api.production.planTranPack;
                break;
            case '3': url = api.production.tranTranpack;
                break;
            case '4': url = api.production.mountTranpack;
                break;
            case '5': url = api.production.completeTranpack;
                break;
            case '6': url = api.production.lossTranpack;
                break;
        }

        com.post(url, {"tranpack.tid" : id,"tranpack.status": status}, function () {
            com.showAlert(com.info, "操作成功");
            tranpackSearcher.doSearch();
        });
    }

});