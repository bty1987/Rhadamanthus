jQuery(function($) {

    var information = {

        typeness: {},
        projectStatus: {},

        modals: {
            contructionNodeModal: com.focusPage("#contructionNodeModal"),
            checkModal: com.focusPage("#checkModal"),
            handoverModal: com.focusPage("#handoverModal"),
        },

        btns: {
            checkBtn: com.focusPage("#checkBtn", "#checkModal").click(checkInfo),
            handoverBtn: com.focusPage("#handoverBtn", "#handoverModal").click(handoverInfo),
        },

        nodeItems: {
            contructionNodes: com.focusPage("#contructionNodes", "#contructionNodeModal"),
        },

        items: {
            isCheck: com.focusPage("#isCheck", "#checkModal"),
            handoverStatus: com.focusPage("#handoverStatus", "#handoverModal"),
        },

        info: null,

        pageType: params.urlLoadParams.type,
    };

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    information.items.isCheck.bindData(constant.construction().constructionInfo.isCheck.datas, "key", "value");
    information.items.handoverStatus.bindData(constant.construction().constructionInfo.handoverStatus.datas, "key", "value");

    function buildConstructionInfoLineprops() {

        return [{
            field: "decoration.orderId",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.decoration.orderId);
            }
        }, {
            field: "decoration.house.village.name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.decoration.house.hid);
            }
        }, {
            field: "decoration.house.houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "decoration.customer.name",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.decoration.customer.cid);
            }
        }, {
            field: "decoration.designer.dept.fatherDept.name",
            name: "设计分区",
            prop: "decoration.designer.dept.fatherDept.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.department.info(btn, v.decoration.designer.dept.fatherDept.did);
            }
        }, {
            field: "decoration.designer.dept.name",
            name: "设计部",
            prop: "decoration.designer.dept.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.department.info(btn, v.decoration.designer.dept.did);
            }
        }, {
            field: "decoration.designer.userName",
            name: "设计师",
            prop: "decoration.designer.userName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.designer.userId);
            }
        }, {
            field: "decoration.salesman.currentName",
            name: "业务员",
            prop: function(v) { return v.decoration.salesman ? v.decoration.salesman.currentName : ""; },
            clazz: "grey"
        }, {
            field: "decoration.escorter.currentName",
            name: "方案设计",
            prop: function(v) { return v.decoration.escorter ? v.decoration.escorter.currentName : ""; },
            clazz: "grey"
        }, {
            field: "decoration.supervisor.userName",
            name: "监理",
            prop: function(v) { return v.decoration.supervisor ? v.decoration.supervisor.userName : ""; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.supervisor.userId);
            }
        }, {
            field: "decoration.status",
            name: "装修状态",
            prop: function(v) { return constant.decoration().decoration.status.keys[v.decoration.status]; },
            clazz: "red"
        }, {
            field: "decoration.typeness",
            name: "装修业务",
            prop: function(v) { return constant.decoration().decoration.typeness.keys[v.decoration.typeness]; },
            clazz: "red"
        }, {
            field: "decoration.house.buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "decoration.orderTotalPrice",
            name: "合同额",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
        }, {
            field: "decoration.version.name",
            name: "报价版本",
            prop: "decoration.version.name",
            clazz: "grey"
        }, {
            field: "decoration.contractTime",
            name: "签单时间",
            prop: "decoration.contractTime",
            clazz: "green"
        }, {
            field: "designPeriod",
            name: "设计天数",
            prop: function(v) { return v.designPeriod ? v.designPeriod + "天" : ""; },
            clazz: "blue"
        }, {
            field: "designOverdueDays",
            name: "设计超期天数",
            prop: function(v) { return v.designOverdueDays ? v.designOverdueDays + "天" : ""; },
            clazz: "blue"
        }, {
            field: "issueTime",
            name: "分配时间",
            prop: "issueTime",
            clazz: "green"
        }, {
            field: "initDesignTime",
            name: "初始设计完成时间",
            prop: "initDesignTime",
            clazz: "green"
        }, {
            field: "keyTime",
            name: "预计交钥匙时间",
            prop: "keyTime",
            clazz: "green"
        }, {
            field: "drawlineTime",
            name: "预计放线时间",
            prop: "drawlineTime",
            clazz: "green"
        }, {
            field: "finishTime",
            name: "预计完工时间",
            prop: "finishTime",
            clazz: "green"
        }, {
            field: "designTime",
            name: "预计设计完成时间",
            prop: "designTime",
            clazz: "green"
        }, {
            field: "decoration.sdesignTime",
            name: "合同方案确认时间",
            prop: "decoration.sdesignTime",
            clazz: "green"
        }, {
            field: "decoration.edesignTime",
            name: "放线方案确认时间",
            prop: "decoration.edesignTime",
            clazz: "green"
        }, {
            field: "decoration.typeness",
            name: "装修类型",
            prop: function(v) { return constant.decoration().decoration.typeness.keys[v.decoration.typeness]; },
            clazz: "red"
        }, {
            field: "decoration.projectStatus",
            name: "工程状态",
            prop: function(v) { return constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus]; },
            clazz: "red"
        }, {
            field: "handoverStatus",
            name: "交接状态",
            prop: function(v) { return constant.construction().constructionInfo.handoverStatus.keys[v.handoverStatus] || "-"; },
            clazz: "red"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];
    }

    function buildConstructionInfoLinebtns() {

        return {
            view: {
                name: "记录",
                clazz: "btn-yellow",
                handle: function(v) {
                    params.orderId = v.decoration.orderId;
                    com.popup4page("#stockRecordPopUp", api.index.constructionRecordIndex.url, "记录");
                }
            },
            service: {
                name: "服务",
                clazz: "btn-purple",
                handle: function(v) {
                    viewDecorationService(v.decoration.orderId);
                }
            },
            conplanPrint: {
                name: "打印",
                clazz: "btn-success",
                handle: function(v) {
                    params.construction = v;
                    com.popup("工程施工进度计划表", api.index.constructionPlan2print.url, null, null, true);
                }
            },
            conplan: {
                name: "施工计划",
                clazz: "btn-warning",
                handle: function(v) {
                    params.construction = v;
                    com.popup4page("#stockRecordPopUp", "/views/construction/constructionPlan.html", "计划");
                }
            },
            proLine: {
                name: "预派监理",
                clazz: "btn-inverse",
                handle: function(v) {
                    pretreat(v);
                }
            },
            check: {
                name: "验房",
                clazz: "btn-info",
                handle: function(v) {
                    information.info = v;
                    information.modals.checkModal.modal("show");
                }
            },
            handover: {
                name: "交接",
                clazz: "btn-pink",
                handle: function(v) {
                    information.info = v;
                    com.focusPage("#handoverStatus").val(v.handoverStatus || 0);
                    information.modals.handoverModal.modal("show");
                }
            },
            profile: {
                name: "画像",
                clazz: "btn-warning",
                handle: function(v) {
                    viewDecorationProfile(v.decoration.orderId);
                }
            },
            resetDesign: {
                name: "重置设计",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("确定要重置该订单的设计状态和确认状态吗？", function() {
                        com.post(api.decoration.resetDecorationFordesignStatus, {
                            "decoration.orderId": v.decoration.orderId
                        }, function(res) {
                            com.showAlert(com.info, "重置成功");
                            searcher.doSearch();
                        });
                    });
                }
            }
        };
    }

    function buildConstructionInfoButtons() {

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse').attr('id', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        return [$exporta];
    }

    var searcher = new Searcher();

    var options = {
        "constructionInfo.drawlineTime": ""
    }

    if (information.pageType == "plan") {

        var current = new Date();

        current.setMonth(current.getMonth() + 2)

        options["constructionInfo.decoration.houseType"] = "期房";
        options["constructionInfo.decoration.designStatus"] = constant.decoration().decoration.DESIGNSTATUS_END_INT;
        options["constructionInfo.isIssue"] = 0;
        options["constructionInfo.drawlineTime"] = com.dateFormat(current, "yyyy-MM-dd");
        options["decoration.statuses"] = [0, 1, 2, 3, 4, 7]; // 排除废单(5)、终止(6)、完工(8)
    }

    if (information.pageType == "done") {
        options["constructionInfo.decoration.houseType"] = "现房";
        options["constructionInfo.decoration.designStatus"] = constant.decoration().decoration.DESIGNSTATUS_END_INT;
        options["constructionInfo.isIssue"] = 0;
        options["decoration.statuses"] = [0, 1, 2, 3, 4, 7]; // 排除废单(5)、终止(6)、完工(8)
    }

    if (information.pageType == "issue") {
        options["constructionInfo.isIssue"] = 1;
    }

    if (information.pageType == "contract") {
        options["decoration.statuses"] = [2, 3, 7];
        options["constructionInfo.isIssue"] = 0;
    }

    searcher.set("condList", "pagenation", "resultList", api.construction.pageConstructionInfo, options, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-supervisor', 'decoration-houseType', 'decoration-designStatus', 'decoration-statuses', 'decoration-projectStatus', "construction-info-keyTime", "construction-info-drawlineTime", "construction-info-finishTime", "construction-info-designTime", "construction-info-issueTime", "decoration-sdesignTime", "decoration-edesignTime", "construction-info-isIssue", "construction-info-isCheck"], "constructionInfoPostData", null, false, buildConstructionInfoButtons);
    searcher.line("decoration.orderId", buildConstructionInfoLineprops(), buildConstructionInfoLinebtns()).render();

    com.focusPage("#export").click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.construction.pageConstructionInfo, $.extend({}, params.constructionInfoPostData, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["装修单号", "decoration.orderId"], ["楼盘地址", "decoration.house.houseNumber"], ["面积", "decoration.house.buildArea"], ["计划面积", "decoration.house.innerArea"], ["设计分区", "decoration.designer.dept.fatherDept.name"], ["设计部", "decoration.designer.dept.name"], ["设计师", "decoration.designer.userName"], ["业务员", "decoration.salesman.currentName"], ["监理", "decoration.supervisor.userName"], ["签单时间", "decoration.contractTime"], ["合同额", "decoration.orderTotalPrice"], ["预签合同额", "decoration.procontractPrice"], ["折扣", "decoration.discount"], ["设计天数", "designPeriod"], ["设计超期天数", "designOverdueDays"], ["分配时间", "issueTime"], ["初始设计完成时间", "initDesignTime"], ["预计交钥匙时间", "keyTime"], ["预计放线时间", "drawlineTime"], ["预计完工时间", 'finishTime'], ["预计设计完成时间", 'designTime'], ["合同方案确认时间", 'decoration.sdesignTime'], ["放线方案确认时间", 'decoration.edesignTime'], ["订单类型", "decoration.typeness"], ["工程状态", "decoration.projectStatus"]],
                list: res.paging.data

            }, function(v) {

                v.orderId = v.orderId == null ? "" : v.orderId;
                v.decoration.house.houseNumber = (v.decoration.house == null ? " " : v.decoration.house.village.cityProper.city.name + " " + v.decoration.house.village.cityProper.name + " " + v.decoration.house.village.name + " " + v.decoration.house.houseNumber);
                v.decoration.house.buildArea = (v.decoration.house == null ? " " : v.decoration.house.buildArea);
                v.decoration.house.innerArea = (v.decoration.house == null ? " " : v.decoration.house.innerArea);
                v.decoration.designer.userName = (v.decoration.designer == null ? " " : v.decoration.designer.userName);
                v.decoration.designer.dept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.name);
                v.decoration.designer.dept.fatherDept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.fatherDept.name);
                v.decoration.salesman.currentName = (v.decoration.salesman == null ? " " : v.decoration.salesman.currentName);
                v.decoration.supervisor.userName = (v.decoration.supervisor == null ? " " : v.decoration.supervisor.userName);
                v.decoration.contractTime = (v.decoration.contractTime == null ? "" : v.decoration.contractTime);
                v.decoration.orderTotalPrice = (v.decoration.orderTotalPrice == null ? "" : v.decoration.orderTotalPrice);
                v.decoration.procontractPrice = (v.decoration.procontractPrice == null ? "" : v.decoration.procontractPrice);
                v.decoration.discount = (v.decoration.discount == null ? "" : v.decoration.discount);
                v.designPeriod = (v.designPeriod == null ? "" : v.designPeriod);
                v.designOverdueDays = (v.designOverdueDays == null ? "" : v.designOverdueDays);
                v.issueTime = (v.issueTime == null ? "" : v.issueTime);
                v.initDesignTime = (v.initDesignTime == null ? "" : v.initDesignTime);
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

    var pretreat = function(v) {

        com.cleanTypeahead("supervisor");

        params.decoration.orderId = v.decoration.orderId;

        information.modals.contructionNodeModal.modal("show");
        information.nodeItems.contructionNodes.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        var constructionNodes = {};

        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes.sort(function(a, b) {

                return a.sort - b.sort;
            });
        }, null, false);

        $.each(constructionNodes, function(index, value) {

            if (value.proset != constant.data().constructionNode.PROSET_PROSET_INT)
                return true;

            var $liLi = $('<li></li>').addClass('item-blue clearfix');
            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').css('padding-top', '6px');

            var propertyArr = [["工期: ", null, "grey"]];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "sorts",
                "sort": value.sort,
                "cnid": value.cnid,
                "prenum": "",
                "postnum": "",
            }).addClass('ace ace-checkbox-2');

            var $text = $('<input>').attr({
                "type": "text",
                "name": "timeLimits",
                "text_sort": value.sort,
                "value": value.timeLimit,
                "cnid": value.cnid,
            }).addClass('timeLimits ace ace-checkbox-2 v_required');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'normal').html(value.name);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').attr('style', 'font-weight:normal;font-size:20px').html(value[0]).append($text).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($divBtnWrap);

                $label.appendTo($h3);

                $divBtnWrap.appendTo($h3);

                $liLi.append($h3).append($ulPro);
            });

            $liLi.append($h3).append($ulPro).appendTo($uli);
        });

        $uli.appendTo(information.nodeItems.contructionNodes);

        var pace = null;

        com.post(api.data.queryConstructionPace, {
            "constructionPace.lowerArea": v.decoration.house.innerArea
        }, function(res) {

            pace = res.constructionPace;
        }, null, false);

        if (!pace || !pace.cpid)
            return false;

        com.post(api.data.queryConstructionPaceNode, {
            "constructionPaceNode.cpid": pace.cpid
        }, function(res) {

            $.each(res.constructionPaceNodes, function(i, v) {

                com.focusPage("input[cnid='" + v.node.cnid + "'][prenum]", "#contructionNodes").attr("prenum", v.prenum);
                com.focusPage("input[cnid='" + v.node.cnid + "'][postnum]", "#contructionNodes").attr("postnum", v.postnum);

                com.focusPage("input.timeLimits[cnid='" + v.node.cnid + "']", "#contructionNodes").val(v.period);

                // 默认勾选复选框
                com.focusPage("input[type='checkbox'][cnid='" + v.node.cnid + "']", "#contructionNodes").prop('checked', true);
            });

        }, null, false);

        com.post(api.construction.queryConstructionPlanByOrderId, {
            "constructionPlan.orderId": v.decoration.orderId
        }, function(res) {

            $.each(res.constructionPlans, function(i, v) {

                com.focusPage("input.timeLimits[cnid='" + v.cnid + "']", "#contructionNodes").val(v.connum);

                // 默认勾选已有施工计划的复选框
                com.focusPage("input[type='checkbox'][cnid='" + v.cnid + "']", "#contructionNodes").prop('checked', true);
            });
        });
    };

    com.focusPage("#seveSuccess").on("click", function() {

        if (com.validate("contructionNodeModal")) {
            return false;
        }

        var $inputs = com.focusPage('input[name="sorts"]:checked', '#contructionNodes');

        var option = {
            "drawLine.decoration.orderId": params.decoration.orderId,
            "drawLine.decoration.supervisor.userId": com.typeahead("supervisor"),
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            option["constructionNodes[" + i + "].cnid"] = $input.attr('cnid');
            option["constructionNodes[" + i + "].sort"] = $input.attr('sort');
            option["constructionNodes[" + i + "].prenum"] = $input.attr('prenum');
            option["constructionNodes[" + i + "].postnum"] = $input.attr('postnum');
            option["constructionNodes[" + i + "].timeLimit"] = $("input[text_sort=" + $input.attr('sort') + "]").val();
        });

        com.post(api.construction.pretreatDrawLine, option, function(res) {

            com.showAlert(com.info, "放线成功");

            searcher.doSearch();

            information.contructionNodeModal.modal("hide");
        });
    });

    function checkInfo() {

        var option = {
            "constructionInfo.ciid": information.information.ciid,
            "constructionInfo.isCheck": com.typeahead("supervisor"),
        };

        com.post(api.construction.checkConstructionInfo, option, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            information.checkModal.modal("hide");
        });
    }

    function handoverInfo() {

        // 确定使用哪个 orderId
        var orderId = information.info.orderId || information.info.decoration.orderId;

        if (!orderId) {
            com.showAlert(com.error, '订单ID为空，无法进行交接操作');
            return;
        }

        var option = {
            "constructionInfo.orderId": orderId,
            "constructionInfo.decoration.orderId": orderId,
            "constructionInfo.handoverStatus": com.focusPage("#handoverStatus").val(),
        };

        com.post(api.construction.handoverConstructionInfo, option, function(res) {

            com.showAlert(com.info, "交接成功");

            searcher.doSearch();

            information.modals.handoverModal.modal("hide");
        });
    }

    // 画像
    function viewDecorationProfile(orderId) {

        params.customer.orderId = orderId;
        params.customer.profile = {
            "orderId": orderId
        }

        com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");
    }

    // 服务功能
    function viewDecorationService(orderId) {

        params.decoration.orderId = orderId;

        com.popup4page("#servicePopUp", "/views/decoration/decoration4service.html", "服务功能: ");
    }
});