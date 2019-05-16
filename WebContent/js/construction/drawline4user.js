jQuery(function ($) {

    var drawline = {
       
        orderId: null,
        
        cancelBtn: com.focusPage("#cancelBtn"),
        deployedBtn: com.focusPage("#deployedBtn"),
        
        setupModal: com.focusPage("#setupModal"),
            
        items: {},
        
        decorationStatus: {},
        constructionSchedule: {0: "初始", 1: "开工", 2: "完工"}
    }

    drawline.deployedBtn.on("click", deployed);
    
    com.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes, function (i, v) {
            drawline.constructionSchedule[v.sort] = v.name;
        });
    }, null, false);
    
    com.post(api.ds.decoration, {}, function (res) {
        $.each(res.decorationOrderStatus, function (i, v) {
            drawline.decorationStatus[v.key] = v.value;
        });
    }, null, false);

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name": "工程部", "user.status": 0}, "userBases", "userId", "currentName", null);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {

                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDeploy = $('<a></a>').addClass('btn btn-minier btn-yellow').html('人员部署');

            var propertyArr = [
                ["楼盘地址:", v.house.village.name + ' ' + v.house.houseNumber, "grey"],
                ["客户:", v.customer.name, "grey"],
                ["设计师:", v.designer.userName, "grey"],
                ["面积:", v.house.buildArea, "blue"],
                ["创建时间:", v.createTime, "green"],
                ["进度:", drawline.constructionSchedule[v.projectStatus], "red"],
                ["状态:", drawline.decorationStatus[v.status], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDeploy).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDeploy.click(function () {
                showSetup(v);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    searcher.init(["c_orderId", "c_designer", "c_salesman"], "condList", api.construction.pageConstruction, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "drawLinePersonPostData");

    function showSetup(v) {

        var options = {
            "construction.orderId": v.orderId
        };
        
        com.post(api.construction.queryConstructionByOrderId, options, function (res) {
            
            if(res.construction.supervisor){
                com.updateTypeahead("supervisor", res.construction.supervisor.userId, res.construction.supervisor.userName);
            }else{
                com.cleanTypeahead("supervisor");
            }
            
            drawline.setupModal.modal("show");
        });
        
        drawline.orderId = v.orderId;
    }

    function deployed() {
        
        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": drawline.orderId,
            "construction.supervisor.userId": drawline.items.supervisor.attr('data-typeahead-key')
        };

        com.post(api.construction.updateConstructionByOrderId, options, function (res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            
            drawline.items.setupModal.modal("hide");
        });
    }

});

