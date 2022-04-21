jQuery(function($) {

    var complain = {

        cid: null,
        complainLevel:{},
        complainStatus:{},
        complainGladness :{},
        editFlg: false
    };

    com.post(api.ds.customer, {}, function(res){
        complain.complainLevel = res.complainLevel.split("key", "value");
        complain.complainStatus = res.complainStatus.split("key", "value");
        complain.complainGladness = res.complainGladness.split("key", "value");
    },null ,false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.decoration.orderId);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnComplaint = $('<a></a>').addClass("btn btn-minier btn-yellow").html('投诉内容');
            var $btnFinish = $("<a></a>").addClass('btn btn-minier btn-success').html("完结");
            var $btnClose = $("<a></a>").addClass('btn btn-minier btn-warning').html("关闭");

            var propertyArr = [
                ["创建人: ", v.creater.currentName, "grey"],
                ["操作人: ", v.updater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["操作时间: ", v.updateTime, "green"],
                ["完成时间: ", v.finishTime, "green"],
                ["等级: ", complain.complainLevel[v.level], "red"],
                ["状态: ", complain.complainStatus[v.status], "red"],
                ["满意度: ", complain.complainGladness[v.gladness], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnComplaint);
            if(v.status == 1){
                $btnDiv.append($btnFinish);
            }else if(v.status == 2){
                $btnDiv.append($btnClose);
            }
            $h3.append($title).append($btnDiv);

            $btnComplaint.click(function () {

                params.customer.aid = v.cid;
                com.popup4page("#stockRecordPopUp", api.index.complaint.url, "投诉内容");
            });

            $btnFinish.click(function () {
                com.post(api.customer.finishComplain, {"complain.cid": v.cid}, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });

            $btnClose.click(function () {
                com.post(api.customer.closeComplain, {"complain.cid": v.cid}, function (res) {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["customer-service-orderId", "customer-service-creater-name", "customer-service-updater-name", "customer-complain-status", "customer-complain-level"], "condList", api.customer.pageComplain, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "complainPostData",null, false, null, null,"resultList");

})