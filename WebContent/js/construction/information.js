
jQuery(function($) {

    var information = {

        typeness:{},
        projectStatus:{},
        editFlg: false,
    };

    var displayFunc = (function(){

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.decoration.orderId));
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $invalid = $('<div></div>').addClass('pull-right');
            var $btnConplan = $('<a></a>').addClass('btn btn-minier btn-yellow').html("施工计划");

            var propertyArr = [
                ["装修单: ", v.decoration.orderId, "blue", function(btn) {

                    tools.decoration.info(btn, v.decoration.orderId);
                }],
                ["楼盘: ", v.decoration.house.village.name, "grey", function(btn) {

                    tools.house.info(btn, v.decoration.house.hid);
                }],
                ["楼号: ", v.decoration.house.houseNumber, "grey"],
                ["客户: ", v.decoration.customer.name, "grey", function(btn) {

                    tools.customer.info(btn, v.decoration.customer.cid);
                }],
                ["设计分区:", v.decoration.designer.dept.fatherDept.name, "grey", function(btn) {

                    tools.department.info(btn, v.decoration.designer.dept.fatherDept.did);
                }],
                ["设计部:", v.decoration.designer.dept.name, "grey", function(btn) {

                    tools.department.info(btn, v.decoration.designer.dept.did);
                }],
                ["设计师:", v.decoration.designer.userName, "grey", function(btn) {

                    tools.personel.info(btn, v.decoration.designer.userId);
                }],
                ["监理:", v.decoration.supervisor ? v.decoration.supervisor.userName : "", "grey", function(btn) {

                    tools.personel.info(btn, v.decoration.supervisor.userId);
                }],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["合同额: ", v.decoration.orderTotalPrice, "blue"],
                ["报价版本: ", v.decoration.version.name, "grey"],
                ["签单时间: ", v.decoration.contractTime, "green"],
                ["预计交钥匙时间: ", v.keyTime, "green"],
                ["预计放线时间: ", v.drawlineTime, "green"],
                ["预计完工时间: ", v.finishTime, "green"],
                ["预计设计完成时间: ", v.designTime, "green"],
                ["合同方案确认时间: ", v.decoration.sdesignTime, "green"],
                ["放线方案确认时间: ", v.decoration.edesignTime, "green"],
                ["装修单类型: ", constant.decoration().decoration.typeness.keys[v.decoration.typeness], "red"],
                ["工程状态: ", constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $btnDiv.append($btnConplan).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnConplan.click(function() {
                viewConstructionPlanIndex(v);
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

    var searcher = new Searcher();

    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus',"construction-info-keyTime","construction-info-drawlineTime","construction-info-finishTime","construction-info-designTime","decoration-sdesignTime","decoration-edesignTime"], "condList", api.construction.pageConstructionInfo, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionInfoPostData",null, false, null,function(){

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse').attr('id', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        return [$exporta];
    },'resultList');

    com.focusPage("#export").click(function() {
        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.construction.pageConstructionInfo, $.extend({}, params.constructionInfoPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["装修单号", "decoration.orderId"],
                    ["楼盘地址", "decoration.house.houseNumber"],
                    ["面积", "decoration.house.buildArea"],
                    ["设计分区", "decoration.designer.dept.fatherDept.name"],
                    ["设计部", "decoration.designer.dept.name"],
                    ["设计师", "decoration.designer.userName"],
                    ["签单时间", "decoration.contractTime"],
                    ["预计交钥匙时间", "keyTime"],
                    ["预计放线时间", "drawlineTime"],
                    ["预计完工时间", 'finishTime'],
                    ["预计设计完成时间", 'designTime'],
                    ["合同方案确认时间", 'decoration.sdesignTime'],
                    ["放线方案确认时间", 'decoration.edesignTime'],
                    ["订单类型", "decoration.typeness"],
                    ["工程状态", "decoration.projectStatus"]
                ],
                list: res.paging.data

            }, function (v) {

                v.orderId = v.orderId == null ? "" : v.orderId;
                v.decoration.house.houseNumber = (v.decoration.house == null ? " " : v.decoration.house.village.cityProper.city.name + " " + v.decoration.house.village.cityProper.name + " " + v.decoration.house.village.name + " " + v.decoration.house.houseNumber);
                v.decoration.house.buildArea = (v.decoration.house == null ? " " : v.decoration.house.buildArea);
                v.decoration.designer.userName = (v.decoration.designer == null ? " " : v.decoration.designer.userName);
                v.decoration.designer.dept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.name);
                v.decoration.designer.dept.fatherDept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.fatherDept.name);
                v.decoration.contractTime = (v.decoration.contractTime == null ? "" : v.decoration.contractTime);
                v.keyTime = (v.keyTime == null ? "" : v.keyTime);
                v.drawlineTime = (v.drawlineTime == null ? "" : v.drawlineTime);
                v.finishTime = (v.finishTime == null ? "" : v.finishTime);
                v.decoration.sdesignTime = (v.decoration.sdesignTime == null ? "" : v.decoration.sdesignTime);
                v.decoration.edesignTime = (v.decoration.edesignTime == null ? "" : v.decoration.edesignTime);
                v.decoration.typeness = constant.decoration().decoration.typeness.keys[v.decoration.typeness];
                v.decoration.projectStatus = constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus];
            });
        });
    });

    function viewConstructionPlanIndex(v) {

        params.construction = v;

        com.popup4page("#stockRecordPopUp", "/views/construction/constructionPlan.html", "计划");
    }
});