jQuery(function($) {

    var decorationBelong = {
        decorationType: {},

        decorationOrderStatus: {}
    };

    decorationBelong.decorationOrderStatus = constant.decoration().decoration.status.keys;
    decorationBelong.decorationType = constant.decoration().decoration.typeness.keys;

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-success').html('查看');
            var $btnDesign = $('<a></a>').addClass('btn btn-minier btn-yellow').html('设计');
            var $btnSalesman = $('<a></a>').addClass('btn btn-minier btn-primary').html('业务');

            var propertyArr = [["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"], ["客户名:", v.customer.name, "grey"], ["设计部:", v.designer.dept.name, "grey"], ["设计师:", v.designer.currentName, "grey"], ["业务部:", v.salesman.dept.name, "grey"], ["业务员:", v.salesman.currentName, "grey"], ["面积:", v.house.buildArea, "blue"], ["合同报价:", v.orderTotalPrice, "blue"], ["量房时间:", v.measureTime, "green"], ["类型:", decorationBelong.decorationType[v.type], "red"], ["状态:", decorationBelong.decorationOrderStatus[v.status], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnLook).append($btnDesign).append($btnSalesman).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnLook.click(function() {

                viewDecorationBelongDetail(v.orderId);
            });

            $btnDesign.click(function() {

                changeDecorationBelongDesigner(v.orderId);
            });

            $btnSalesman.click(function() {

                changeDecorationBelongBussiness(v.orderId);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-houseArea', 'decoration-designer', 'decoration-salesman', 'decoration-type', 'decoration-salesType'];

    var searcher = new Searcher();

    searcher.init(_condArr, "condList", api.decoration.pageDecorationForBelong, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "decorationBelongPostData");

    function viewDecorationBelongDetail(orderId) {

        params.decoration.orderId = orderId;

        // com.switchPage(api.index.decorationBelongInfoIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongInfoIndex.url, "装修单归属: " + orderId);
    }

    function changeDecorationBelongDesigner(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 0;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单设计归属: " + orderId);
    }

    function changeDecorationBelongBussiness(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 1;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单业务归属: " + orderId);
    }

});
