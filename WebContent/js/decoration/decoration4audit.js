jQuery(function($) {

    var audit = {
        decorationStatus: {},
        type: {}
    };

    audit.decorationStatus = constant.decoration().decoration.status.keys;
    audit.type = constant.decoration().decoration.typeness.keys;

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnPrice = $('<a></a>').addClass('btn btn-minier btn-success').html('扣款');
            var $btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-warning').html('信息轴');
            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-inverse').html('申请审核');

            var propertyArr = [["楼盘地址:", v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"], ["客户:", v.decoration.customer.name, "grey"], ["设计师:", v.decoration.designer.currentName, "grey"], ["设计部:", v.decoration.designer.dept.name, "grey"], ["面积:", v.decoration.house.buildArea, "blue "], ["量房时间:", v.decoration.measureTime, "green"], ["签单时间:", v.decoration.contractTime, "green"], ["类型:", audit.type[v.decoration.type], "red"], ["状态:", audit.decorationStatus[v.decoration.status], "red"], ["审核状态:", v.auditer ? '已审核' : '未审核', "red"]];
            if (v.auditer) {
                $btnInfo = null;
                propertyArr.push(["审核人:", v.auditer.currentName, "grey"]);
                propertyArr.push(["审核时间:", v.auditTime, "green"]);

            }
            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnView).append($btnPrice).append($btnAddMinus).append($btnInfo).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function() {

                auditScale(v.decoration.orderId, v.decoration.type, v.decoration.typeness, v.versionId, v.notSalesmanRate);
            });

            $btnPrice.click(function() {

                viewAuditRecord(v.decoration.orderId, v.decoration.designer.uid, v.decoration.designer.dept.no);
            });

            $btnAddMinus.click(function() {

                viewdecorationTimelineIndex(v.decoration.orderId);
            });

            $btnInfo && $btnInfo.click(function() {

                applyAudit(v.aid);
            });

            return $liLine;
        };

        var viewAuditRecord = function(orderId, designerId, deptId) {

            params.decoration.orderId = orderId;
            params.decoration.designerId = designerId;
            params.decoration.deptId = deptId;
            params.decoration.auditStatusType = "admin";

            params.historyPage = api.index.auditIndex.url;

            com.switchPage(api.index.auditRecordIndex.url);
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            audit: function(v) {

                return creatLine(v);
            }
        };
    })();
    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-designer', 'decoration-supervisor', 'decoration-design-dept', 'decoration-createTime', 'decoration-signTime', 'decoration-auditTime', 'decoration-status', 'decoration-auditStatus', 'decoration-auditor'];
    var searcher = new Searcher();
    searcher.init(_condArr, "condList", api.decoration.pageAudit, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation");

    function applyAudit(aid) {

        com.showConfirm("确认审核吗?", function() {

            com.post(api.decoration.applyAudit, {
                "audit.aid": aid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    var auditScale = function(decorationOrderId, type, typeness, versionId, notSalesmanRate) {

        params.decoration.orderId = decorationOrderId;
        params.decoration.orderType = type;
        params.decoration.orderTypeness = typeness;
        params.decoration.versionId = versionId;
        params.decoration.notSalesmanRate = notSalesmanRate;

        params.decoration.viewNode = [{
            type: "basic",
            opt: {
                btn: ["customerInfosBtn"]
            }
        }, {
            type: "quotation",
            opt: {
                btn: ["btnPrintDefaultQuotationInfo"]
            }
        }, {
            type: "picture",
            opt: {
                display: ["OriginalPicture", "designPictures", "projectPictures", "contractMap", "CADProjectPicture"],
                show: ["designPictureUpload", "projectPictureUpload", "CADUpload", "ContractUpload", "OriginalUpload"]
            }
        }, {
            type: "material"
        }, {
            type: "activity"
        }, {
            type: "payment"
        }, {
            type: "belong"
        }, {
            type: "addreduce"
        }];

        params.historyPage = api.index.auditIndex.url;

        com.switchPage(api.index.decorationDetailIndex.url);
    };

    var viewdecorationTimelineIndex = function(orderId) {

        params.decoration.decorationOrderId = orderId;

        com.switchPage(api.index.decorationTimelineIndex.url);
    };
});