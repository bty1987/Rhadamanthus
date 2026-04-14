jQuery(function($) {

    var customerChance = {
        modals: {
            updateModal: com.focusPage("#updateModal"),
            issueModal: com.focusPage("#issueModal"),
            changeModal: com.focusPage("#changeModal"),
            approveModal: com.focusPage("#approveModal"),
            directApproveModal: com.focusPage("#directApproveModal"),
            firstApproveModal: com.focusPage("#firstApproveModal"),
            directFirstApproveModal: com.focusPage("#directFirstApproveModal"),
            belongApproveModal: com.focusPage("#belongApproveModal"),
            QRcodeModal: com.focusPage("#QRcodeModal"),
            configModal: com.focusPage("#configModal"),
            disableModal: com.focusPage("#disableModal"),
            discountModal: com.focusPage("#discountModal"),
        },
        items: {
            villageRule: com.focusPage("#villageRule"),
            region: com.focusPage("#region"),
            department: com.focusPage("#department"),
            belonger: com.focusPage("#belonger"),
            busitype: com.focusPage("#busitype"),
            isGroup: com.focusPage("#isGroup"),
            isPhone: com.focusPage("#isPhone"),
            isMeet: com.focusPage("#isMeet"),
            isTrue: com.focusPage("#isTrue"),
            isFine: com.focusPage("#isFine"),
            configEvent: com.focusPage("#configEvent", "#configModal"),

            houseType: com.focusPage("#houseType", "#changeModal"),
            houseClass: com.focusPage("#houseClass", "#changeModal"),
            orderType: com.focusPage("#orderType", "#changeModal"),
            resourceType: com.focusPage("#resourceType", "#changeModal"),

            villageNoDesigerApprove: com.focusPage("#villageNoDesigerApprove", "#approveModal"),
            houseNumberApprove: com.focusPage("#houseNumberApprove", "#approveModal"),
            nameApprove: com.focusPage("#nameApprove", "#approveModal"),
            phoneApprove: com.focusPage("#phoneApprove", "#approveModal"),
            busitypeApprove: com.focusPage("#busitypeApprove", "#approveModal"),
            houseTypeApprove: com.focusPage("#houseTypeApprove", "#approveModal"),
            houseClassApprove: com.focusPage("#houseClassApprove", "#approveModal"),
            orderTypeApprove: com.focusPage("#orderTypeApprove", "#approveModal"),
            resourceTypeApprove: com.focusPage("#resourceTypeApprove", "#approveModal"),
            approveMan: com.focusPage("#approveMan", "#approveModal"),
            approveComment: com.focusPage("#approveComment", "#approveModal"),

            directVillageNo: com.focusPage("#directVillageNo", "#directApproveModal"),
            directHouseNumber: com.focusPage("#directHouseNumber", "#directApproveModal"),
            directName: com.focusPage("#directName", "#directApproveModal"),
            directPhone: com.focusPage("#directPhone", "#directApproveModal"),
            directBusitype: com.focusPage("#directBusitype", "#directApproveModal"),
            directHouseType: com.focusPage("#directHouseType", "#directApproveModal"),
            directHouseClass: com.focusPage("#directHouseClass", "#directApproveModal"),
            directOrderType: com.focusPage("#directOrderType", "#directApproveModal"),
            directResourceType: com.focusPage("#directResourceType", "#directApproveModal"),

            firstApproveComment: com.focusPage("#firstApproveComment", "#firstApproveModal"),

            infolist: com.focusPage("#infolist"),

            annotate: com.focusPage("#annotate", "#disableModal"),

            discount: com.focusPage("#discount", "#discountModal"),
        },

        updateItems: {
            villageName: com.focusPage("#villageName", "#updateModal"),
            villageRule: com.focusPage("#villageRule", "#updateModal"),
            built: com.focusPage("#built", "#updateModal"),
            unit: com.focusPage("#unit", "#updateModal"),
            floor: com.focusPage("#floor", "#updateModal"),
            door: com.focusPage("#door", "#updateModal"),
            builtrule: com.focusPage("#builtrule", "#updateModal"),
            unitrule: com.focusPage("#unitrule", "#updateModal"),
            floorrule: com.focusPage("#floorrule", "#updateModal"),
            doorrule: com.focusPage("#doorrule", "#updateModal"),
            rule: com.focusPage("#rule", "#updateModal"),
            busitype: com.focusPage("#busitype", "#updateModal"),
            rate: com.focusPage("#rate", "#updateModal"),
            phone: com.focusPage("#phone", "#updateModal")
        },

        approveItems: {
            villageName: com.focusPage("#villageName", "#firstApproveModal"),
            villageRule: com.focusPage("#villageRule", "#firstApproveModal"),
            built: com.focusPage("#built", "#firstApproveModal"),
            unit: com.focusPage("#unit", "#firstApproveModal"),
            floor: com.focusPage("#floor", "#firstApproveModal"),
            door: com.focusPage("#door", "#firstApproveModal"),
            builtrule: com.focusPage("#builtrule", "#firstApproveModal"),
            unitrule: com.focusPage("#unitrule", "#firstApproveModal"),
            floorrule: com.focusPage("#floorrule", "#firstApproveModal"),
            doorrule: com.focusPage("#doorrule", "#firstApproveModal"),
            rule: com.focusPage("#rule", "#firstApproveModal"),
            busitype: com.focusPage("#busitype", "#firstApproveModal"),
            rate: com.focusPage("#rate", "#firstApproveModal"),
            phone: com.focusPage("#phone", "#firstApproveModal")
        },

        directFirstApproveItems: {
            villageName: com.focusPage("#directFirstVillageName", "#directFirstApproveModal"),
            villageRule: com.focusPage("#directFirstVillageRule", "#directFirstApproveModal"),
            built: com.focusPage("#directFirstBuilt", "#directFirstApproveModal"),
            unit: com.focusPage("#directFirstUnit", "#directFirstApproveModal"),
            floor: com.focusPage("#directFirstFloor", "#directFirstApproveModal"),
            door: com.focusPage("#directFirstDoor", "#directFirstApproveModal"),
            builtrule: com.focusPage("#directFirstBuiltrule", "#directFirstApproveModal"),
            unitrule: com.focusPage("#directFirstUnitrule", "#directFirstApproveModal"),
            floorrule: com.focusPage("#directFirstFloorrule", "#directFirstApproveModal"),
            doorrule: com.focusPage("#directFirstDoorrule", "#directFirstApproveModal"),
            rule: com.focusPage("#directFirstRule", "#directFirstApproveModal"),
            busitype: com.focusPage("#directFirstBusitype", "#directFirstApproveModal"),
            rate: com.focusPage("#directFirstRate", "#directFirstApproveModal"),
            phone: com.focusPage("#directFirstPhone", "#directFirstApproveModal")
        },

        belongItems: {
            belongApproveComment: com.focusPage("#belongApproveComment", "#belongApproveModal"),
        },

        btns: {
            issueSaveBtn: com.focusPage("#saveBtn", "#issueModal").on("click", issue),
            changeBtn: com.focusPage("#changeBtn", "#changeModal").on("click", change),
            approveBtn: com.focusPage("#approvalBtn", "#approveModal").on("click", approval),
            directApproveConfirmBtn: com.focusPage("#directApproveConfirmBtn", "#directApproveModal").on("click", directApproveConfirm),
            directFirstApproveConfirmBtn: com.focusPage("#directFirstApproveConfirmBtn", "#directFirstApproveModal").on("click", directFirstApproveConfirm),
            firstApprovalBtn: com.focusPage("#firstApprovalBtn", "#firstApproveModal").on("click", firstApproval),
            belongApprovalBtn: com.focusPage("#belongApprovalBtn", "#belongApproveModal").on("click", belongApproval),
            updateBtn: com.focusPage("#updateBtn", "#updateModal").on("click", update),
            configBtn: com.focusPage("#configBtn", "#configModal").on("click", configEvent),
            disableBtn: com.focusPage("#disableBtn", "#disableModal").on("click", disable),
            discountBtn: com.focusPage("#discountBtn", "#updateModal").on("click", discount),
        },

        atttypes: [],
        config: [],

        decoration: {
            "types": {}
        },

        source: {
            "csid": null
        },

        userRule: {
            "curid": null,
            "score": 0,
            "chance": 0,
            "polling": 0,
            "status": 0,
        },

        ccid: null,
        vid: null,

        orderId: null,

        source: {},
        chance: {},

        confirmEventType: null,
        show: null,

        depage: params['urlLoadParams'].depage,
        detype: params['urlLoadParams'].detype,
    };

    com.post(api.system.querySystemConfigByKey, {
        "systemConfig.key": "COUNTRY_PROFIT_FLAG_STR"
    }, function(res) {

        if (res.systemConfig.scid)
            customerChance.profitflag = res.systemConfig.value;
    });

    com.post(api.ds.building, {}, function(res) {

        customerChance.approveItems.builtrule.bindData(res.buildruleOne, "key", "value");
        customerChance.approveItems.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.approveItems.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.approveItems.doorrule.bindData(res.buildruleThr, "key", "value");

        customerChance.updateItems.builtrule.bindData(res.buildruleOne, "key", "value");
        customerChance.updateItems.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.updateItems.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.updateItems.doorrule.bindData(res.buildruleThr, "key", "value");

        customerChance.directFirstApproveItems.builtrule.bindData(res.buildruleOne, "key", "value");
        customerChance.directFirstApproveItems.unitrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.directFirstApproveItems.floorrule.bindData(res.buildruleTwo, "key", "value");
        customerChance.directFirstApproveItems.doorrule.bindData(res.buildruleThr, "key", "value");
    });

    function initVillage(items, args) {

        com.initTypeahead(items["villageName"], api.data.queryVillageForNameByPinyin, "pinyinName", args, "autoFillKeyValue", "key", "value", function(list, k, v) {

            com.post(api.data.queryVillageByVid, {
                "village.no": k

            }, function(res) {

                customerChance.vid = res.village.vid
                items["rule"].html("推荐楼牌号规则: " + (res.village.rule == null || res.village.rule == "" ? "暂无推荐规则" : res.village.rule));
            }, null, false);

            com.post(api.data.queryVillageRule, {
                "villageRule.vid": customerChance.vid
            }, function(res) {

                var rules = [];

                $.each(res.villageRules, function(i, v) {

                    rules.push(v.rule);
                });
                items["villageRule"].bindData(rules, "rule", "ruleContent", false).trigger("change");
            });
            return v;
        });
    }

    initVillage(customerChance.updateItems);
    initVillage(customerChance.approveItems);
    initVillage(customerChance.directFirstApproveItems);

    $.each(constant.customer().customerChance.config.datas, function(i, v) {

        if (v.key != 0) {
            customerChance.config.push(v);
        }
    });

    customerChance.items.houseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.houseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.resourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    customerChance.items.houseTypeApprove.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.houseClassApprove.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.resourceTypeApprove.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    customerChance.items.directHouseType.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    customerChance.items.directHouseClass.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    customerChance.items.directResourceType.bindData(constant.decoration().decoration.resourceType.datas, 'key', 'value');

    customerChance.items.configEvent.bindData(customerChance.config, "key", "value");
    customerChance.items.isFine.bindData(constant.customer().customerChance.config.datas, "key", "value");

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            customerChance.decoration.types[v.key] = v.type;

            if (v.status == 0) {
                customerChance.atttypes.push(v);
            }
        });

        customerChance.items.orderType.bindData(customerChance.atttypes, 'key', 'name');
        customerChance.items.orderTypeApprove.bindData(customerChance.atttypes, 'key', 'name');
        customerChance.items.directOrderType.bindData(customerChance.atttypes, 'key', 'name');
    });

    com.post(api.customer.queryCustomerUserRule, {
        "customerUserRule.user.uid": params.userInfo.user.uid,
    }, function(res) {

        if (res.customerUserRule)
            customerChance.userRule = res.customerUserRule;

    }, null, false);

    function drawInfo() {

        var $widget = $('<div></div>').addClass("widget-container-span col-xs-6 col-md-3").prependTo(customerChance.items.infolist);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var $name = $('<h4></h4>').attr('id', 'h4name_').text("分配规则").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('得分: ' + customerChance.userRule.score)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('机会数: ' + customerChance.userRule.chance)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('轮询数: ' + customerChance.userRule.polling)).appendTo($info);

        var $enable = $('<a></a>').addClass('btn btn-app btn-success').click(function() {

            com.showConfirm("是否启用人员规则", function() {

                updateUserRule($disable, $enable);
            });
        });
        var $enableI = $('<i></i>').addClass('icon-ok-circle bigger-230');
        var $enableS = $('<span></span>').html("停止接单");

        if (customerChance.depage == "user" || customerChance.depage == "designer")
            $enable.append($enableI).append($enableS).appendTo(customerChance.items.infolist);

        var $disable = $('<a></a>').addClass('btn btn-app btn-warning').click(function() {

            com.showConfirm("是否禁用人员规则", function() {

                updateUserRule($enable, $disable);
            });
        });
        $('<i></i>').addClass('icon-ban-circle bigger-230');

        var $disableI = $('<i></i>').addClass('icon-ban-circle bigger-230');
        var $disableS = $('<span></span>').html("恢复接单");

        if (customerChance.depage == "user" || customerChance.depage == "designer")
            $disable.append($disableI).append($disableS).appendTo(customerChance.items.infolist);

        customerChance.userRule.status == 0 ? $enable.hide() : $disable.hide();
    }

    // if (customerChance.depage != "source")
    // drawInfo();

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.customer.pageCustomerChance);

    searcher.condition(customerChance.depage != "source" ? ["customer-chance-orderId", "customer-chance-source-name", "customer-chance-customer-phone", "customer-chance-house-village-no", "customer-chance-house-houseNumber", "customer-chance-source-buildArea", "customer-chance-type", "customer-chance-status", "customer-chance-isFine", "customer-chance-belonger", "customer-chance-source-creater", "customer-chance-belonger-dept", "customer-chance-source-creater-dept", "customer-chance-finer", "customer-chance-source-createTime", "customer-chance-createTime", "customer-chance-fineTime", "customer-chance-source-houseAttr"] : []);

    searcher.history(customerChance.depage + "customerChancePostData");

    var extraParams = {
        "customerChance.belonger.uid": null
    };

    if (customerChance.depage == 'user' || customerChance.depage == 'designer') {
        extraParams["customerChance.belonger.userId"] = params.userInfo.user.userId;
    } else if (customerChance.depage == "dept") {
        extraParams["customerChance.belonger.dept.no"] = params.userInfo.user.dept.no;
    } else if (customerChance.depage == "region") {
        extraParams["customerChance.belonger.dept.fatherDept.no"] = params.userInfo.user.dept.fatherDept.no;
    } else if (customerChance.depage == "source") {
        extraParams["customerChance.source.csid"] = params.customer.customerSource.csid;
    }

    searcher.param(extraParams);

    var lineprops = [{
        field: "orderId",
        name: "预派单号",
        prop: "orderId",
        clazz: "blue",
        show: function(v){
            return !!v.orderId;
        }
    }, {
        field: "cno",
        name: "线索编号",
        prop: "cno",
        clazz: "blue"
    }, {
        field: "source",
        name: "客户姓名",
        prop: "source.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.customer.info(btn, v.customer.cid);
        }
    }, {
        field: "phone",
        name: "客户电话",
        prop: function(v) {

            if (v.customer && v.customer.phone) {
                return v.customer.phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2");
            } else {
                return v.source.phone;
            }
        },
        clazz: "grey",
        show: function(v) {

            return ((v.isRead == constant.customer().customerChance.ISREAD_READ_INT) && (customerChance.depage == "user" || customerChance.depage == "designer"));
        }
    }, {
        field: "source",
        name: "楼盘",
        prop: function(v) {

            var info = "";

            if (v.house && v.house.village && v.house.village.name)
                info = v.house.village.name;
            else
                info = v.source.village.name;

            return info;
        },
        clazz: "grey",
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: function(v) {

            var info = "";

            if (v.house && v.house.houseNumber)
                info = v.house.houseNumber;
            else
                info = v.source.houseNumber;

            return info;
        },
        clazz: "grey",
    }, {
        field: "source",
        name: "派尺面积",
        prop: "source.buildArea",
        clazz: "blue",
    }, {
        field: "busitype",
        name: "业务类型",
        prop: "source.busitype.name",
        clazz: "red",
    }, {
        field: "outside",
        name: "三方标识",
        prop: "busitype.outside",
        clazz: "red",
        dataset: constant.data().decorationBusitype.outside.keys
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.creater.userId);
        }
    }, {
        field: "issueTime",
        name: "分配时间",
        prop: "issueTime",
        clazz: "green"
    }, {
        field: "belonger",
        name: "归属人",
        prop: "belonger.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.belonger.userId);
        }
    }, {
        field: "department",
        name: "归属部门",
        prop: "department.name",
        clazz: "grey"
    }, {
        field: "region",
        name: "归属分区",
        prop: "region.name",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.customer().customerChance.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.customer().customerChance.status.keys,
    }, {
        field: "isRead",
        name: "已读标识",
        prop: "isRead",
        clazz: "red",
        dataset: constant.customer().customerChance.isRead.keys,
    }, {
        field: "isGroup",
        name: "建群",
        prop: "isGroup",
        clazz: "red",
        dataset: constant.customer().customerChance.config.keys,
    }, {
        field: "isPhone",
        name: "电话交接",
        prop: "isPhone",
        clazz: "red",
        dataset: constant.customer().customerChance.config.keys,
    }, {
        field: "isMeet",
        name: "是否见面",
        prop: "isMeet",
        clazz: "red",
        dataset: constant.customer().customerChance.config.keys,
    }, {
        field: "isTrue",
        name: "真实地址",
        prop: "isTrue",
        clazz: "red",
        dataset: constant.customer().customerChance.config.keys,
        show: function(v) {

            return customerChance.show != null;
        }
    }, {
        field: "isFine",
        name: "是否罚款",
        prop: "isFine",
        clazz: "red",
        dataset: constant.customer().customerChance.isFine.keys,
    }, {
        field: "isCheck",
        name: "是否校验",
        prop: "isCheck",
        clazz: "red",
        dataset: constant.customer().customerChance.isCheck.keys,
        show: function(v) {

            return customerChance.depage == null;
        }
    }, {
        field: "fineTime",
        name: "罚款时间",
        prop: "fineTime",
        clazz: "green",
    }, {
        field: "finer.currentName",
        name: "罚款人",
        prop: "finer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.finer.userId);
        }
    }, {
        field: "readTime",
        name: "已读时间",
        prop: "readTime",
        clazz: "green"
    }, {
        field: "source.source",
        name: "来源方",
        prop: "source.source",
        clazz: "grey",
    }, {
        field: "source.contact",
        name: "对接人",
        prop: "source.contact",
        clazz: "grey",
    }, {
        field: "referOrderId",
        name: "推荐单号",
        prop: function(v) {

            return v.source.referOrderId ? v.source.referOrderId : "";
        },
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.referOrderId);
        },
        show: function(v) {

            return (customerChance.depage == null || customerChance.depage == "manage");
        }
    }, {
        field: "source.houseAttr",
        name: "房屋属性",
        prop: "source.houseAttr",
        clazz: "red",
        dataset: constant.customer().customerSource.houseAttr.keys
    }, {
        field: "source.comment",
        name: "备注",
        prop: "source.comment",
        clazz: "grey"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "已读",
        clazz: "btn-yellow",
        handle: function(v) {

            com.post(api.customer.readCustomerChance, {
                "customerChance.ccid": v.ccid
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return v.isRead != constant.customer().customerChance.ISREAD_READ_INT && v.status != constant.customer().customerChance.STATUS_DISTRIBUTION_INT && (customerChance.depage == "user" || customerChance.depage == "designer") && customerChance.detype == null;
        }
    }, {
        name: "分配",
        clazz: "btn-success",
        handle: function(v) {

            com.cleanTypeahead('region');
            com.cleanTypeahead('belonger');
            com.cleanTypeahead('busitype');

            customerChance.ccid = v.ccid;

            customerChance.modals.issueModal.modal("show");

        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2) && customerChance.depage != "source" && customerChance.detype == null;
        }
    }, {
        name: "是否建群",
        clazz: "btn-warning",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.confirmEventType = "isGroup";

            com.focusPage("#configTitle", "#configModal").text("是否建群");
            com.focusPage("#configName", "#configModal").text("建群");

            customerChance.modals.configModal.modal("show");
        },
        show: function(v) {

            return v.isGroup != constant.customer().customerChance.CONFIRM_CONFIRM_INT && customerChance.detype == null;
        }
    }, {
        name: "是否电话交接",
        clazz: "btn-inverse",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.confirmEventType = "isPhone";

            com.focusPage("#configTitle", "#configModal").text("是否电话交接");
            com.focusPage("#configName", "#configModal").text("电话交接");

            customerChance.modals.configModal.modal("show");
        },
        show: function(v) {

            return v.isPhone != constant.customer().customerChance.CONFIRM_CONFIRM_INT && customerChance.detype == null;
        }
    }, {
        name: "是否见面",
        clazz: "btn-purple",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.confirmEventType = "isMeet";

            com.focusPage("#configTitle", "#configModal").text("是否见面");
            com.focusPage("#configName", "#configModal").text("是否见面");

            customerChance.modals.configModal.modal("show");
        },
        show: function(v) {

            return v.isMeet != constant.customer().customerChance.CONFIRM_CONFIRM_INT && customerChance.detype == null;
        }
    }, {
        name: "真实地址",
        clazz: "btn-danger",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.confirmEventType = "isTrue";

            com.focusPage("#configTitle", "#configModal").text("是否真实地址");
            com.focusPage("#configName", "#configModal").text("真实地址");

            customerChance.modals.configModal.modal("show");
        },
        show: function(v) {

            // return v.isTrue != constant.customer().customerChance.CONFIRM_CONFIRM_INT;
            return customerChance.show != null && customerChance.detype == null;
        }
    }, {
        name: "罚款",
        clazz: "btn-pink",
        handle: function(v) {

            fineCustomerChance(v.ccid);
        },
        show: function(v) {

            return customerChance.depage == "manage" && v.isFine == constant.customer().customerChance.ISFINE_UNFINE_INT && customerChance.detype == null;
        }
    }, {
        name: "不校验",
        clazz: "btn-info",
        handle: function(v) {

            uncheckCustomerChance(v.ccid);
        },
        show: function(v) {

            return customerChance.depage == null && v.isCheck == constant.customer().customerChance.ISCHECK_CHECK_INT && customerChance.detype == null;
        }
    }, {
        name: "不匹配",
        clazz: "btn-yellow",
        handle: function(v) {

            customerChance.ccid = v.ccid;
            customerChance.chance = v;

            customerChance.modals.disableModal.modal("show");
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2 || v.status == 3) && customerChance.depage != "source" && customerChance.detype == null;
        },
    }, {
        name: "推送",
        clazz: "btn-success",
        handle: function(v) {

            send(v);
        },
        show: function(v) {

            return customerChance.depage != "source" && v.status != constant.customer().customerChance.STATUS_DISTRIBUTION_INT && customerChance.detype == null;
        },
    }, {
        name: "确认",
        clazz: "btn-warning",
        handle: function(v) {

            confirm(v.ccid);
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT || v.status == 2) && customerChance.depage == "manage";
        },
    }, {
        name: "转换",
        clazz: "btn-inverse",
        handle: function(v) {

            customerChance.ccid = v.ccid;
            customerChance.chance = v;

            if (!v.house || !v.house.hid) {
                com.showAlert(com.error, "房产不存在");
                return false;
            }

            if (!v.customer || !v.customer.cid) {
                com.showAlert(com.error, "客户不存在");
                return false;
            }

            com.post(api.customer.checkCustomerProtectRule, {
                "customerProtectRule.hid": v.house.hid,
                "customerProtectRule.cid": v.customer.cid,
                "customerProtectRule.duty.did": v.belonger.duty.did
            }, function(res) {

                var rule = res.customerProtectRule;

                if (rule.cprid && rule.orderId) {

                    customerChance.orderId = rule.orderId;

                    approvalUtils.initqueryApprovalUser('belongApproveMan', 3);

                    customerChance.modals.belongApproveModal.modal("show");

                    return false;
                }

                if (!rule.cprid && rule.orderId) {

                    com.post(api.decoration.tranDecorationBelong, {
                        "decorationBelong.orderId": rule.orderId,
                        "decorationBelongs[0].belonger.userId": v.belonger.userId,
                        "decorationBelongs[0].type": 0,
                        "decorationBelongs[1].belonger.userId": v.creater.userId,
                        "decorationBelongs[1].type": 1
                    }, function(res) {

                        com.post(api.customer.finishCustomerChance, {
                            "customerChance.ccid": v.ccid,
                            "decoration.orderId": rule.orderId
                        });

                    });

                    return false;
                }

                customerChance.modals.changeModal.modal("show");
            }, null, false);

        },
        show: function(v) {

            return v.status == 3 && customerChance.depage != "source" && customerChance.detype == null;
        },
    }, {
        name: "编辑",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanTypeahead("villageName");
            com.cleanItems(customerChance.updateItems);

            customerChance.ccid = v.ccid;
            customerChance.source.csid = v.source.csid;
            customerChance.source.name = v.source.name;
            customerChance.source.gender = v.source.gender;

            var village = (v.house.village && v.house.village.vid) ? v.house.village : v.source.village;

            if (village && village.parentVillage && village.parentVillage.vid) {
                com.focusPage("#villageName", "#updateModal").typeahead("args", {
                    "village.parentVillage.vid": village.parentVillage.vid
                });
            }

            if (village && village.vid) {
                com.updateTypeahead(customerChance.updateItems.villageName, village.no, village.name);
            }

            customerChance.modals.updateModal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT) && (customerChance.depage == "user" || customerChance.depage == "designer") && v.isGroup != 0 && v.isPhone != 0 && v.isMeet == 2 && customerChance.detype == null;
        },
    }, {
        name: "初审",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanTypeahead("villageName");
            com.cleanTypeahead("firstApproveComment");
            com.cleanItems(customerChance.approveItems);

            customerChance.ccid = v.ccid;
            customerChance.source.csid = v.source.csid;
            customerChance.source.name = v.source.name;
            customerChance.source.gender = v.source.gender;

            var village = (v.house.village && v.house.village.vid) ? v.house.village : v.source.village;

            if (village && village.parentVillage && village.parentVillage.vid) {
                com.focusPage("#villageName", "#firstApproveModal").typeahead("args", {
                    "village.parentVillage.vid": village.parentVillage.vid
                });
            }

            if (village && village.vid) {
                com.updateTypeahead(customerChance.approveItems.villageName, village.no, village.name);
            }

            customerChance.approveItems.busitype.val(v.busitype.dbid);

            approvalUtils.initqueryApprovalUser('firstApproveMan', 20);

            customerChance.modals.firstApproveModal.modal("show");

            return false;
        },
        show: function(v) {
            // 审批初审隐藏，改用直接初审
            return false;
        },
    }, {
        name: "直接初审",
        clazz: "btn-purple",
        handle: function(v) {

            com.cleanTypeahead("directFirstVillageName");
            com.cleanItems(customerChance.directFirstApproveItems);

            customerChance.ccid = v.ccid;
            customerChance.source.csid = v.source.csid;
            customerChance.source.name = v.source.name;
            customerChance.source.gender = v.source.gender;

            var village = (v.house.village && v.house.village.vid) ? v.house.village : v.source.village;

            if (village && village.parentVillage && village.parentVillage.vid) {
                com.focusPage("#directFirstVillageName", "#directFirstApproveModal").typeahead("args", {
                    "village.parentVillage.vid": village.parentVillage.vid
                });
            }

            if (village && village.vid) {
                com.updateTypeahead(customerChance.directFirstApproveItems.villageName, village.no, village.name);
            }

            customerChance.directFirstApproveItems.busitype.val(v.busitype.dbid);

            customerChance.modals.directFirstApproveModal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.status == constant.customer().customerChance.STATUS_INIT_INT) && (customerChance.depage == "user" || customerChance.depage == "designer") && v.isGroup != 0 && v.isPhone != 0 && v.isMeet == 2 && customerChance.detype == null;
        },
    }, {
        name: "审批",
        clazz: "btn-danger",
        handle: function(v) {

            approvalUtils.initqueryApprovalUser('approveMan', 21);

            customerChance.ccid = v.ccid;

            customerChance.currentCustomerChance = v;
            customerChance.items.villageNoDesigerApprove.prop("disabled", true);
            customerChance.items.houseNumberApprove.attr("disabled", "disabled");
            customerChance.items.nameApprove.attr("disabled", "disabled");
            customerChance.items.phoneApprove.attr("disabled", "disabled");
            com.cleanTypeahead('approveComment');

            v.busitype != null ? customerChance.items.busitypeApprove.val(v.busitype.dbid) : "";

            com.updateTypeahead('villageNoDesigerApprove', v.source.village.no, v.source.village.name + "-" + v.source.village.cityProper.name);

            customerChance.items.houseNumberApprove.val(v.source.houseNumber);
            customerChance.items.nameApprove.val(v.source.name);
            customerChance.items.phoneApprove.val(v.source.phone);

            customerChance.modals.approveModal.modal("show");
        },
        show: function(v) {

            // return v.status == 3 && customerChance.depage == "user";
            return customerChance.detype == null;
        },

    }, {
        name: "审核",
        clazz: "btn-success",
        handle: function(v) {

            customerChance.ccid = v.ccid;
            customerChance.currentCustomerChance = v;

            // 填充弹窗数据
            v.busitype != null ? customerChance.items.directBusitype.val(v.busitype.dbid) : "";
            com.updateTypeahead('directVillageNo', v.source.village.no, v.source.village.name + "-" + v.source.village.cityProper.name);
            customerChance.items.directHouseNumber.val(v.source.houseNumber);
            customerChance.items.directName.val(v.source.name);
            customerChance.items.directPhone.val(v.source.phone);

            // 打开直接审核弹窗
            customerChance.modals.directApproveModal.modal("show");

            return false;
        },
        show: function(v) {

            return v.status == constant.customer().customerChance.STATUS_INIT_INT && (customerChance.depage == "user" || customerChance.depage == "designer") && customerChance.detype == null;
        },
    }, {
        name: "记录",
        clazz: "btn-pink",
        handle: function(v) {

            params.customer.customerSource = v.source;

            if (customerChance.depage != "manage") {
                params['urlLoadParams'].type = 0;
            }

            com.popup4page("#layerPopUp", "/views/customer/customerSourceRecord.html", "记录", "", function() {

                searcher.doSearch();
            });

            return false;
        },
        show: function(res) {

            return !customerChance.depage || customerChance.depage == "manage";
        }
    }, {
        name: "画像",
        clazz: "btn-yellow",
        handle: function(v) {

            params.customer.source = v;
            // com.switchPage(api.index.profileInfo.url); 跳转新页面

            params.customer.csid = v.source.csid;
            params.customer.profile = {
                "type": 1,
                "csid": v.source.csid
            }

            com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: 设计需求完善");

            return false;
        },
        show: function(v) {

            // return v.status == 3 && customerChance.depage == "user";
            return customerChance.detype == null;
        },
    }, {
        name: "折扣",
        clazz: "btn-success",
        handle: function(v) {

            customerChance.ccid = v.ccid;

            customerChance.modals.discountModal.modal("show");

            return false;
        },
    }];

    searcher.line("source.name", lineprops, linebtns).render();

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 1
    }, function(res) {

        customerChance.items.region.bindData(res.deptList, "did", "name", true);
    });

    com.post(api.communion.queryDepartment, {
        "dept.type.dtid": 2
    }, function(res) {

        customerChance.items.department.bindData(res.deptList, "did", "name", true);
    });

    var ruleflag = null;

    com.post(api.system.querySystemConfigByKey, {
        "systemConfig.key": "CUSTOMER_CHANCE_ISSUE_RULE"
    }, function(res) {

        ruleflag = res.systemConfig.value;

    }, null, false);

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "user.dept.did": (((customerChance.depage == "dept" || customerChance.depage == "user") && ruleflag != null) ? params.userInfo.user.dept.did : null),
        "user.dept.fatherDept.did": (customerChance.depage == "region" && ruleflag != null ? params.userInfo.user.dept.fatherDept.did : null),
    }, "autoFillKeyValue", "key", "value");

    com.post(api.data.queryDecorationBusitype, {}, function(res) {

        var $arr = [];

        $.each(res.decorationBusitypes, function(intex, value) {

            if (value.status == 0) {
                $arr.push(value);
            }
        });

        customerChance.items.busitypeApprove.bindData($arr, 'dbid', 'name');
        customerChance.items.busitype.bindData($arr, "dbid", "name", true);
        customerChance.items.directBusitype.bindData($arr, 'dbid', 'name');
        customerChance.approveItems.busitype.bindData($arr, 'dbid', 'name');
        customerChance.updateItems.busitype.bindData($arr, 'dbid', 'name');
        customerChance.directFirstApproveItems.busitype.bindData($arr, 'dbid', 'name');
    });

    function issue() {

        if (com.validate("issueModal")) {
            return false;
        }

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "customerChance.region.did": customerChance.items.region.val(),
            "customerChance.department.did": customerChance.items.department.val(),
            "customerChance.belonger.userId": com.typeahead("belonger"),
            "customerChance.busitype.dbid": customerChance.items.busitype.val(),
        };

        com.post(api.customer.issueCustomerChance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        customerChance.modals.issueModal.modal("hide");
    }

    function disable() {

        var options = {
            "approval.receiver.userId": customerChance.chance.belonger.userId,
            "approval.comment": customerChance.items.annotate.val(),

            "approvalCustomerChance.chance.ccid": customerChance.ccid
        };

        com.post(api.approval.submitApprovalForCustomerChanceToDisabled, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.clearValidator();
            searcher.doSearch();

            customerChance.modals.disableModal.modal("hide");
        });
    }

    function discount() {

        var options = {
            "customerChance.chance.ccid": customerChance.ccid
        };

        com.post(api.customer.discountCustomerChance, options, function(res) {

            com.showAlert(com.info, "操作成功");

            com.clearValidator();
            searcher.doSearch();

            customerChance.modals.discountModal.modal("hide");
        });
    }

    function send(v) {

        com.focusPage('#QRcode').html("");

        com.focusPage('#QRcode').qrcode({
            render: "canvas",
            width: 150,
            height: 150,
            text: 'http://fanglin.vip/wx/customerchance?csid=' + v.source.csid + '&ccid=' + v.ccid

        });

        customerChance.modals.QRcodeModal.modal('show');
    }

    function confirm(ccid) {

        var options = {
            "customerChance.ccid": ccid,
        };

        com.showConfirm("确认机会信息", function() {

            com.post(api.customer.affirmCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "确认成功");
            });
        });
    }

    function change() {

        var options = {
            "customerChance.ccid": customerChance.ccid,
            "decoration.type": customerChance.decoration.types[customerChance.items.orderType.val()],
            "decoration.typeness": customerChance.items.orderType.val(),
            "decoration.resourceType": customerChance.items.resourceType.val(),
            "decoration.houseType": customerChance.items.houseType.val(),
            "decoration.houseClass": customerChance.items.houseClass.val(),
        };

        if (customerChance.profitflag) {
            options["decoration.bompany"] = customerChance.profitflag;
        }

        com.post(api.customer.changeCustomerChance, options, function(res) {

            searcher.doSearch();

            com.showAlert(com.info, "转换成功");

            customerChance.modals.changeModal.modal("hide");
        });
    }

    // 提交审批
    function approval() {

        if (com.validate("approveModal")) {
            return false;
        }

        // 审批创建装修单
        var approver = com.focusPage("#approveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerChance.items.approveComment.val(),

                "approvalCustomerChance.chance.ccid": customerChance.ccid,
                "approvalCustomerChance.type": customerChance.decoration.types[customerChance.items.orderTypeApprove.val()],
                "approvalCustomerChance.typeness": customerChance.items.orderTypeApprove.val(),
                "approvalCustomerChance.busitype.dbid": customerChance.items.busitypeApprove.val(),
                "approvalCustomerChance.houseType": customerChance.items.houseTypeApprove.val(),
                "approvalCustomerChance.houseClass": customerChance.items.houseClassApprove.val(),
                "approvalCustomerChance.resourceType": customerChance.items.resourceTypeApprove.val()
            };

            com.post(api.approval.submitApprovalForCustomerChance, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerChance.modals.approveModal.modal("hide");
            });
        });
    }

    // 直接审核确认函数（新弹窗的提交函数）
    function directApproveConfirm() {

        if (com.validate("directApproveModal")) {
            return false;
        }

        var option = {
            "customerChance.ccid": customerChance.ccid
        };

        com.post(api.customer.tranCustomerChance, option, function(res) {

            com.showAlert(com.info, "操作成功");

            com.clearValidator();
            searcher.doSearch();

            customerChance.modals.directApproveModal.modal("hide");
        });
    }

    // 直接初审确认函数
    function directFirstApproveConfirm() {

        if (com.validate("directFirstApproveModal")) {
            return false;
        }

        var hid = checkHouse(customerChance.directFirstApproveItems);

        if (!hid)
            return false;

        var cid = checkCustomer(customerChance.directFirstApproveItems);

        if (!cid)
            return false;

        var option = {
            "customerChance.ccid": customerChance.ccid,
            "customerChance.house.hid": hid,
            "customerChance.customer.cid": cid,
            "customerChance.busitype.dbid": customerChance.directFirstApproveItems.busitype.val(),
            "customerChance.rate": 0
        };

        com.post(api.customer.approveCustomerChance, option, function(res) {

            com.showAlert(com.info, "直接初审成功");

            com.clearValidator();
            searcher.doSearch();

            customerChance.modals.directFirstApproveModal.modal("hide");
        });
    }

    function update() {

        if (com.validate("updateModal")) {
            return false;
        }

        var hid = checkHouse(customerChance.updateItems);

        if (!hid)
            return false;

        var cid = checkCustomer(customerChance.updateItems);

        var option = {
            "customerChance.ccid": customerChance.ccid,
            "customerChance.house.hid": hid,
            "customerChance.busitype.dbid": customerChance.approveItems.busitype.val(),
            "customerChance.rate": 0,
            "customerChance.customer.cid": cid
        };

        com.post(api.customer.updateCustomerChance, option, function(res) {

            com.showAlert(com.info, "操作成功");

            com.clearValidator();
            searcher.doSearch();

            customerChance.modals.updateModal.modal("hide");
        });

    }

    // 提交初审
    function firstApproval() {

        if (com.validate("firstApproveModal")) {
            return false;
        }

        var approver = com.focusPage("#firstApproveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        var hid = checkHouse(customerChance.approveItems);

        if (!hid)
            return false;

        var cid = checkCustomer(customerChance.approveItems);

        com.showConfirm("是否确认提交审批", function() {

            var option = {
                "approval.receiver.userId": approver,
                "approval.comment": customerChance.items.firstApproveComment.val(),
                "approvalCustomerSource.csid": customerChance.source.csid,
                "approvalCustomerSource.ccid": customerChance.ccid,
                "approvalCustomerSource.hid": hid,
                "approvalCustomerSource.dbid": customerChance.approveItems.busitype.val(),
                "approvalCustomerSource.rate": 0,
                "approvalCustomerSource.cid": cid
            };

            com.post(api.approval.submitApprovalForCustomerSource, option, function(res) {

                com.showAlert(com.info, "操作成功");

                com.clearValidator();
                searcher.doSearch();

                customerChance.modals.firstApproveModal.modal("hide");
            });

        });
    }

    function belongApproval() {

        if (com.validate("belongApproveModal")) {
            return false;
        }

        var approver = com.focusPage("#belongApproveMan").find('input:checked').attr('userid');

        if (approver == null || approver == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        com.showConfirm("是否确认提交审批", function() {

            var options = {
                "approval.receiver.userId": approver,
                "approval.comment": customerChance.belongItems.belongApproveComment.val()
            };

            options["approvalDecorationBelong.orderId"] = customerChance.orderId;
            options["approvalDecorationBelong.belongType"] = 0;

            options["approvalDecorationBelongItems[0].orderId"] = customerChance.orderId;
            options["approvalDecorationBelongItems[0].userId"] = customerChance.chance.belonger.userId;
            options["approvalDecorationBelongItems[0].bdid"] = customerChance.chance.department.did;
            options["approvalDecorationBelongItems[0].brid"] = customerChance.chance.region.did;
            options["approvalDecorationBelongItems[0].rate"] = 1;
            options["approvalDecorationBelongItems[0].defaultFlag"] = 1;

            com.post(api.approval.submitApprovalForDecorationBelong, options, function(res) {

                com.showAlert(com.info, "操作成功, 等待审批通过");

                com.clearValidator();
                searcher.doSearch();

                customerChance.modals.belongApproveModal.modal("hide");
            });
        });
    }

    // 检查获取楼盘
    function checkHouse(items) {

        var hid = "";
        var villageRule = items.villageRule.val().toString();
        var houseNumber = "";

        var rulenum = [items.built.val().trim().toUpperCase(), items.builtrule.val(), items.unit.val().trim().toUpperCase(), items.unitrule.val(), items.floor.val().trim().toUpperCase(), items.floorrule.val(), items.door.val().trim().toUpperCase(), items.doorrule.val()];

        var houseNumber = houseUtils.creatHouseNumber(rulenum);

        var regex = new RegExp(villageRule);

        if (!regex.test(houseNumber)) {
            com.showAlert(com.error, "楼号格式错误");
            return false;
        }

        var houseOption = {
            "house.village.no": com.typeahead(items.villageName),
            "house.houseNumber": houseNumber,
            "house.built": items.built.val(),
            "house.unit": items.unit.val(),
            "house.floor": items.floor.val(),
            "house.door": items.door.val()
        };

        if (items.buildArea) {
            houseOption["house.buildArea"] = items.buildArea.val();
        }

        if (items.freeArea) {
            houseOption["house.freeArea"] = items.freeArea.val();
        }

        if (items.totalArea) {
            houseOption["house.totalArea"] = items.totalArea.val();
        }

        if (items.buildArea) {
            houseOption["house.innerArea"] = items.innerArea.val();
        }

        com.post(api.data.existHouse, houseOption, function(res) {

            hid = res.house.hid;
        }, null, false);

        return hid;
    }

    // 检查获取客户
    function checkCustomer(items) {

        var cid = "";
        var customerOption = {
            "customer.name": customerChance.source.name,
            "customer.phone": items.phone.val(),
            "customer.gender": customerChance.source.gender,
            "customer.relationshipType": "普通客户",
            "customer.qq": "",
            "customer.wechat": "",
            "customer.email": "",
            "customer.address": ""
        };

        com.post(api.data.existCustomer, customerOption, function(res) {

            cid = res.customer.cid;
        }, null, false);

        return cid;
    }

    // 启用禁用个人规则
    function updateUserRule(btn1, btn2) {

        if (customerChance.userRule.curid == null) {
            com.showAlert(com.error, "无人员规则信息");
            return false;
        }

        com.post(api.customer.updateCustomerUserRuleForStatus, {
            "customerUserRule.curid": customerChance.userRule.curid,
            "customerUserRule.status": 2,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            btn2.hide();
            btn1.show();
            return false;
        });
    }

    function configEvent(v) {

        var options = {
            "customerChance.ccid": customerChance.ccid
        };

        if (customerChance.confirmEventType == "isGroup") {
            options["customerChance.isGroup"] = customerChance.items.configEvent.val();
        }

        if (customerChance.confirmEventType == "isPhone") {
            options["customerChance.isPhone"] = customerChance.items.configEvent.val();
        }

        if (customerChance.confirmEventType == "isMeet") {
            options["customerChance.isMeet"] = customerChance.items.configEvent.val();
        }

        if (customerChance.confirmEventType == "isTrue") {
            options["customerChance.isTrue"] = customerChance.items.configEvent.val();
        }

        com.post(api.customer.configCustomerChance, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");

            customerChance.modals.configModal.modal("hide");
        });
    }

    function fineCustomerChance(ccid) {

        var options = {
            'customerChance.ccid': ccid
        };

        com.showConfirm("确认要罚款吗", function() {

            com.post(api.customer.fineCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功!");
            });
        });
    }

    function uncheckCustomerChance(ccid) {

        var options = {
            'customerChance.ccid': ccid
        };

        com.showConfirm("确认要设置为不校验状态吗？", function() {

            com.post(api.customer.uncheckCustomerChance, options, function(res) {

                searcher.doSearch();
                com.showAlert(com.info, "操作成功!");
            });
        });
    }

});
